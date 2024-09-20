import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./styles/CallView.css";

const socket = io("/");

function CallView() {
  const selectLanguages = [
    { code: "en-US", name: "English (US)" },
    { code: "es-MX", name: "Spanish (MX)" },
    { code: "fr-FR", name: "French (France)" },
    { code: "de-DE", name: "German (Germany)" },
  ];
  const [fromLanguage, setFromLanguage] = useState("en-US");
  const [toLanguage, setToLanguage] = useState("en-US");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const chatEndRef = useRef(null);
  const recognition = new webkitSpeechRecognition();

  recognition.lang = fromLanguage;
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.maxAlternatives = 3;

  recognition.onstart = () => {
    console.log("Grabando...");
  };

  recognition.onresult = (e) => {
    const results = e.results;
    const finalText = results[results.length - 1];
    console.log("Texto reconocido: " + finalText[0].transcript);

    const newMessage = {
      body: finalText[0].transcript,
      from: "Me",
    };
    setChat([...chat, newMessage]);
    socket.emit("message", { body: finalText[0].transcript, from: socket.id });
  };

  recognition.onspeechend = () => {
    console.log("Speech terminado");
  };

  const handleSpeechStart = () => {
    recognition.start();
  };

  const scrollBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const receivedMessage = (message) => {
    setChat((state) => {
      return [...state, message];
    });
  };

  const handleSubmit = () => {
    const newMessage = {
      body: message,
      from: "Me",
    };
    setChat([...chat, newMessage]);
    socket.emit("message", { body: message, from: socket.id.slice(6) });
  };

  useEffect(() => {
    socket.on("message", receivedMessage);
    return () => {
      socket.off("message", receivedMessage);
    };
  }, []);

  useEffect(() => {
    scrollBottom();
  }, [chat]);

  return (
    <>
      <main className="container">
        <section className="card">
          <article className="card-header d-flex align-items-center justify-content-between">
            <h2>Call</h2>
            <article>
              <span>From:</span>
              <select
                className="form-select"
                onChange={(e) => {
                  setFromLanguage(e.target.value);
                }}
                value={fromLanguage}
              >
                {selectLanguages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
              <span>To:</span>
              <select
                className="form-select"
                onChange={(e) => {
                  setToLanguage(e.target.value);
                }}
                value={toLanguage}
              >
                {selectLanguages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </article>
          </article>
          <article className="card-body d-flex flex-column art-messages ">
            {chat.map((message, i) => (
              <article
                key={i}
                className={
                  message.from === "Me"
                    ? "alert alert-dark ms-auto"
                    : "alert alert-success me-auto"
                }
              >
                <strong>{message.from}</strong>
                <br />
                <span>{message.body}</span>
              </article>
            ))}
            <article ref={chatEndRef}></article>
          </article>
          <article className="card-footer d-flex align-items-center gap-2">
            <textarea
              className="form-control"
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            <article className="d-flex gap-2">
              <button className="btn btn-danger" onClick={handleSpeechStart}>
                <i className="bi bi-mic"></i>
              </button>
              <button className="btn btn-dark" onClick={handleSubmit}>
                <i className="bi bi-send"></i>
              </button>
            </article>
          </article>
        </section>
      </main>
    </>
  );
}
export default CallView;
