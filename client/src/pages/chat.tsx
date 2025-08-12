import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { ChatArea } from "@/components/chat-area";
import { VoiceInput } from "@/components/voice-input";
import { TranscriptionBox } from "@/components/transcription-box";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

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

  const {
    isRecording,
    transcript,
    interimTranscript,
    startRecording,
    stopRecording,
    isSupported,
  } = useSpeechRecognition();

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I received your message. This is a demo response. In a real implementation, this would connect to an AI service.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handleVoiceToggle = () => {
    if (isRecording) {
      stopRecording();
      if (transcript) {
        handleSendMessage(transcript);
      }
    } else {
      startRecording();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  return (
    <div className="flex h-screen bg-dark-primary text-text-primary overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:relative lg:translate-x-0 transition-transform duration-300 z-50 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-dark-secondary border-b border-dark-tertiary p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-agent-orange rounded flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-sm" />
            </div>
            <span className="font-semibold">AGENT UI</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-dark-tertiary"
            data-testid="button-mobile-menu"
          >
            <Menu className="h-5 w-5 text-text-secondary" />
          </Button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto">
          <ChatArea messages={messages} />
        </div>

        {/* Transcription Box */}
        {isRecording && (
          <TranscriptionBox
            transcript={transcript}
            interimTranscript={interimTranscript}
            isRecording={isRecording}
          />
        )}

        {/* Voice Input */}
        <VoiceInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          onSendMessage={handleSendMessage}
          onKeyPress={handleKeyPress}
          isRecording={isRecording}
          onVoiceToggle={handleVoiceToggle}
          isVoiceSupported={isSupported}
        />
      </div>
    </div>
  );
}
