export const EventBus: {
  publish(event: string, data: any): void;
  subscribe(event: string, callback: (data: any) => void): () => void;
};

export const apiClient: {
  request(endpoint: string, options?: RequestInit & { body?: any }): Promise<any>;
  get(endpoint: string, options?: RequestInit): Promise<any>;
  post(endpoint: string, body?: any, options?: RequestInit): Promise<any>;
  put(endpoint: string, body?: any, options?: RequestInit): Promise<any>;
  delete(endpoint: string, options?: RequestInit): Promise<any>;
};

export function formatCurrency(amount: number | string, currency?: string): string;
export function formatDate(dateString: string | Date): string;
