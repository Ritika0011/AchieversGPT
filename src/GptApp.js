
import React, { useState, useEffect } from 'react';
import './App.css';
import DarkMode from "./DarkMode/DarkMode";
import userAvatar from "./img/userAvatar.jpeg"
import assistantAvatar from "./img/assistantAvatar.png"

const GptApp = () => {
  const [value, setValue] = useState('');
  const [message, setMessage] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const user = JSON.parse(localStorage.getItem('user'));
  console.log(user);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      getMessages();
    }
  };

  const createNewChat = () => {
    setMessage(null);
    setValue('');
    setCurrentTitle(null);
  };

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle);
    setMessage(null);
    setValue('');
  };

 
  const handleLogOut = () => {
    localStorage.removeItem('authenticated');
    window.location.href = '/';
    };

  const getMessages = async () => {
    const options = {
      method: 'POST',
      body: JSON.stringify({
        message: value,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await fetch('/completions', options);
      const data = await response.json();
      console.log(data);
      setMessage(data.choices[0].message);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(currentTitle, value, message);
    if (!currentTitle && value && message) {
      setCurrentTitle(value);
    }
    if (currentTitle && value && message) {
      setPreviousChats((prevChats) => [
        ...prevChats,
        {
          title: currentTitle,
          role: 'user',
          content: value,
        },
        {
          title: currentTitle,
          role: message.role,
          content: message.content,
        },
      ]);
    }
  }, [currentTitle, message]);

  console.log(previousChats);

  const currentChat = previousChats.filter(
    (previousChat) => previousChat.title === currentTitle
  );
  const uniqueTitles = Array.from(new Set(previousChats.map((previousChat) => previousChat.title)));

  return (
    <div className="app">
      <div className={`hamburger ${sidebarVisible ? '' : 'hide'}`} onClick={toggleSidebar}>
        <div className="line" />
        <div className="line" />
        <div className="line" />
      </div>
      <div className="themeButton">
        <p>
        <div className="toggle">
          <DarkMode />
        </div> 
        </p>
        <p>|</p>
        <p>
        <button className="logout" onClick={handleLogOut}>Logout</button>
        </p>
      </div>
      <section className={`side-bar ${sidebarVisible ? '' : 'hide'}`}>
        <button className='newChat' onClick={createNewChat}>+ New chat</button>
        
        <ul className="history">
          <p className="history-title">HISTORY</p>
          {uniqueTitles?.map((uniqueTitle, index) => (
            <li key={index} onClick={() => handleClick(uniqueTitle)}>
              {uniqueTitle}
            </li>
          ))}
        </ul>
        <nav>
          <p> Made with ❤️ </p>
        </nav>
      </section>
      <section className="main">
        {!currentTitle && <h1 className="logo">Achievers GPT
        <p>Start a new conversation with your AI Assistant</p>
        </h1>}
        <ul className="feed">
          {currentChat?.map((chatMessage, index) => (
            <li key={index} className="feedLi">
              {chatMessage.role === "user" ? (
                <div className='role'>
                  <img src={userAvatar} alt="User Avatar" className="avatar" />
                </div>
              ) : (
                <div className='role'>
                  <img
                    src={assistantAvatar}
                    alt="Assistant Avatar"
                    className="avatar"
                  />
                </div>
              )}
              <p>{chatMessage.content}</p>
            </li>
          ))}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter a text here"
            />
            <div id="submit" onClick={getMessages}>
              ➢
            </div>
          </div>
          <p className="info">
            This is an AI-enabled Chat Web App powered by OpenAI GPT-3.5-turbo.
            The API is licensed under OpenAI's policy to @Achievers.
          </p>
        </div>
      </section>
    </div>
  );
};

export default GptApp;