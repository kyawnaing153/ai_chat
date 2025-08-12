import { useState, useEffect } from "react";
import { Mic, MicOff, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface VoiceInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  onSendMessage: (text: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isRecording: boolean;
  onVoiceToggle: () => void;
  isVoiceSupported: boolean;
}

export function VoiceInput({
  inputValue,
  setInputValue,
  onSendMessage,
  onKeyPress,
  isRecording,
  onVoiceToggle,
  isVoiceSupported,
}: VoiceInputProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSend = () => {
    onSendMessage(inputValue);
  };

  return (
    <div className="p-4 lg:p-6 border-t border-dark-tertiary bg-dark-primary">
      <div className="max-w-4xl mx-auto">
        <div className="relative flex items-center space-x-4">
          {/* Voice Activation Button */}
          <div className="relative">
            <Button
              onClick={onVoiceToggle}
              disabled={!isVoiceSupported}
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

              {/* Pulsing rings for Apple Face ID effect */}
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

            {/* Voice Wave Animation */}
            {isRecording && (
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                <div className="flex items-end space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 bg-agent-orange rounded-full animate-voice-wave ${
                        i === 0 || i === 4
                          ? "h-4"
                          : i === 1 || i === 3
                          ? "h-6"
                          : "h-8"
                      }`}
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Text Input */}
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Ask anything..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={onKeyPress}
              className="w-full bg-dark-secondary border border-dark-tertiary rounded-lg px-4 py-3 pr-12 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-agent-orange focus:border-transparent transition-all duration-200"
              data-testid="input-message"
            />

            {/* Send Button */}
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-agent-orange hover:bg-orange-600 rounded-lg flex items-center justify-center transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              size="sm"
              data-testid="button-send"
            >
              <Send className="text-white h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Voice Status Indicator */}
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
