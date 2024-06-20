import React, { useState, useEffect, useRef } from 'react';
import styles from './ChatComponent.module.scss';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { useSendMessageToChatbot } from '../../hooks/useSendMessagesToChatbot'; // Adjust the import path as needed

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const ChatComponent: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputMessage1, setInputMessage1] = useState<string>('');
  const [triggerSendMessage, setTriggerSendMessage] = useState<boolean>(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState<number | null>(null);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleSendMessage = () => {
    if(inputRef.current){
    if (inputRef.current.value.trim() === '') return;

    const userMessage: Message = {
      sender: 'user',
      text: inputRef.current.value,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputMessage1(inputRef.current.value)
    setTriggerSendMessage(true);
    inputRef.current.value = '';
  }
  };

  const messageData = { message: inputMessage1, conversation_topic: 'בראשית, פרק כח פסוק י, עד פרק כח פסוק יז' };
  const { data, error, isLoading } = useSendMessageToChatbot(messageData);

  useEffect(() => {
    if (triggerSendMessage && isLoading) {
      const loadingMessage: Message = {
        sender: 'bot',
        text: 'מעבד את הנתונים...',
      };
      setMessages((prevMessages) => [...prevMessages, loadingMessage]);
      setLoadingMessageIndex(messages.length); // Set the index of the loading message
    }
  }, [isLoading, triggerSendMessage]);

  const a = (value: string) => {
    if(inputRef.current){
      inputRef.current.value = value;
    }
  }

  useEffect(() => {
    if (triggerSendMessage && !isLoading && (data || error)) {
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        const botMessage: Message = {
          sender: 'bot',
          text: error ? 'אופס, משהו השתבש בדרך.' : data ? data[0].message : 'Unknown error',
        };
        if (loadingMessageIndex !== null) {
          updatedMessages[loadingMessageIndex] = botMessage; // Replace the loading message
        } else {
          updatedMessages.push(botMessage);
        }
        return updatedMessages;
      });
      setTriggerSendMessage(false);
      setLoadingMessageIndex(null); // Reset the loading message index
    }
  }, [data, error, isLoading, triggerSendMessage, loadingMessageIndex]);

  const createMarkup = (text: string) => {
    const rawMarkup = marked(text);
    const cleanMarkup = DOMPurify.sanitize(rawMarkup);
    return { __html: cleanMarkup };
  };

  return (
    <div>
      <button onClick={toggleChat} className={styles.imageButton} id="robot">
        <img src="images/bot.jpg" alt="Chat" />
        <div className={styles.speechBubble}>כאן לכל שאלה.</div>
      </button>

      {isChatOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <h3>צ'אט על הפרשה</h3>
            <button onClick={toggleChat} className={styles.closeButton}>X</button>
          </div>
          <div className={styles.chatMessages}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${styles.chatMessage} ${styles[msg.sender]}`}
                dangerouslySetInnerHTML={msg.sender === 'bot' ? createMarkup(msg.text) : { __html: msg.text }}
              />
            ))}
          </div>
          <div className={styles.chatInput}>
            <input
              ref={inputRef}
              type="text"
              value={inputRef.current?.value}
              onChange={(e) => a(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter'}
              placeholder="הכנס כאן שאלות על הפרשה..."
            />
            <button onClick={handleSendMessage}></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
