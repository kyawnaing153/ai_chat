// chat.tsx
"use client";
import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar";
import { ChatArea } from "@/components/chat-area";
import { VoiceInput } from "@/components/voice-input";
import { TranscriptionBox } from "@/components/transcription-box";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { Menu, Volume2, VolumeX, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  imgUrl?: string; // Add optional image URL
  fileNames?: string[];
}

const LOADING_MESSAGE_ID = "loading-ai-response";

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm ready to help you with voice commands. Click the microphone button below to start speaking.",
      isUser: false,
      timestamp: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("en-US"); //my-MM
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // Multiple files

  const {
    isRecording,
    transcript,
    interimTranscript,
    startRecording,
    stopRecording,
    isSupported,
    resetTranscript,
  } = useSpeechRecognition();

  // The speakTextIncremental function is missing in this block.
  // It needs to be defined as a separate useCallback hook within the Chat component.
  const speakTextIncremental = useCallback((text: string, lang: string = "en-US") => {
    if (typeof window === "undefined" || !window.speechSynthesis || !text.trim()) return;

    window.speechSynthesis.cancel();

    const voices = window.speechSynthesis.getVoices();
    const googleVoice = voices.find(v =>
      v.name.toLowerCase().includes("google uk english male")
    );

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    if (googleVoice) utterance.voice = googleVoice;

    utterance.rate = 1 * (0.96 + Math.random() * 0.18);
    utterance.pitch = 1 * (0.97 + Math.random() * 0.16);
    utterance.volume = 2;

    window.speechSynthesis.speak(utterance);
  }, []);

  const handleSendMessage = useCallback(async (text: string, files: File[]) => {
    if ((!text.trim() && files.length === 0) || isLoading) return;

    const userMessageText = text.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      text: userMessageText,
      isUser: true,
      timestamp: new Date(),
      fileNames: files.map(f => f.name),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setSelectedFiles([]);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("prompt", text.trim());
      files.forEach((file, idx) => {
        formData.append(`file${idx + 1}`, file);
      });
      const response = await fetch("https://projectx-ak3q.onrender.com/chat", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      // Demo response
      // const data = {
      //   response: "This is a sample AI test message. It will be read aloud while typing.",
      //   contain_img: "",
      // };
      const fullText = data.response;
      if (isVoiceEnabled) {
        speakTextIncremental(fullText, language || "en-US");
      }
      const aiId = (Date.now() + 1).toString();
      const aiMessage: Message = {
        id: aiId,
        text: "",
        isUser: false,
        timestamp: new Date(),
        imgUrl: data.contain_img || undefined,
      };
      setMessages((prev) => [...prev, aiMessage]);

      let i = 0;
      const typingInterval = setInterval(() => {
        i++;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiId ? { ...msg, text: fullText.slice(0, i) } : msg
          )
        );
        if (i >= fullText.length) clearInterval(typingInterval);
      }, 40);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I couldn't connect to the AI. Please check your network connection and try again.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, isVoiceEnabled, language, setMessages, setInputValue, setSelectedFiles, setIsLoading, speakTextIncremental]);

  // This useEffect is where the auto-send logic for voice input lives.
  useEffect(() => {
    let sendTimeout: NodeJS.Timeout | null = null;
    // Check if recording has stopped, there's a transcript, and we're not already loading.
    if (!isRecording && transcript && !isLoading) {
      sendTimeout = setTimeout(() => {
        // Double-check conditions to prevent race conditions.
        if (!isRecording && transcript && !isLoading) {
          handleSendMessage(transcript, []);
          resetTranscript();
        }
      }, 1500); // 1.5 seconds delay
    }

    // Clean up the timeout if the component unmounts or recording starts again.
    return () => {
      if (sendTimeout) clearTimeout(sendTimeout);
    };
  }, [isRecording, transcript, isLoading, handleSendMessage, resetTranscript]);

  const handleVoiceToggle = () => {
    if (isLoading) return;

    if (isRecording) {
      // Just stop recording. The useEffect hook will handle sending after the delay.
      stopRecording();
    } else {
      // Reset the transcript before starting a new recording.
      resetTranscript();
      startRecording();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      console.log(inputValue, selectedFiles);
      handleSendMessage(inputValue, selectedFiles);
    }
  };

  const handleFileChange = (file: File | null) => {
    // Deprecated: now using multiple files
  };

  const handleRemoveFile = () => {
    setSelectedFiles([]);
  };

  const chatMessages = isLoading
    ? [
      ...messages,
      {
        id: LOADING_MESSAGE_ID,
        isUser: false,
        text: "...", // loading animation indicator
        timestamp: new Date(),
      },
    ]
    : messages;

  return (
    <div className="flex h-screen bg-dark-primary text-text-primary overflow-hidden">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed lg:relative lg:translate-x-0 transition-transform duration-300 z-50 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="bg-dark-secondary border-b border-dark-tertiary p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-agent-orange rounded flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-sm" />
            </div>
            <span className="font-semibold">AGENT UI</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
              className="p-4 bg-dark-tertiary"
              title={isVoiceEnabled ? "Disable Voice" : "Enable Voice"}
            >
              {isVoiceEnabled ? (
                <Volume2 className="h-5 w-5 text-text-secondary" />
              ) : (
                <VolumeX className="h-5 w-5 text-text-secondary" />
              )}
            </Button>
            <Button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 bg-dark-tertiary"
              data-testid="button-mobile-menu"
            >
              <Menu className="h-5 w-5 text-text-secondary" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <ChatArea messages={chatMessages} isLoading={isLoading} />
        </div>

        {isRecording && (
          <TranscriptionBox
            transcript={transcript}
            interimTranscript={interimTranscript}
            isRecording={isRecording}
          />
        )}

        <VoiceInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          onSendMessage={() => handleSendMessage(inputValue, selectedFiles)}
          onKeyPress={handleKeyPress}
          isRecording={isRecording}
          onVoiceToggle={handleVoiceToggle}
          isVoiceSupported={isSupported}
          isInputDisabled={isLoading}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
        />

        {/* <Button onClick={() => speakTextIncremental(test_text, "en-US")}>
          Test Voice
        </Button> */}
      </div>
    </div>
  );
}
