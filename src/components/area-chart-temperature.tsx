import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area, ReferenceLine } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { ChartDataPoint } from "@/interfaces/dashboard.interface"
export const AreaChartTemperature = ({ chartData, yDomain, avgTemp }: { chartData: ChartDataPoint[], yDomain: [number, number], avgTemp: number }) => {
  return (
        <Card>
          <CardHeader>
            <CardTitle>Área de Temperatura</CardTitle>
            <CardDescription>Visualización del rango de temperatura</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                temperature: {
                  label: "Temperatura",
                  color: "var(--chart-4)",
                },
              }}
              className="h-[300px] max-w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="temperatureArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-4)" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="var(--chart-4)" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis
                    domain={yDomain}
                    tickCount={5}
                    allowDecimals
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value.toFixed(1)}°C`}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    labelFormatter={(value, payload) => {
                      if (payload && payload[0]) {
                        return payload[0].payload.fullTime
                      }
                      return value
                    }}
                    formatter={(value: number) => [`${value.toFixed(2)}°C`, "Temperatura"]}
                  />
                  <ReferenceLine y={avgTemp} strokeDasharray="4 4" stroke="currentColor" ifOverflow="extendDomain" />
                  <Area
                    type="monotone"
                    dataKey="temperature"
                    stroke="var(--chart-4)"
                    fill="url(#temperatureArea)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
  )
}
