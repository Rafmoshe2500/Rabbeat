import React, { useState } from 'react';
import axios from 'axios';
import styles from './ChatComponent.module.scss';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const ChatComponent: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const userMessage: Message = {
      sender: 'user',
      text: inputMessage,
    };

    setMessages([...messages, userMessage]);
    setInputMessage('');
    try {
      const url = 'http://localhost:8000/chat/';
      const data = {
        message: inputMessage,
        conversation_topic: 'ספר בראשית, פרק כח פסוק י, עד פרק כח פסוק יז', // Replace with actual topic if available
      };

      const options = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const response = await axios.post(url, data, options);
      const generatedText = response.data.message;

      const botMessage: Message = {
        sender: 'bot',
        text: generatedText,
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const botMessage: Message = {
        sender: 'bot',
        text: "Some error occurred",
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }
  };

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
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
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
