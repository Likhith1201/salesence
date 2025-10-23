// API Service for backend communication
import { AnalyzeResponse, ApiError } from '@/types/api.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Analyze a product URL using the backend scraper
   * @param url - Product URL to analyze
   * @returns Promise with analysis results
   */
  async analyzeProduct(url: string): Promise<AnalyzeResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          message: errorData.message || `HTTP error! status: ${response.status}`,
          statusCode: response.status,
          code: errorData.code,
        } as ApiError;
      }

      const data: AnalyzeResponse = await response.json();
      return data;
    } catch (error) {
      // Network or parsing errors
      if (error instanceof TypeError) {
        throw {
          message: 'Network error. Please check if the backend server is running.',
          statusCode: 0,
        } as ApiError;
      }
      throw error;
    }
  }

  /**
   * Check backend health status
   * @returns Promise with health status
   */
  async checkHealth(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      if (!response.ok) {
        throw new Error('Health check failed');
      }
      return await response.json();
    } catch (error) {
      throw {
        message: 'Backend server is not available',
        statusCode: 0,
      } as ApiError;
    }
  }
}

// Export singleton instance
export const apiService = new ApiService(API_BASE_URL);

// Export class for testing
export default ApiService;
