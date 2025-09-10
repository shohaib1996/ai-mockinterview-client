"use client"

import { useState, useEffect } from 'react';

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synthRef = typeof window !== 'undefined' ? window.speechSynthesis : null;

  const speak = (text: string) => {
    if (synthRef && text) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (event) => {
        console.error('Speech synthesis error', event.error);
        setIsSpeaking(false);
      };

      synthRef.speak(utterance);
    }
  };

  const cancel = () => {
    if (synthRef && synthRef.speaking) {
      synthRef.cancel();
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  return { isSpeaking, speak, cancel };
};
