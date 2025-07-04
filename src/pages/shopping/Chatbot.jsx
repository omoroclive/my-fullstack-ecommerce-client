import React, { useState } from "react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: "Hello! How can I help?", sender: "bot" }]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    try {
      const response = await fetch(`${API_BASE_URL}/chatbot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      setMessages([...messages, userMessage, { text: data.reply, sender: "bot" }]);
    } catch (error) {
      setMessages([...messages, { text: "Error connecting to chatbot", sender: "bot" }]);
    }

    setInput("");
  };

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20 }}>
      {isOpen && (
        <div style={{ width: 300, height: 400, backgroundColor: "white", borderRadius: 10, boxShadow: "0px 0px 10px rgba(0,0,0,0.2)", padding: 10, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ flex: 1, overflowY: "auto", padding: 10 }}>
            {messages.map((msg, index) => (
              <div key={index} style={{ textAlign: msg.sender === "user" ? "right" : "left", marginBottom: 5 }}>
                <span style={{ backgroundColor: msg.sender === "user" ? "#007bff" : "#e0e0e0", color: msg.sender === "user" ? "white" : "black", padding: "5px 10px", borderRadius: 5 }}>
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", borderTop: "1px solid #ddd", padding: 5 }}>
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." style={{ flex: 1, border: "none", padding: 5, fontSize: 16 }} />
            <button onClick={sendMessage} style={{ backgroundColor: "#007bff", color: "white", padding: "5px 10px", border: "none", cursor: "pointer" }}>Send</button>
          </div>
        </div>
      )}
      <button onClick={() => setIsOpen(!isOpen)} style={{ backgroundColor: "#007bff", color: "white", padding: "10px 20px", borderRadius: "50%", border: "none", cursor: "pointer", fontSize: 20 }}>💬</button>
    </div>
  );
};

export default Chatbot;
