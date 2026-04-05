import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import PageHeader from "../PageHeader/PageHeader";
import "./HelpAI.css";

function HelpAI() {

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);


  // Auto-scroll to latest message

  useEffect(() => {

    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

  }, [chat]);


  const sendMessage = async () => {

    if (!message.trim() || loading) return;

    const userMsg = {
      sender: "user",
      text: message
    };

    setChat(prev => [...prev, userMsg]);

    setLoading(true);

    try {

      const res = await axios.post(
        "http://127.0.0.1:8000/api/chatbot/",
        { message }
      );

      const botMsg = {
        sender: "bot",
        text: res.data.reply || "No response available"
      };

      setChat(prev => [...prev, botMsg]);

    } catch (error) {

      console.log("CHATBOT ERROR:", error);

      setChat(prev => [
        ...prev,
        {
          sender: "bot",
          text: "Assistant unavailable right now."
        }
      ]);

    }

    setMessage("");
    setLoading(false);

  };


  return (

    <>

      <PageHeader
        title="Help Assistant"
        subtitle="Ask anything about events, bookings, organizers or platform insights"
      />

      <div className="help-wrapper">

        <div className="chat-container">

          <div className="chat-window">

            {chat.length === 0 && (

              <div className="welcome-text">

                👋 Hi! I'm your EventEase assistant.
                <br />
                Ask me about events, bookings, organizers or analytics.

              </div>

            )}

            {chat.map((msg, index) => (

              <div
                key={index}
                className={
                  msg.sender === "user"
                    ? "user-message"
                    : "bot-message"
                }
              >
                {msg.text}
              </div>

            ))}

            {loading && (

              <div className="bot-message">
                Thinking...
              </div>

            )}

            <div ref={chatEndRef}></div>

          </div>


          <div className="chat-input-section">

            <input
              type="text"
              placeholder="Ask something about EventEase..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
            />

            <button onClick={sendMessage}>
              Send
            </button>

          </div>

        </div>

      </div>

    </>

  );

}

export default HelpAI;