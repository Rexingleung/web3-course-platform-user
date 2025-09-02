import { API_BASE_URL } from '../utils/constants';
import { Course } from '../types';

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'API request failed');
    }

    return data.data;
  }

  async getCourses(): Promise<Course[]> {
    return this.request<Course[]>('/courses');
  }

  async getCourse(courseId: number): Promise<Course> {
    return this.request<Course>(`/courses/${courseId}`);
  }

  async getUserPurchasedCourses(userAddress: string): Promise<Course[]> {
    return this.request<Course[]>(`/courses/purchased/${userAddress}`);
  }

  async checkPurchaseStatus(courseId: number, userAddress: string): Promise<{ hasPurchased: boolean }> {
    return this.request<{ hasPurchased: boolean }>(`/courses/purchased/${courseId}/${userAddress}`);
  }

  async recordPurchase(data: {
    courseId: number;
    buyer: string;
    transactionHash: string;
    price: string;
  }): Promise<void> {
    return this.request<void>('/courses/purchase', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async syncCourses(): Promise<void> {
    return this.request<void>('/courses/sync', {
      method: 'POST',
    });
  }
}

export const apiService = new ApiService();
