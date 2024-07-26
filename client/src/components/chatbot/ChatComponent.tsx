import { useState, useRef, useEffect } from "react";
import styles from "./ChatComponent.module.scss";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { useSendMessageToChatbot } from "../../hooks/useSendMessagesToChatbot";

interface Message {
  sender: "user" | "bot";
  text: string;
  markup?: { __html: string };
}

type ChatComponentProps = {
  messageContext: {
    pentateuch: string;
    startChapter: string;
    startVerse: string;
    endChapter: string;
    endVerse: string;
  };
};

const ChatComponent = ({ messageContext }: ChatComponentProps) => {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [processedMessages, setProcessedMessages] = useState<Message[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputMessage, setInputMessage] = useState<string>("");

  const { mutate: sendMessage, isPending } = useSendMessageToChatbot();

  const isInputEmpty = inputMessage.trim() === "";

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  const createMarkup = async (text: string): Promise<{ __html: string }> => {
    const rawMarkup = await marked(text);
    const cleanMarkup = await DOMPurify.sanitize(rawMarkup);
    return { __html: cleanMarkup };
  };

  useEffect(() => {
    const processMessages = async () => {
      const processed = await Promise.all(
        messages.map(async (msg) => {
          if (msg.sender === "bot") {
            const markup = await createMarkup(msg.text);
            return { ...msg, markup };
          }
          return msg;
        })
      );
      setProcessedMessages(processed);
    };

    processMessages();
  }, [messages]);

  const handleSendMessage = () => {
    if (isInputEmpty) return;

    const userMessage: Message = {
      sender: "user",
      text: inputMessage,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const messageData = {
      message: inputMessage,
      conversation_topic: `${messageContext.pentateuch}, פרק ${messageContext.startChapter} פסוק ${messageContext.startVerse}, עד פרק ${messageContext.endChapter} פסוק ${messageContext.endVerse}`,
    };

    sendMessage(messageData, {
      onSuccess: (data) => {
        const botMessage: Message = {
          sender: "bot",
          text: data.message,
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      },
      onError: () => {
        const errorMessage: Message = {
          sender: "bot",
          text: "אופס, משהו השתבש בדרך.",
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      },
    });

    setInputMessage("");
  };

  return (
    <div>
      <button onClick={toggleChat} className={styles.imageButton} id="robot">
        <img src="/src/public/images/bot.jpg" alt="Chat" />
        <div className={styles.speechBubble}>כאן לכל שאלה.</div>
      </button>

      {isChatOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <h3>צ'אט על הפרשה</h3>
            <button onClick={toggleChat} className={styles.closeButton}>
              X
            </button>
          </div>
          <div className={styles.chatMessages}>
            {processedMessages.map((msg, index) => (
              <div
                key={index}
                className={`${styles.chatMessage} ${styles[msg.sender]}`}
                {...(msg.sender === "bot"
                  ? { dangerouslySetInnerHTML: msg.markup }
                  : { children: msg.text })}
              />
            ))}
          </div>
          <div className={styles.chatInput}>
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="הכנס כאן שאלות על הפרשה..."
            />
            <button
              onClick={handleSendMessage}
              disabled={isInputEmpty || isPending}
              className={`${styles.sendButton} ${
                isInputEmpty ? styles.disabled : ""
              } ${isPending ? styles.loading : ""}`}
            >
              {isPending ? <div className={styles.loadingCircle}></div> : "➤"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
