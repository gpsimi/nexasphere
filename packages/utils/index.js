// Event Bus implementation using window CustomEvents
export const EventBus = {
  publish(event, data) {
    if (typeof window !== 'undefined') {
      const customEvent = new CustomEvent(`nexasphere:${event}`, { detail: data });
      window.dispatchEvent(customEvent);
    }
  },
  
  subscribe(event, callback) {
    if (typeof window !== 'undefined') {
      const handler = (e) => callback(e.detail);
      window.addEventListener(`nexasphere:${event}`, handler);
      return () => window.removeEventListener(`nexasphere:${event}`, handler);
    }
    return () => {};
  }
};

// API Client Helper
const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    return window.__NEXT_PUBLIC_API_URL__ || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
};

export const apiClient = {
  async request(endpoint, options = {}) {
    const url = `${getApiUrl()}${endpoint}`;
    
    // Build headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    // Add bearer token if it exists in localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('nexasphere_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    
    const config = {
      ...options,
      headers,
    };
    
    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }
    
    try {
      const response = await fetch(url, config);
      
      // Handle unauthorized
      if (response.status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('nexasphere_token');
        localStorage.removeItem('nexasphere_user');
        window.dispatchEvent(new CustomEvent('nexasphere:unauthorized'));
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      return data;
    } catch (error) {
      console.error(`API Request Error [${endpoint}]:`, error);
      throw error;
    }
  },
  
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  },
  
  post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body });
  },
  
  put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  },
  
  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
};
