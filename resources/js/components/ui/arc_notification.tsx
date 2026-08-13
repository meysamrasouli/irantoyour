import React, { useState, useEffect, useCallback, useRef } from 'react';
import { zustandStore } from "@/shared/store/zustandStore";

export type NotificationMode = 'success' | 'warning' | 'error' | 'info';
export interface NotificationInputInterface {// used in zustand store
    mode: NotificationMode;
    text: string;
}
interface NotificationItemInterface extends NotificationInputInterface {
    key: number;
    icon: string;
    leaving: boolean;
}
interface PropsInterface {
    lifespan?: number; // seconds
}
const ICONS: Record<NotificationMode, string> = {
    success: 'fa-circle-check',
    warning: 'fa-triangle-exclamation',
    error: 'fa-circle-xmark',
    info: 'fa-circle-info',
};
let idCounter = 0;

export default function AvcNotification({ lifespan = 3 }: PropsInterface) {
    const [messages, setMessages] = useState<NotificationItemInterface[]>([]);
    const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

    const notification = zustandStore((state) => state.notification);
    const updateNotification = zustandStore((state) => state.updateNotification);

    //==================================================| function |==================================================\\
    /**
     * @function startLeave
     * */
    const startLeave = useCallback((key: number) => {
        setMessages(prev => prev.map(item => (item.key === key ? { ...item, leaving: true } : item)));
    }, []);

    /**
     * @function removeMessage
     * */
    const removeMessage = useCallback((key: number) => {
        setMessages(prev => prev.filter(item => item.key !== key));
        timers.current.delete(key);
    }, []);

    /**
     * @function addMessage
     * */
    const addMessage = useCallback((message: NotificationInputInterface) => {
        const key = Date.now() * 1000 + (idCounter++ % 1000); // یکتاتر از رندوم خالی

        setMessages(prev => [...prev, {
            key: key,
            mode: message.mode,
            text: message.text,
            icon: ICONS[message.mode] || ICONS.info,
            leaving: false,
        }]);

        const setTimeoutTimer = setTimeout(() => startLeave(key), lifespan * 1000);
        timers.current.set(key, setTimeoutTimer);

    }, [lifespan, startLeave]);

    //==================================================| hook |==================================================\\
    /**
     * watch: watch notification in zustandStore
     * */
    useEffect(() => {
        if (notification) {
            addMessage(notification);
            updateNotification(null);
        }
    }, [notification]);

    /**
     * unmounting: clean up setTimeout
     * */
    useEffect(() => {
        return () => { timers.current.forEach(clearTimeout) }
    }, []);

    //==================================================| jsx |==================================================\\
    return (
        <ul className="arc-notification">
            {messages.map(item => (
                <li key={item.key}
                    className={`notification-${item.mode} ${item.leaving ? 'notification-leave-active' : 'notification-enter-active'}`}
                    onAnimationEnd={(e) => {
                        if (e.target !== e.currentTarget) return;
                        if (item.leaving) removeMessage(item.key);
                    }}
                >
                    <div className="notification-lifespan"
                        style={{
                            animationDuration: `${lifespan}s`,
                            animationPlayState: item.leaving ? 'paused' : 'running',
                        }}
                    />
                    <div className="notification-icon">
                        <i className={`fa-regular ${item.icon}`} />
                    </div>
                    <div className="notification-text">{item.text}</div>
                </li>
            ))}
        </ul>
    );
};

