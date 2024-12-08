"use client";
import React, { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

// Define message types
type MessageType = "success" | "error" | "info" | "warning";

// Message configuration interface
interface MessageConfig {
    id: string;
    content: string;
    type: MessageType;
    duration?: number;
}

// Icon and color mappings
const typeIcons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertCircle,
};

const typeColors = {
    success: "bg-green-100 text-green-800 border-green-200",
    error: "bg-red-100 text-red-800 border-red-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
};

// Message Component
const MessageContainer = () => {
    const [messages, setMessages] = useState<MessageConfig[]>([]);

    useEffect(() => {
        const service = MessageService.getInstance();
        service.registerSetMessages(setMessages);
    }, []);

    const removeMessage = (id: string) => {
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
    };

    return (
        <div className="fixed top-4 left-4 z-50">
            {messages.map((msg) => (
                <MessageItem
                    key={msg.id}
                    {...msg}
                    onRemove={() => removeMessage(msg.id)}
                />
            ))}
        </div>
    );
};

// Individual Message Item
const MessageItem: React.FC<MessageConfig & { onRemove: () => void }> = ({
    content,
    type = "info",
    duration = 3000,
    onRemove,
}) => {
    const Icon = typeIcons[type];
    const colorClasses = typeColors[type];

    useEffect(() => {
        const timer = setTimeout(onRemove, duration);
        return () => clearTimeout(timer);
    }, [duration, onRemove]);

    return (
        <div
            className={`
        flex items-center justify-between p-4 rounded-lg shadow-md 
        ${colorClasses} mb-2 transition-all duration-300 ease-in-out
      `}
        >
            <div className="flex items-center space-x-3">
                <Icon size={24} />
                <span className="text-sm font-medium">{content}</span>
            </div>
            <button
                onClick={onRemove}
                className="hover:bg-opacity-10 rounded-full p-1"
            >
                <X size={20} />
            </button>
        </div>
    );
};

// Message utility
class MessageService {
    private static instance: MessageService;
    private setMessages: React.Dispatch<React.SetStateAction<MessageConfig[]>> | null =
        null;

    private constructor() { }

    public static getInstance(): MessageService {
        if (!MessageService.instance) {
            MessageService.instance = new MessageService();
        }
        return MessageService.instance;
    }

    public registerSetMessages(
        setter: React.Dispatch<React.SetStateAction<MessageConfig[]>>
    ) {
        this.setMessages = setter;
    }

    private addMessage(type: MessageType, content: string, duration?: number) {
        if (!this.setMessages) {
            console.error("MessageService not initialized");
            return;
        }

        const id = `message-${Date.now()}-${Math.random()}`;
        this.setMessages((prev) => [...prev, { id, type, content, duration }]);
    }

    public success(content: string, duration?: number) {
        this.addMessage("success", content, duration);
    }

    public error(content: string, duration?: number) {
        this.addMessage("error", content, duration);
    }

    public info(content: string, duration?: number) {
        this.addMessage("info", content, duration);
    }

    public warning(content: string, duration?: number) {
        this.addMessage("warning", content, duration);
    }
}

// Export singleton instance
export const message = MessageService.getInstance();

export { MessageContainer };
