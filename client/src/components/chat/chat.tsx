import React, { useState, useRef, useEffect } from "react";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import styles from "./chat.module.scss";
import { useUser } from "../../contexts/user-context";
import { useChat } from "../../hooks/chat/useChat";
import { ChatBubble } from "@mui/icons-material";
import { Badge } from "@mui/material";

interface ChatProps {
  chatId: string;
  title?: string;
}

const Chat: React.FC<ChatProps> = ({ chatId, title }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { userDetails } = useUser();
  const userType = userDetails!.type!;
  const {
    messagesQuery,
    sendMessageMutation,
    fetchChatNotificationsQuery,
    clearChatNotificationsMutation,
  } = useChat(chatId, userDetails?.type!);
  const { data: messages, refetch: refetchMessages } = messagesQuery;
  const { mutate: setMessages } = sendMessageMutation;
  const { data: notifications } = fetchChatNotificationsQuery;
  const { mutate: clearNotifications } = clearChatNotificationsMutation;

  const [inputMessage, setInputMessage] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chatMessagesRef = useRef<HTMLDivElement | null>(null);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
    if (notifications) clearNotifications();
  };

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

  const scrollToBottom = () => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage: Message = {
        sender: userType,
        content: inputMessage,
        type: "text",
        timestamp: new Date().toISOString(),
      };
  
      setMessages(newMessage, {
        onSuccess: () => {
          // Immediately refetch messages after sending
          refetchMessages().then(() => {
            scrollToBottom();
          });
        },
      });
  
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
  
        setMessages(newMessage, {
          onSuccess: () => {
            // Immediately refetch messages after sending the audio message
            refetchMessages().then(() => {
              scrollToBottom();
            });
          },
        });
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
    <>
      <button onClick={toggleChat} className={styles.imageButton} id="chat">
        {notifications ? (
          <Badge
            color="success"
            overlap="circular"
            badgeContent={notifications}
          >
            <ChatBubble />
          </Badge>
        ) : (
          <ChatBubble />
        )}
      </button>

      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <h3>צ'אט - {title}</h3>
            <button
              onClick={() => setIsOpen(false)}
              className={styles.closeButton}
            >
              X
            </button>
          </div>
          <div className={styles.chatMessages} ref={chatMessagesRef}>
            {messages?.map((msg, index) => (
              <div
                key={index}
                className={`${styles.chatMessage} ${
                  msg.sender === userType
                    ? styles["my-messages"]
                    : styles["not-my-messages"]
                }`}
              >
                {msg.type === "text" ? (
                  <div>{msg.content as string}</div>
                ) : (
                  <audio
                    controls
                    src={URL.createObjectURL(msg.content as Blob)}
                  />
                )}
              </div>
            ))}
          </div>
          <div className={styles.chatInput}>
            {isRecording ? (
              <input type="text" value={`${recordingTime}s`} readOnly />
            ) : (
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="הכנס הודעה..."
              />
            )}
            <div className={styles.buttonGroup}>
              {inputMessage.trim() ? (
                <button
                  onClick={handleSendMessage}
                  className={styles.sendButton}
                >
                  <SendIcon fontSize="small" />
                </button>
              ) : (
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`${styles.recordButton} ${
                    isRecording ? styles.recording : ""
                  }`}
                >
                  {isRecording ? (
                    <StopIcon fontSize="small" />
                  ) : (
                    <MicIcon fontSize="small" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;
