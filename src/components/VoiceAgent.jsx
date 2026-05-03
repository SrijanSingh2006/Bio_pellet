import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaMicrophone, FaRobot, FaTimes } from 'react-icons/fa';

const VoiceAgent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setTranscript('');
        setResponse('');
      };

      recognitionRef.current.onresult = (event) => {
        const current = event.resultIndex;
        const resultText = event.results[current][0].transcript;
        setTranscript(resultText);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (transcript) {
          processIntent();
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
    }
  }, [transcript]); // We depend on transcript being updated to trigger processIntent onend

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const processIntent = async () => {
    if (!transcript) return;
    
    setIsProcessing(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_ML_BACKEND_URL}/api/ml/nlp-intent`, { text: transcript });
      
      if (res.data.success) {
        setResponse(res.data.response_text);
        speak(res.data.response_text);
      } else {
        setResponse("Backend connection failed.");
      }
    } catch (error) {
      setResponse("Error connecting to AI backend.");
    } finally {
      setIsProcessing(false);
    }
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      // Optional: adjust voice, pitch, rate
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-[9999] bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center animate-bounce group"
      >
        <FaRobot className="text-2xl" />
        <span className="absolute left-14 bg-gray-800 text-white text-xs px-3 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Ask AI Agronomist
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-[9999] w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-2">
          <FaRobot className="text-xl" />
          <h4 className="font-bold">AI Agronomist</h4>
        </div>
        <button onClick={() => { setIsOpen(false); window.speechSynthesis.cancel(); }} className="text-white/80 hover:text-white">
          <FaTimes />
        </button>
      </div>

      {/* Chat Area */}
      <div className="p-5 h-48 overflow-y-auto bg-gray-50 dark:bg-gray-900/50 flex flex-col gap-4">
        {transcript && (
          <div className="self-end bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 p-3 rounded-xl rounded-tr-sm text-sm max-w-[85%]">
            {transcript}
          </div>
        )}
        
        {isProcessing && (
          <div className="self-start bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-3 rounded-xl rounded-tl-sm text-sm flex gap-1">
            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></span>
            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></span>
          </div>
        )}

        {response && (
          <div className="self-start bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600 p-3 rounded-xl rounded-tl-sm text-sm shadow-sm max-w-[90%]">
            {response}
          </div>
        )}
        
        {!transcript && !response && !isProcessing && (
          <div className="text-center text-gray-400 text-sm mt-8">
            Tap the microphone and ask a question about prices, weather, or quality.
          </div>
        )}
      </div>

      {/* Mic Button Area */}
      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex justify-center">
        <button 
          onClick={toggleListening}
          className={`p-4 rounded-full text-white text-xl transition-all shadow-lg ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse scale-110 shadow-red-500/50' 
              : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/50'
          }`}
        >
          <FaMicrophone />
        </button>
      </div>
    </div>
  );
};

export default VoiceAgent;
