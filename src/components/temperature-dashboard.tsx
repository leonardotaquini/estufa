"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Thermometer, RefreshCw, Clock, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { ChartDataPoint, TemperatureData } from "@/interfaces/dashboard.interface"
import { fetchTemperatureData } from "@/app/actions"
import { LineChartTemperature } from "./line-chart-temperature"
import { AreaChartTemperature } from "./area-chart-temperature"
import { TemperatureTable } from "./temperature-table"

export function TemperatureDashboard() {
  const [data, setData] = useState<TemperatureData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState(50)

  const fetchData = useCallback(async (qty?: number) => {
    try {
      setError(null)
      const result = await fetchTemperatureData(qty ?? results)
      setData(result)
      setLastUpdate(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }, [results])

  useEffect(() => {
    // Cargar datos inicialmente
    fetchData(results)
    // Actualización automática cada 3 minutos
    const interval = setInterval(() => fetchData(results), 3 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchData, results])

  const chartData: ChartDataPoint[] =
    data?.feeds.map((feed) => ({
      time: new Date(feed.created_at).toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      temperature: Number.parseFloat(feed.field1),
      fullTime: new Date(feed.created_at).toLocaleString("es-ES"),
    })) || []

  const currentTemp = data?.feeds[data.feeds.length - 1]?.field1
  const previousTemp = data?.feeds[data.feeds.length - 2]?.field1
  const tempChange = currentTemp && previousTemp ? Number.parseFloat(currentTemp) - Number.parseFloat(previousTemp) : 0

  const avgTemp =
    chartData.length > 0 ? chartData.reduce((sum, point) => sum + point.temperature, 0) / chartData.length : 0

  const maxTemp = chartData.length > 0 ? Math.max(...chartData.map((point) => point.temperature)) : 0
  const minTemp = chartData.length > 0 ? Math.min(...chartData.map((point) => point.temperature)) : 0

  // === Auto-zoom del eje Y con rango mínimo y padding ===
  const yDomain: [number, number] = (() => {
    if (chartData.length === 0) return [0, 60]
    const temps = chartData.map((p) => p.temperature)
    let min = Math.min(...temps)
    let max = Math.max(...temps)
    // Si el rango es muy chico, forzamos uno mínimo para que se vea
    if (Math.abs(max - min) < 0.5) {
      const mid = (min + max) / 2
      min = mid - 0.5
      max = mid + 0.5
    }
    const pad = Math.max(0.3, (max - min) * 0.2)
    return [min - pad, max + pad]
  })()

  const getTrendIcon = () => {
    if (tempChange > 0.1) return <TrendingUp className="h-4 w-4 text-red-500" />
    if (tempChange < -0.1) return <TrendingDown className="h-4 w-4 text-blue-500" />
    return <Minus className="h-4 w-4 text-gray-500" />
  }

  const getTrendColor = () => {
    if (tempChange > 0.1) return "text-red-500"
    if (tempChange < -0.1) return "text-blue-500"
    return "text-gray-500"
  }

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Cargando datos de temperatura...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Monitor de Temperatura</h1>
          <p className="text-muted-foreground">
            {data?.channel.name} - Canal #{data?.channel.id}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
          {lastUpdate && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Última actualización: {lastUpdate.toLocaleTimeString("es-ES")}</span>
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              fetchData(results)
            }}
            className="flex items-center space-x-2"
          >
            <Input
              type="number"
              min={1}
              value={results}
              onChange={(e) => setResults(Number(e.target.value))}
              className="w-24"
            />
            <Button type="submit" size="sm" variant="outline" disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Actualizar
            </Button>
          </form>
        </div>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-600">
              <span className="font-medium">Error:</span>
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temperatura Actual</CardTitle>
            <Thermometer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Number(currentTemp).toFixed(2)}°C</div>
            <div className={`flex items-center space-x-1 text-xs ${getTrendColor()}`}>
              {getTrendIcon()}
              <span>
                {tempChange > 0 ? "+" : ""}
                {tempChange.toFixed(2)}°C
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temperatura Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgTemp.toFixed(2)}°C</div>
            <p className="text-xs text-muted-foreground">Últimas {chartData.length} lecturas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temperatura Máxima</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{maxTemp.toFixed(2)}°C</div>
            <p className="text-xs text-muted-foreground">Pico registrado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temperatura Mínima</CardTitle>
            <TrendingDown className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{minTemp.toFixed(2)}°C</div>
            <p className="text-xs text-muted-foreground">Mínimo registrado</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <LineChartTemperature chartData={chartData} yDomain={yDomain} avgTemp={avgTemp} />

        <AreaChartTemperature chartData={chartData} yDomain={yDomain} avgTemp={avgTemp} />

      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lecturas Recientes</CardTitle>
          <CardDescription>Últimas {data?.feeds.length || 0} lecturas del sensor</CardDescription>
        </CardHeader>
        <CardContent>
          <TemperatureTable data={chartData} />
        </CardContent>
      </Card>
    </div>
  )
}
