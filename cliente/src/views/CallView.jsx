import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
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

  recognition.onresult = async (e) => {
    try {
      const results = e.results;
      const finalText = results[results.length - 1];
      console.log("Texto reconocido: " + finalText[0].transcript);

      const newMessage = {
        body: finalText[0].transcript,
        from: "Me",
      };
      setChat([...chat, newMessage]);

      const response = await axios.post(
        "http://" + import.meta.env.VITE_DEVICE_IP + ":3000/api/translate/text",
        {
          text: finalText[0].transcript,
          fromLanguage: fromLanguage,
          toLanguage: toLanguage,
        }
      );
      socket.emit("message", {
        body: response.data.translate,
        from: socket.id,
      });
      setMessage(newMessage.body);
    } catch (error) {
      console.error("Error al traducir en tiempo real");
    }
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
    handleTextToSpeech(message.body);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://" + import.meta.env.VITE_DEVICE_IP + ":3000/api/translate/text",
        { text: message, fromLanguage: fromLanguage, toLanguage: toLanguage }
      );

      const newMessage = {
        body: message,
        from: "Me",
      };
      setChat([...chat, newMessage]);
      socket.emit("message", {
        body: response.data.translate,
        from: socket.id.slice(6),
      });
    } catch (error) {
      console.error("Error al concetar con la API");
    }
  };

  const handleTextToSpeech = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = fromLanguage;
    window.speechSynthesis.speak(speech);
  };

  useEffect(() => {
    socket.on("message", receivedMessage);
    return () => {
      socket.off("message", receivedMessage);
    };
  }, [fromLanguage, toLanguage]);

  useEffect(() => {
    scrollBottom();
  }, [chat]);

  return (
    <>
      <main className="main-CallView container">
        <section className="card">
          <article className="card-header d-flex flex-wrap align-items-center justify-content-between">
            <h2>Call</h2>
            <article className="d-flex gap-4 align-items-center">
              <article>
                <strong>From:</strong>
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
              </article>
              <article>
                <strong>To:</strong>
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
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            <article className="d-flex gap-2">
              <button className="btn btn-danger" onClick={handleSpeechStart}>
                <i className="bi bi-mic"></i>
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleTextToSpeech(message)}
              >
                <i className="bi bi-play"></i>
              </button>
              <button className="btn btn-success" onClick={handleSubmit}>
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
