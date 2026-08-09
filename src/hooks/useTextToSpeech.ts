"use client"

import { useState, useEffect, useRef } from 'react';

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const synthRef = typeof window !== 'undefined' ? window.speechSynthesis : null;
  // Chrome has a long-standing bug where it silently drops an utterance if
  // nothing holds a JS reference to it while speaking - a bare local
  // variable can get garbage-collected mid-utterance. Keep it here instead.
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  // speak() is called from async callbacks (API responses, kickoff effects)
  // where a stale closure over isMuted could still fire speech right after
  // muting - read the latest value via a ref instead.
  const isMutedRef = useRef(false);

  const cancel = () => {
    if (synthRef && synthRef.speaking) {
      synthRef.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      isMutedRef.current = next;
      if (next) cancel();
      return next;
    });
  };

  const speak = (text: string) => {
    if (!synthRef || !text || isMutedRef.current) return;

    const queueUtterance = () => {
      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (event) => {
        // "interrupted"/"canceled" just mean a newer utterance preempted
        // this one (or, on Chrome, that cancel() and speak() raced) - not
        // a real failure, so don't log it as an error.
        if (event.error !== 'interrupted' && event.error !== 'canceled') {
          console.error('Speech synthesis error', event.error);
        }
        setIsSpeaking(false);
      };

      synthRef.speak(utterance);
    };

    const doSpeak = () => {
      if (synthRef.speaking || synthRef.pending) {
        // Something's already in flight - cancel it, but calling speak()
        // in the same tick as cancel() is a well-documented Chrome race
        // that interrupts the NEW utterance too. Defer to the next tick
        // so the cancellation actually finishes first.
        synthRef.cancel();
        setTimeout(queueUtterance, 50);
      } else {
        queueUtterance();
      }
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

  useEffect(() => {
    return () => {
      cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { isSpeaking, isMuted, speak, cancel, toggleMute };
};
