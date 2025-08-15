import { envs } from '@/constants/enviroments'; 
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

class HttpClient {
    private instance = axios.create({
        baseURL: envs.BACKEND_URL,
        timeout: 10000,
    });
    

    async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        try {
            return await this.instance.get<T>(url, config);
        }
        catch (error: unknown) {
            return this.handleError<T>(error);
        }
    };

    async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        try {
            return await this.instance.post<T>(url, data, config);

        } catch (error: unknown) {
            return this.handleError<T>(error);

        }
    };

    async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        try {
            return await this.instance.patch<T>(url, data, config);
        }
        catch (error: unknown) {
            return this.handleError<T>(error);
        }
    };

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        try {
            return await this.instance.delete<T>(url, config);
        }
        catch (error: unknown) {
            return this.handleError<T>(error);
        }
    };

    private handleError<T>(error: unknown): AxiosResponse<T> {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            return axiosError.response as AxiosResponse<T>;
        }
        throw error;
    }

}

const httpClient = new HttpClient()
export default httpClient