import React, { useState, useRef, useEffect } from "react";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import styles from "./chat.module.scss";
import { useUser } from "../../contexts/user-context";
import { useChat } from "../../hooks/chat/useChatMessages";

interface ChatProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  lessonId: string;
}

const Chat: React.FC<ChatProps> = ({ isOpen, setIsOpen, lessonId }) => {
  const { userDetails } = useUser();
  const userType = userDetails!.type!;
  const { messagesQuery, sendMessageMutation } = useChat(
    userDetails!.id,
    lessonId
  );
  const { data: messages } = messagesQuery;
  const { mutate: setMessages } = sendMessageMutation;

  const [inputMessage, setInputMessage] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

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
    <>
      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <h3>Chat</h3>
            <button
              onClick={() => setIsOpen(false)}
              className={styles.closeButton}
            >
              X
            </button>
          </div>
          <div className={styles.chatMessages}>
            {messages?.map((msg, index) => (
              <div
                key={index}
                className={`${styles.chatMessage}  ${
                  styles[
                    msg.sender === userType ? "my-messages" : "not-my-messages"
                  ]
                }`}
              >
                {msg.type === "text" ? (
                  <div>{msg.content as string}</div>
                ) : (
                  <audio
                    ref={audioRef}
                    controls
                    src={URL.createObjectURL(msg.content as Blob)}
                  />
                )}
              </div>
            ))}
          </div>
          <div className={styles.chatInput}>
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type a message..."
            />
            <div className={styles.buttonGroup}>
              <button onClick={handleSendMessage} className={styles.sendButton}>
                <SendIcon fontSize="small" />
              </button>
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`${styles.recordButton} ${
                  isRecording ? styles.recording : ""
                }`}
              >
                {isRecording ? (
                  <>
                    <StopIcon fontSize="small" />
                    <span className={styles.recordingTime}>
                      {recordingTime}s
                    </span>
                  </>
                ) : (
                  <MicIcon fontSize="small" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;
