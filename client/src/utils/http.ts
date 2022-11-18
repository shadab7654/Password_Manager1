import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

import envConfig from "../config";

import { TokenStorage } from "./storage";

export interface CacheOptions {
  key: string;
  ttl: number;
  isRefresh?: boolean;
}

class Service {
  public api: AxiosInstance;

  constructor(baseURL: string) {
    this.api = axios.create({ baseURL });
    this.api.interceptors.request.use(
      (config) => {
        if (!config || !config.headers) {
          return config;
        }

        const token = TokenStorage.get();
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  public async get(url: string, config?: AxiosRequestConfig) {
    let finalConfig: AxiosRequestConfig = {};
    if (config) {
      finalConfig = { ...config };
    }

    const res = await this.api.get(url, finalConfig);

    return res;
  }

  public async post(url: string, data: any, config?: AxiosRequestConfig) {
    let finalConfig: AxiosRequestConfig = {};
    if (config) {
      finalConfig = { ...config };
    }

    const res = await this.api.post(url, data, finalConfig);

    return res;
  }

  public async put(
    url: string,
    data: any,
    config?: AxiosRequestConfig
  ): Promise<any> {
    let finalConfig: AxiosRequestConfig = {};
    if (config) {
      finalConfig = { ...config };
    }

    const res = await this.api.put(url, data, finalConfig);

    return res;
  }

  public async delete(url: string, config?: AxiosRequestConfig): Promise<any> {
    let finalConfig: AxiosRequestConfig = {};
    if (config) {
      finalConfig = { ...config };
    }

    return await this.api.delete(url, finalConfig);
  }
}

const http = new Service(envConfig.BASE_URL);

export default http;
