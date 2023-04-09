import React, { useState, useRef, useEffect } from "react";
import { Fade } from "react-reveal";

import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #f0f0f0;
  margin-bottom: 100px;
  background-color: ${({ theme }) => theme.body};
`;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  max-width: 600px;
  max-height: 600px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  background-color: ${({ theme }) =>
    theme.name === "dark" ? "rgb(17, 58, 84)" : "rgb(208, 218, 224)"};
  ${({ theme }) => (theme.name === "dark" ? "" : "black")};
`;

const Messages = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
`;

const UserMessage = styled.div`
  margin-bottom: 10px;
  word-wrap: break-word;
  color: #1e90ff;
  font-family: 'Roboto Mono', monospace;
`;

const ComputerMessage = styled.div`
  margin-bottom: 10px;
  word-wrap: break-word;
  color: #d9534f;
  font-family: 'Roboto Mono', monospace;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0 20px 20px;
  background-color: white;
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.1);
  background-color: ${({ theme }) =>
    theme.name === "dark" ? "rgb(17, 58, 84)" : "rgb(225, 236, 242)"};
`;

const Input = styled.textarea`
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
  word-wrap: break-word;
  resize: none;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #1e90ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #1890ff;
  }
`;

const ExampleRequests = styled.div`
  text-align: center;
  margin-top: 20px;

  & > p {
    margin-bottom: 10px;
  }

  & .buttons {
    display: flex;
    justify-content: center;
    gap: 10px;
  }

  & button {
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
  }
`;

const BotMessage = ({ text, imageSrc }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
      <img src="https://i.imgur.com/f6yaoSJ.png" alt="Bot" style={{ marginRight: "10px", width: "50px", height: "50px", borderRadius: "50%" }} />
      <div style={{ wordWrap: "break-word", color: "#d9534f" }}>{text}</div>
    </div>
  );
};

const Default = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesRef = useRef();
  const userId = String(CreateUserID());

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  function CreateUserID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  const handleSendMessage = async () => {
    const userMessage = { text: input, type: "user" };
    const BotMessage = {
      text: await SendRequest(input),
      type: "computer",
    };

    setMessages([...messages, userMessage, BotMessage]);
    setInput("");
  };

  const SendRequest = async (text) => {
    const finishText = text+"Дай ссылки на магазины в Казахстане где продаются эти товары и когда лучше всего пойти покупать этот товар"
    const body = JSON.stringify({ UserId: userId, Text: finishText });
    const baseURL = 'https://neironsmartadvisor.azurewebsites.net';
    const resp = await fetch(baseURL + "/GetData", {
      headers: {
        "content-type": "application/json",
      },
      body: body,
      method: "POST",
    });

    if (resp.ok) {
      const text = await resp.text();
      return text;
    } else {
      console.log("Ошибка HTTP: " + resp.status);
    }

    return "Ваш запрос не относится к тематике нашего сайта";
  };
  return (
    <div className="education">
      <Fade bottom duration={2000} distance="40px">
        <Container>
          <ChatContainer>
            <Messages ref={messagesRef}>
              {messages.map((message, index) =>
                message.type === "user" ? (
                  <UserMessage key={index}>{message.text}</UserMessage>
                ) : (
                  <ComputerMessage key={index}><img src="https://i.imgur.com/f6yaoSJ.png" alt="Bot" style={{ marginRight: "10px", width: "50px", height: "50px", borderRadius: "50%" }} />{message.text}</ComputerMessage>
                )
              )}
            </Messages>
            <InputContainer>
              <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Введите текст здесь" />
              <Button onClick={handleSendMessage}>Отправить</Button>
            </InputContainer>
            <ExampleRequests>
            <div className="example-requests">
              <p>Примерные запросы:</p>
              <div className="buttons">
                <button onClick={() => setInput("Какой телевизор можно купить за 300000 тенге в Астане?")}>Какой телевизор можно купить за 300 000 тенге в Астане?</button>
                <button onClick={() => setInput("Какой телефон лучше купить ученику 10 класса?")}>Какой телефон лучше купить ученику 10 класса?</button>
                <button onClick={() => setInput("Что лучше Iphone 13 или Samsung S21?")}>Что лучше Iphone 13 или Samsung S21?</button>
              </div>
            </div>
            </ExampleRequests>
          </ChatContainer>
        </Container>
      </Fade>
    </div>

  );
};

export default Default;
