import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import axios from "axios";

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
}

export interface ApiError {
  message: string;
  status?: number;
  data?: any;
  isApiError: boolean;
  code?: string;
}

export interface HttpClientConfig {
  baseURL: string;
  timeout?: number;
  withCredentials?: boolean;
  headers?: Record<string, string>;
  canRetryOnAuthError?: () => Promise<boolean>;
}

const DEFAULT_TIMEOUT = 30000;

export class HttpClient {
  private readonly instance: AxiosInstance;
  private readonly canRetryOnAuthError?: () => Promise<boolean>;

  constructor(config: HttpClientConfig) {
    this.canRetryOnAuthError = config.canRetryOnAuthError;
    this.instance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || DEFAULT_TIMEOUT,
      withCredentials: config.withCredentials ?? true,
      headers: {
        "Content-Type": "application/json",
        ...(config.headers || {}),
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Response interceptor - transform response and handle errors
    this.instance.interceptors.response.use(
      (response) => ({
        ...this.handleResponse(response),
        config: response.config,
        headers: response.headers,
      }),
      this.handleError.bind(this),
    );
  }

  private handleResponse(response: AxiosResponse): ApiResponse {
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  }

  private readonly handleError = async (error: AxiosError): Promise<never> => {
    const apiError: ApiError = {
      message: "An unexpected error occurred",
      isApiError: true,
    };

    const errorResponse = error.response?.data as any;

    const errorMessage = errorResponse?.message || error.message;

    if (error.response) {
      apiError.status = error.response.status;
      apiError.data = error.response.data;

      switch (error.response.status) {
        case 401:
        case 403:
          // Try token refresh before giving up
          if (await this.canRetryOnAuthError?.()) {
            // Retry the original request
            return this.instance.request(error.config!);
          }
          apiError.message = errorMessage || "Unauthorized: Please reconnect";
          break;

        case 404:
          apiError.message = errorMessage || "Resource not found";
          break;

        case 422:
          apiError.message = errorMessage || "Validation error";
          break;

        case 429:
          // Rate limiting - suggest retry after delay
          const retryAfter = error.response.headers["retry-after"] || "60";
          apiError.message = `Too many requests. Please try again in ${retryAfter} seconds.`;
          break;

        case 500:
        case 502:
        case 503:
        case 504:
          apiError.message =
            errorMessage || "Server error: Please try again later";
          break;

        default:
          apiError.message =
            errorMessage ||
            `Request failed with status ${error.response.status}`;
      }
    } else if (error.request) {
      // Network error
      if (error.code === "NETWORK_ERROR") {
        apiError.message =
          "Connection error: Please check your internet connection";
      } else if (error.code === "ECONNABORTED") {
        apiError.message = "Timeout: Please try again";
      } else {
        apiError.message = "Network error: Please try again later";
      }
    } else {
      apiError.message = error.message || "Request configuration error";
    }

    return Promise.reject(apiError);
  };

  private async request<T = any>(
    config: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    console.log("API Request:", {
      component: "HttpClient",
      operation: "request",
      metadata: {
        url: config.url,
        method: config.method,
        data: config.data,
        params: config.params,
        baseURL: this.instance.defaults.baseURL,
      },
    });
    return await this.instance.request(config);
  }

  public async get<T = any>(
    endpoint: string,
    params?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: "GET",
      url: endpoint,
      params,
      ...config,
    });
  }

  public async post<T = any>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: "POST",
      url: endpoint,
      data,
      ...config,
    });
  }

  public async put<T = any>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: "PUT",
      url: endpoint,
      data,
      ...config,
    });
  }

  public async patch<T = any>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: "PATCH",
      url: endpoint,
      data,
      ...config,
    });
  }

  public async delete<T = any>(
    endpoint: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: "DELETE",
      url: endpoint,
      ...config,
    });
  }
}

export const createHttpClient = (config: HttpClientConfig): HttpClient => {
  return new HttpClient(config);
};
