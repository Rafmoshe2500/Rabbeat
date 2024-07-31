import React, { useState, useRef, useEffect } from "react";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import { useUser } from "../../contexts/user-context";
import { useChat } from "../../hooks/chat/useChat";
import { Box, Typography, IconButton } from "@mui/material";
import { styled } from "@mui/system";

interface ChatProps {
  chatId: string;
}

const ChatContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  maxHeight: '500px',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
}));

const MessagesContainer = styled(Box)({
  flexGrow: 1,
  overflowY: 'auto',
  padding: '16px',
});

const MessageWrapper = styled(Box)<{ isCurrentUser: boolean }>(({ isCurrentUser }) => ({
  display: 'flex',
  justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
  marginBottom: '8px',
}));

const MessageBubble = styled(Box)<{ isCurrentUser: boolean }>(({ theme, isCurrentUser }) => ({
  maxWidth: '70%',
  padding: '8px 12px',
  borderRadius: '12px',
  backgroundColor: isCurrentUser ? theme.palette.primary.main : theme.palette.grey[300],
  color: isCurrentUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
}));

const InputContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '8px',
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const InputField = styled('input')(({ theme }) => ({
  flexGrow: 1,
  border: 'none',
  padding: '8px',
  fontSize: '14px',
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  '&:focus': {
    outline: 'none',
  },
}));

const ButtonGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.main,
  padding: '8px',
  '&:hover': {
    backgroundColor: 'rgba(139, 69, 19, 0.04)',
  },
}));

const Chat: React.FC<ChatProps> = ({ chatId }) => {
  const { userDetails } = useUser();
  const userType = userDetails!.type!;
  const {
    messagesQuery,
    sendMessageMutation,
    fetchChatNotificationsQuery,
    clearChatNotificationsMutation,
  } = useChat(chatId, userDetails?.type!);
  const { data: messages } = messagesQuery;
  const { mutate: setMessages } = sendMessageMutation;
  const { data: notifications } = fetchChatNotificationsQuery;
  const { mutate: clearNotifications } = clearChatNotificationsMutation;

  const [inputMessage, setInputMessage] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    clearNotifications();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prevTime) => {
          if (prevTime >= 7) {
            stopRecording();
            return 7;
          }
          return prevTime + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage: Message = {
        sender: userType,
        content: inputMessage,
        type: "text",
        timestamp: new Date().toISOString(),
      };
      setMessages(newMessage);
      setInputMessage("");
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
        const newMessage: Message = {
          sender: userType,
          content: audioBlob,
          type: "audio",
          timestamp: new Date().toISOString(),
        };
        setMessages(newMessage);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingTime(0);
    }
  };

  return (
    <ChatContainer>
      <MessagesContainer>
        {messages?.map((msg, index) => (
          <MessageWrapper key={index} isCurrentUser={msg.sender === userType}>
            <MessageBubble isCurrentUser={msg.sender === userType}>
              {msg.type === "text" ? (
                <Typography variant="body2">{msg.content as string}</Typography>
              ) : (
                <audio
                  ref={audioRef}
                  controls
                  src={URL.createObjectURL(msg.content as Blob)}
                  style={{ maxWidth: '100%', height: '30px' }}
                />
              )}
            </MessageBubble>
          </MessageWrapper>
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      <InputContainer>
        <InputField
          ref={inputRef}
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Type a message..."
        />
        <ButtonGroup>
          <ActionButton onClick={handleSendMessage}>
            <SendIcon fontSize="small" />
          </ActionButton>
          <ActionButton onClick={isRecording ? stopRecording : startRecording}>
            {isRecording ? (
              <>
                <StopIcon fontSize="small" />
                <span style={{ marginLeft: '4px', fontSize: '12px' }}>
                  {recordingTime}s
                </span>
              </>
            ) : (
              <MicIcon fontSize="small" />
            )}
          </ActionButton>
        </ButtonGroup>
      </InputContainer>
    </ChatContainer>
  );
};

export default Chat;