// src/components/VoiceInput.tsx
import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Send, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface VoiceInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  onSendMessage: (text: string, files: File[]) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isRecording: boolean;
  onVoiceToggle: () => void;
  isVoiceSupported: boolean;
  isInputDisabled: boolean;
  selectedFiles: File[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

export function VoiceInput({
  inputValue,
  setInputValue,
  onSendMessage,
  onKeyPress,
  isRecording,
  onVoiceToggle,
  isVoiceSupported,
  isInputDisabled,
  selectedFiles,
  setSelectedFiles,
}: VoiceInputProps) {
  const [isMobile, setIsMobile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSend = () => {
    onSendMessage(inputValue, selectedFiles);
    setInputValue("");
    setSelectedFiles([]);
  };

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prev => {
        const combined = [...prev, ...newFiles];
        return combined.slice(0, 3); // Only keep up to 3 files
      });
    }
  };

  return (
    <div className="p-4 lg:p-6 border-t border-dark-tertiary bg-dark-primary">
      <div className="max-w-4xl mx-auto">
        {/* Show attached file names above input field */}
        {selectedFiles.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {selectedFiles.map((file, idx) => (
              <div key={file.name + idx} className="w-[15rem] flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-agent-orange text-white shadow font-semibold text-sm">
                <span className="truncate mr-2">{file.name}</span>
                <button
                  onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== idx))}
                  className="ml-auto p-1 rounded-full hover:bg-orange-600 focus:outline-none"
                  title="Remove file"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="relative flex items-center space-x-4">
          <Button
            onClick={onVoiceToggle}
            disabled={!isVoiceSupported || isInputDisabled}
            className={`relative ${
              isMobile ? "w-14 h-14" : "w-12 h-12"
            } ${
              isRecording
                ? "bg-red-500 hover:bg-red-600"
                : "bg-agent-orange hover:bg-orange-600"
            } rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-agent-orange focus:ring-opacity-30 disabled:opacity-50 disabled:cursor-not-allowed`}
            title={
              !isVoiceSupported
                ? "Speech recognition not supported in this browser"
                : isRecording
                ? "Stop recording"
                : "Start recording"
            }
            data-testid="button-voice-toggle"
          >
            {isRecording ? (
              <MicOff className="text-white z-10 relative h-5 w-5" />
            ) : (
              <Mic className="text-white z-10 relative h-5 w-5" />
            )}
            {isRecording && (
              <>
                <div className="absolute inset-0 rounded-full voice-ring animate-ping-slow opacity-75" />
                <div
                  className="absolute inset-0 rounded-full voice-ring animate-pulse-slow opacity-50"
                  style={{ animationDelay: "0.5s" }}
                />
                <div
                  className="absolute inset-0 rounded-full voice-ring animate-ping-slow opacity-25"
                  style={{ animationDelay: "1s" }}
                />
              </>
            )}
          </Button>

          {/* Text Input */}
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Ask anything..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={onKeyPress}
              disabled={isInputDisabled}
              className="w-full bg-dark-secondary border border-dark-tertiary rounded-lg px-4 py-3 pr-24 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-agent-orange focus:border-transparent transition-all duration-200 disabled:opacity-50"
              data-testid="input-message"
            />
            
            {/* File Input Button */}
            <Button
              onClick={handleFileClick}
              disabled={isInputDisabled || isRecording || selectedFiles.length >= 3}
              className="absolute right-12 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-transparent hover:bg-dark-tertiary rounded-lg flex items-center justify-center transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              // size prop removed
            >
              <Paperclip className="text-text-secondary h-4 w-4" />
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
            />

            {/* Send Button */}
            <Button
              onClick={handleSend}
              disabled={(!inputValue.trim() && selectedFiles.length === 0) || isInputDisabled || isRecording}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-agent-orange hover:bg-orange-600 rounded-lg flex items-center justify-center transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              // size prop removed
              data-testid="button-send"
            >
              <Send className="text-white h-4 w-4" />
            </Button>
          </div>
        </div>

        {isRecording && (
          <div className="mt-2 text-center">
            <span className="text-xs text-text-muted">
              <div className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse" />
              Listening... Speak now
            </span>
          </div>
        )}
      </div>
    </div>
  );
}