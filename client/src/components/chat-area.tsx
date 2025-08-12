import { ExternalLink, Book } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatAreaProps {
  messages: Message[];
}

export function ChatArea({ messages }: ChatAreaProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="p-4 lg:p-6">
      {/* Welcome Message */}
      {messages.length <= 1 && (
        <div className="max-w-4xl mx-auto text-center py-12 lg:py-20">
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-semibold mb-4">
              This is an open-source{" "}
              <span className="inline-flex items-center bg-agent-orange text-white px-2 py-1 rounded text-sm font-medium">
                <div className="w-3 h-3 bg-white rounded-sm mr-1" /> Agent
              </span>{" "}
              Agent UI, built with{" "}
              <span className="font-mono bg-dark-secondary px-2 py-1 rounded">
                React
              </span>
            </h1>
            <p className="text-text-secondary text-lg">
              For the full experience, use voice commands or type your message.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              variant="ghost"
              className="px-6 py-3 bg-dark-secondary hover:bg-dark-tertiary rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              data-testid="button-docs"
            >
              <Book className="h-4 w-4 text-text-secondary" />
              <span>GO TO DOCS</span>
            </Button>
            <Button
              className="px-6 py-3 bg-agent-orange hover:bg-orange-600 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 text-white"
              data-testid="button-playground"
            >
              <ExternalLink className="h-4 w-4 text-white" />
              <span>VISIT AGENT PLAYGROUND</span>
            </Button>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="max-w-4xl mx-auto space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 animate-fadeIn ${
              message.isUser ? "flex-row-reverse space-x-reverse" : ""
            }`}
            data-testid={`message-${message.id}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.isUser
                  ? "bg-blue-600"
                  : "bg-agent-orange"
              }`}
            >
              {message.isUser ? (
                <span className="text-white text-sm font-medium">U</span>
              ) : (
                <div className="w-3 h-3 bg-white rounded-sm" />
              )}
            </div>
            <div
              className={`rounded-lg p-4 max-w-2xl ${
                message.isUser
                  ? "bg-blue-600 text-white"
                  : "bg-dark-secondary text-text-primary"
              }`}
            >
              <p className="whitespace-pre-wrap">{message.text}</p>
              <div
                className={`text-xs mt-2 ${
                  message.isUser ? "text-blue-100" : "text-text-muted"
                }`}
              >
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
