"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ChartDataPoint } from "@/interfaces/dashboard.interface"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"

export const LineChartTemperature = ({ chartData, yDomain, avgTemp }: {chartData: ChartDataPoint[], yDomain: [number, number], avgTemp: number}) => {
  return (
        <Card>
          <CardHeader>
            <CardTitle>Tendencia de Temperatura</CardTitle>
            <CardDescription>Evolución de la temperatura en tiempo real</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                temperature: {
                  label: "Temperatura",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
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
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={3}
                    dot={{ r: 5, strokeWidth: 2, fill: "hsl(var(--chart-1))" }}
                    activeDot={{ r: 7, stroke: "hsl(var(--chart-1))", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
  )
}
