import { useState, useEffect, useRef, useCallback } from "react";

interface SpeechRecognitionHook {
  isRecording: boolean;
  transcript: string;
  interimTranscript: string;
  startRecording: () => void;
  stopRecording: () => void;
  isSupported: boolean;
  error: string | null;
}

// Extend the Window interface to include webkitSpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function useSpeechRecognition(): SpeechRecognitionHook {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = 
      window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      
      const recognition = recognitionRef.current;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsRecording(true);
        setError(null);
        setTranscript("");
        setInterimTranscript("");
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPart;
          } else {
            interimTranscript += transcriptPart;
          }
        }

        setTranscript(finalTranscript);
        setInterimTranscript(interimTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setError(`Speech recognition error: ${event.error}`);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
        setInterimTranscript("");
      };
    } else {
      setIsSupported(false);
      console.warn("Speech recognition not supported in this browser");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startRecording = useCallback(() => {
    if (recognitionRef.current && !isRecording) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error("Failed to start speech recognition:", error);
        setError("Failed to start speech recognition");
      }
    }
  }, [isRecording]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }
  }, [isRecording]);

  return {
    isRecording,
    transcript,
    interimTranscript,
    startRecording,
    stopRecording,
    isSupported,
    error,
  };
}
