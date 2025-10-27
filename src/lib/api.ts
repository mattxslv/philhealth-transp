import axios, { AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/data';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function fetchData<T>(endpoint: string): Promise<T> {
  try {
    const response = await axios.get<T>(`${API_BASE_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      throw new ApiError(
        axiosError.message || 'Failed to fetch data',
        axiosError.response?.status,
        axiosError.response?.data
      );
    }
    throw new ApiError('An unexpected error occurred');
  }
}

export async function postData<T, R>(endpoint: string, data: T): Promise<R> {
  try {
    const response = await axios.post<R>(`${API_BASE_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      throw new ApiError(
        axiosError.message || 'Failed to post data',
        axiosError.response?.status,
        axiosError.response?.data
      );
    }
    throw new ApiError('An unexpected error occurred');
  }
}

// Data fetching functions
export const api = {
  getFinancials: () => fetchData('/financials.json'),
  getClaims: () => fetchData('/claims.json'),
  getCoverage: () => fetchData('/coverage.json'),
  getFacilities: () => fetchData('/facilities.json'),
  getProcurement: () => fetchData('/procurement.json'),
  getGovernance: () => fetchData('/governance.json'),
  getEngagement: () => fetchData('/engagement.json'),
};
