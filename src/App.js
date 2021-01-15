import React, { useState, useEffect } from "react";
import ScrollArea from 'react-scrollbar';
import io from "socket.io-client";
import "./App.css";

let socket;
const CONNECTION_PORT = "https://chatool.herokuapp.com/";

function App() {
  // Before Login
  const [loggedIn, setLoggedIn] = useState(false);
  const [room, setRoom] = useState("");
  const [userName, setUserName] = useState("");

  // After Login
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    socket = io(CONNECTION_PORT);
  }, [CONNECTION_PORT]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList([...messageList, data]);
    });
  });
  const connectToRoom = () => {
    if (room.length>0 && userName.length>0) {
      setLoggedIn(true);
    socket.emit("join_room", room);
    }
    
   
  };

  const sendMessage = async () => {
    let messageContent = {
      room: room,
      content: {
        author: userName,
        message: message,
      },
    };

    await socket.emit("send_message", messageContent);
    setMessageList([...messageList, messageContent.content]);
    setMessage("");
  };

  const Disconnect = () => {
    setLoggedIn(false);
    
  };

  return (
    <div className="App">
      
      {!loggedIn ? (
        <div className="logIn">
            <h1 style={{color:" #0091ff"}}> Chattool <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-chat" viewBox="0 0 20 20">
  <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z"/>
</svg></h1>
         
          <div className="inputs">
            <form>
            <input
              type="text"
              placeholder="Name..."
              required
              onChange={(e) => {
                if (e.target.value.length>0) {
                  setUserName(e.target.value);
                } 
               
              }}
              
            />
            <input
              type="text"
              placeholder="Interest Example:Youtube"
              required
              onChange={(e) => {
                if (e.target.value.length>0) {
                  setRoom(e.target.value);
                } 
              }}
            
            />
            </form>
          </div>
          <button type="submit" onClick={connectToRoom}>Enter Chat</button>
        
         
          <h5 style={{color:"whitesmoke",margin:"4px"}}>Enter those topic that interest most</h5>
          
        </div>
      ) : (
        <div className="chatContainer">

          
            <ScrollArea
            speed={0.8}
            className="area"
            contentClassName="content"
            horizontal={false}
            >
          <div className="messages">
         
            {messageList.map((val, key) => {
              return (
                <div
                  className="messageContainer"
                  id={val.author == userName ? "You" : "Other"}
                >
                  
                  <div className="messageIndividual">
                  {val.author}💬{val.message}
                  </div>
                 
                </div>
              );
            })}
            
          </div>
          </ScrollArea>
         
            
          <div className="messageInputs">
            <input
              type="text"
              placeholder="Message..."
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
            <button className="btn btn-warning" onClick={sendMessage}>Send</button>
          </div>
          <h4 style={{color:"whitesmoke"}}>Don't spam your message</h4>
          <button className="btn btn-danger"  onClick={Disconnect}>Stop</button>
        </div>
      )}
      
     </div>
    
  );
}

export default App;
