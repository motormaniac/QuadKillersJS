import { logError } from "./Error";

export let eventManager: EventManager;

export function createEventManager(): EventManager {
    if (eventManager) {
        logError("EventManager instance already exists");
        return eventManager;
    }
    eventManager = new EventManager();
    return eventManager;
}

class EventManager {
    private listeners: Record<string, Array<(...args: any[]) => void>> = {};
    addListener(event: string, listener: (...args: any[]) => void): void {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(listener);
    }
    removeListener(event: string, listener: (...args: any[]) => void): void {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(l => l !== listener);
    }
    emit(event: string, ...args: any[]): void {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(listener => listener(...args));
    }
}