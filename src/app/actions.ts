'use server'

import { getDataService } from '@/services/getData.service'
import { TemperatureData } from '@/interfaces/dashboard.interface'

export async function fetchTemperatureData(results: number): Promise<TemperatureData> {
  const response = await getDataService(results)
  if (response.status !== 200) {
    throw new Error('Error al obtener los datos')
  }
  return response.data
}
