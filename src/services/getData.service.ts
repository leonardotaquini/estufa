import httpClient from "@/adapter/http-client"
import { TemperatureData } from "@/interfaces/dashboard.interface";


export const getDataService = async () => {
    const response  = await httpClient.get<TemperatureData>('?results=50');
    return response;
} 


