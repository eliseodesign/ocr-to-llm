import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface IHttpProvider {
    get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
}

export class HttpProvider implements IHttpProvider {
    private axiosInstance: AxiosInstance;

    constructor(baseURL: string) {
        this.axiosInstance = axios.create({
            baseURL
        });
    }

    public async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        try {
            return await this.axiosInstance.get<T>(url, config);
        } catch (error) {
            return this.handleError(error);
        }
    }

    public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        try {
            return await this.axiosInstance.post<T>(url, data, config);
        } catch (error) {
            return this.handleError(error);
        }
    }

    public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        try {
            return await this.axiosInstance.put<T>(url, data, config);
        } catch (error) {
            return this.handleError(error);
        }
    }

    public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        try {
            return await this.axiosInstance.delete<T>(url, config);
        } catch (error) {
            return this.handleError(error);
        }
    }

    private handleError(error: any): any {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error.response?.data || error.message);
            throw error.response?.data || error.message;
        } else {
            console.error('Unexpected error:', error);
            throw error;
        }
    }
}
