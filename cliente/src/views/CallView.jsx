import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import NavBar from "../components/NavBar";
import { IoMic, IoPlay } from "react-icons/io5";
import { IoIosSend } from "react-icons/io";

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
  const auth = useAuth();
  let { displayName, photoURL } = auth.user || {};

  auth.user ? (displayName = displayName) : (displayName = "Guest");
  auth.user
    ? (photoURL = photoURL)
    : (photoURL =
        "https://static-00.iconduck.com/assets.00/profile-default-icon-2048x2045-u3j7s5nj.png");

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
        photoURL: photoURL,
        time: "12:00",
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
        from: displayName,
        photoURL: photoURL,
        time: "12:00",
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
        photoURL: photoURL,
        time: "12:00",
      };
      setChat([...chat, newMessage]);
      socket.emit("message", {
        body: response.data.translate,
        from: displayName,
        photoURL: photoURL,
        time: "12:00",
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
  }, [fromLanguage, toLanguage, displayName]);

  useEffect(() => {
    scrollBottom();
  }, [chat]);

  return (
    <>
      <NavBar />
      <main className="flex flex-col md:items-center">
        <section className="w-full md:max-w-4xl">
          <article className="border border-gray-300 rounded">
            <article className="flex gap-2 md:justify-end">
              <article className="flex items-center gap-2">
                <span>From:</span>
                <select
                  className="border rounded bg-gray-50 border-gray-300 text-gray-900 focus:outline-none focus:ring-blue-500 focus:ring-1 focus:border-blue-500 transition duration-300 w-full block p-2.5"
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
              <article className="flex items-center gap-2">
                <span>To:</span>
                <select
                  className="border rounded bg-gray-50 border-gray-300 text-gray-900 focus:outline-none focus:ring-blue-500 focus:ring-1 focus:border-blue-500 transition duration-300 w-full block p-2.5"
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
          <article className="h-[530px] md:h-[405px] overflow-y-auto px-2 border border-gray-300 rounded">
            {chat.map((message, i) => (
              <>
                <div key={i} className="flex flex-col gap-2 mt-5">
                  {message.from === "Me" ? (
                    <div class="flex flex-row-reverse items-end gap-2.5">
                      <img
                        class="w-8 h-8 rounded-full"
                        src={message.photoURL}
                        alt="User photo"
                      />
                      <div class="flex flex-col gap-1 w-full max-w-[320px]">
                        <div class="flex items-center space-x-2 rtl:space-x-reverse justify-end">
                          <span class="text-sm font-semibold text-gray-900 dark:text-white">
                            {message.from}
                          </span>
                          <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
                            {message.time}
                          </span>
                        </div>
                        <div class="flex flex-col leading-1.5 p-4 border-gray-200 bg-blue-100 rounded-s-xl rounded-se-xl dark:bg-blue-700">
                          <p class="text-sm font-normal text-gray-900 dark:text-white">
                            {message.body}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div class="flex items-start gap-2.5">
                        <img
                          class="w-8 h-8 rounded-full"
                          src={message.photoURL}
                          alt="User photo"
                        />
                        <div class="flex flex-col gap-1 w-full max-w-[320px]">
                          <div class="flex items-center space-x-2 rtl:space-x-reverse">
                            <span class="text-sm font-semibold text-gray-900 dark:text-white">
                              {message.from}
                            </span>
                            <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
                              {message.time}
                            </span>
                          </div>
                          <div class="flex flex-col leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                            <p class="text-sm font-normal text-gray-900 dark:text-white">
                              {message.body}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ))}
            <article ref={chatEndRef}></article>
          </article>
          <article className="flex items-center">
            <textarea
              className="border rounded bg-gray-50 border-gray-300 text-gray-900 focus:outline-none focus:ring-blue-500 focus:ring-1 focus:border-blue-500 transition duration-300 w-full block p-2.5"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            <article className="flex">
              <button className="" onClick={handleSpeechStart}>
                <IoMic />
              </button>
              <button className="" onClick={() => handleTextToSpeech(message)}>
                <IoPlay />
              </button>
              <button className="" onClick={handleSubmit}>
                <IoIosSend />
              </button>
            </article>
          </article>
        </section>
      </main>
    </>
  );
}
export default CallView;
