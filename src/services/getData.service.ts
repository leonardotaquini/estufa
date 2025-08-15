import httpClient from "@/adapter/http-client"
import { TemperatureData } from "@/interfaces/dashboard.interface"

export const getDataService = async (results: number) => {
  const response = await httpClient.get<TemperatureData>(`?results=${results}`)
  return response
}


