import axios, {AxiosInstance, AxiosRequestConfig} from 'axios';
import * as Utils from './axiosUtils';

export class BaseService {
  protected client: AxiosInstance;

  constructor(protected options: {baseURL: string; headers: any}) {
    this.client = axios.create({
      baseURL: options.baseURL,
      headers: options.headers,
    });
  }

  async get<T>(
    path: string,
    config: AxiosRequestConfig = {
      params: {},
      headers: {},
      responseType: 'json',
    },
  ) {
    return Utils.get<T>(this.client, path, config);
  }

  async post<T>(
    path: string,
    data: any = {},
    config: AxiosRequestConfig = {params: {}, headers: {}},
  ) {
    return Utils.post<T>(this.client, path, data, config);
  }

  async put<T>(
    path: string,
    data: any = {},
    config: AxiosRequestConfig = {params: {}, headers: {}},
  ) {
    return Utils.put<T>(this.client, path, data, config);
  }

  async patch<T>(
    path: string,
    data: any = {},
    config: AxiosRequestConfig = {params: {}, headers: {}},
  ) {
    return Utils.patch<T>(this.client, path, data, config);
  }

  async del<T>(path: string) {
    return Utils.del<T>(this.client, path);
  }
}
