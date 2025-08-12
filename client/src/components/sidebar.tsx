import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  onClose: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const chatHistory = [
    { id: "1", title: "Voice Chat Session", time: "2 minutes ago" },
    { id: "2", title: "Speech Recognition Test", time: "1 hour ago" },
  ];

  return (
    <div className="w-64 h-full bg-dark-secondary border-r border-dark-tertiary flex flex-col">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-dark-tertiary flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-agent-orange rounded flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-sm" />
          </div>
          <span className="font-semibold text-lg">AGENT UI</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="lg:hidden p-1 hover:bg-dark-tertiary"
          data-testid="button-close-sidebar"
        >
          <X className="h-4 w-4 text-text-secondary" />
        </Button>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <Button
          variant="ghost"
          className="w-full bg-dark-tertiary hover:bg-gray-600 rounded-lg px-4 py-3 text-left transition-colors duration-200 flex items-center space-x-2 justify-start"
          data-testid="button-new-chat"
        >
          <Plus className="h-4 w-4 text-text-secondary" />
          <span>NEW CHAT</span>
        </Button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {chatHistory.map((chat) => (
          <button
            key={chat.id}
            className="w-full p-3 rounded-lg hover:bg-dark-tertiary cursor-pointer transition-colors duration-200 text-left"
            data-testid={`button-chat-${chat.id}`}
          >
            <div className="font-medium text-sm mb-1">{chat.title}</div>
            <div className="text-text-secondary text-xs">{chat.time}</div>
          </button>
        ))}
      </div>

      {/* Endpoint Info */}
      <div className="p-4 border-t border-dark-tertiary">
        <div className="text-xs text-text-muted font-mono">ENDPOINT</div>
        <div className="text-xs text-text-secondary font-mono mt-1 flex items-center">
          <span>HTTP://LOCALHOST:5000</span>
          <div className="w-2 h-2 bg-green-500 rounded-full ml-2" />
        </div>
      </div>
    </div>
  );
}
