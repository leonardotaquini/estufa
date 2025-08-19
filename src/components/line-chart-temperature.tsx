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

export const LineChartTemperature = ({ chartData, yDomain, avgTemp }: { chartData: ChartDataPoint[], yDomain: [number, number], avgTemp: number }) => {
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
              color: "var(--chart-4)",
            },
          }}
          className="h-[300px] max-w-full"
        >
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <defs>
                <linearGradient id="temperatureLine" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-4)" stopOpacity={1} />
                  <stop offset="100%" stopColor="var(--chart-4)" stopOpacity={0.2} />
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
              <Line
                type="monotone"
                stroke="url(#temperatureLine)"
                dataKey="smoothTemp"
                strokeWidth={2}
                dot={false}
                name="Media móvil"
                // dot={{ r: 4, strokeWidth: 2, fill: "var(--chart-4)" }}
                activeDot={{ r: 6, stroke: "var(--chart-4)", strokeWidth: 2 }}
                strokeLinecap="round"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
