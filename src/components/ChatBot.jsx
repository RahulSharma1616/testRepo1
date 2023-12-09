import { useState } from 'react'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import axios from 'axios';
import { useCookies } from 'react-cookie';

export default function ChatBot() {

  const [chatHistory, setChatHistory] = useState([{role: "assistant", content: "Hi, How can I help you?"}]);
  const [isTyping, setIsTyping] = useState(false);

  const [cookies] = useCookies(["token"]);

  const handleSend = async (message) => {
    setIsTyping(true);
    
    const updatedChatHistory = [...chatHistory, { role: "user", content: message }];
  
    setChatHistory(updatedChatHistory); // Update the chat history with the user's message immediately
  
    axios({
      method: "post",
      url: "http://localhost:4000/chat",
      data: {
        messages: updatedChatHistory
      },
      headers: {
        Authorization: `Bearer ${cookies.token}`,
      }
    }).then((response) => {
      const newChatHistory = [...updatedChatHistory, response.data.reply];
      setChatHistory(newChatHistory);
      setIsTyping(false);
    });
  };  

  return (
    <div className="App">
      <div style={{ position: "relative", height: "600px", width: "700px" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={isTyping ? <TypingIndicator content="Assistant is typing" /> : null}
            >
              {chatHistory.map((element, i) => {
                const message = {
                  message: element.content,
                  sender: element.role == "user" ? "user" : "ChatGPT",
                  direction: element.role == "user" ? "outgoing" : "incoming"
                }
                return <Message key={i} model={message} />
              })}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  )
}