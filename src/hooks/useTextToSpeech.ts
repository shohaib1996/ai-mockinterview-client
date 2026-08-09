"use client"

import { useState, useEffect, useRef } from 'react';

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synthRef = typeof window !== 'undefined' ? window.speechSynthesis : null;
  // Chrome has a long-standing bug where it silently drops an utterance if
  // nothing holds a JS reference to it while speaking - a bare local
  // variable can get garbage-collected mid-utterance. Keep it here instead.
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = (text: string) => {
    if (!synthRef || !text) return;

    const doSpeak = () => {
      // Reset any stuck state and "wake up" the engine - on some browsers
      // (esp. Chrome) the very first utterance in a session is silently
      // dropped otherwise, especially when triggered without a direct
      // click (e.g. an auto-kickoff effect on page load).
      synthRef.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (event) => {
        console.error('Speech synthesis error', event.error);
        setIsSpeaking(false);
      };

      synthRef.speak(utterance);
    };

    // Voices load asynchronously; speaking before they're ready is a common
    // cause of silent (no error, no sound) failures on first page load.
    if (synthRef.getVoices().length === 0) {
      let triggered = false;
      const onVoicesReady = () => {
        if (triggered) return;
        triggered = true;
        synthRef.removeEventListener('voiceschanged', onVoicesReady);
        doSpeak();
      };
      synthRef.addEventListener('voiceschanged', onVoicesReady);
      // Fallback in case voiceschanged never fires on this browser/platform.
      setTimeout(onVoicesReady, 500);
    } else {
      doSpeak();
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
