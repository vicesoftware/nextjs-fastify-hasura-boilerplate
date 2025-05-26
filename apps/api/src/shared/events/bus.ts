/**
 * Simple in-memory event bus for cross-feature communication
 * Follows the microservices architecture pattern
 */
export interface EventHandler<T = unknown> {
  (data: T): Promise<void> | void;
}

export class InMemoryEventBus {
  private listeners: Map<string, EventHandler<unknown>[]> = new Map();

  /**
   * Emit an event to all registered listeners
   */
  async emit<T = unknown>(eventType: string, data: T): Promise<void> {
    const handlers = this.listeners.get(eventType) || [];

    // Execute all handlers concurrently
    const promises = handlers.map((handler) => {
      try {
        return Promise.resolve(handler(data));
      } catch (error) {
        console.error(`Event handler error for ${eventType}:`, error);
        return Promise.resolve();
      }
    });

    await Promise.allSettled(promises);
  }

  /**
   * Register an event listener
   */
  on<T = unknown>(eventType: string, handler: EventHandler<T>): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(handler as EventHandler<unknown>);
  }

  /**
   * Remove an event listener
   */
  off<T = unknown>(eventType: string, handler: EventHandler<T>): void {
    const handlers = this.listeners.get(eventType);
    if (handlers) {
      const index = handlers.indexOf(handler as EventHandler<unknown>);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * Remove all listeners for an event type
   */
  removeAllListeners(eventType: string): void {
    this.listeners.delete(eventType);
  }

  /**
   * Get the number of listeners for an event type
   */
  listenerCount(eventType: string): number {
    return this.listeners.get(eventType)?.length || 0;
  }
}

// Export type alias for the interface
export type EventBus = InMemoryEventBus;
