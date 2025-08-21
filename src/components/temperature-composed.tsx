"use client";

import React from "react";
import {
    ResponsiveContainer,
    ComposedChart,
    Area,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ReferenceLine,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ChartContainer } from "./ui/chart";

export type ComposedPoint = {
    time: string;               // eje X (ej: "10:25")
    fullTime: string;           // para tooltip
    temperature: number;        // dato crudo
    smoothTemp?: number | null; // media móvil
};


interface TemperatureComposedProps {
    data: ComposedPoint[];
    yDomain?: [number, number];
    showLegend?: boolean;
    avgTemp: number;
}

import type { TooltipProps } from "recharts";
import type {
    ValueType,
    NameType,
    Payload,
} from "recharts/types/component/DefaultTooltipContent";

export function TemperatureComposed({
    data,
    yDomain,
    showLegend = true,
    avgTemp,
}: TemperatureComposedProps) {
    const domain: [number, number] =
        yDomain ??
        (() => {
            if (!data.length) return [20, 60];
            const vals = data.map((d) => d.temperature);
            let min = Math.min(...vals);
            let max = Math.max(...vals);
            if (Math.abs(max - min) < 0.5) {
                const mid = (min + max) / 2;
                min = mid - 0.5;
                max = mid + 0.5;
            }
            const pad = Math.max(0.3, (max - min) * 0.2);
            return [min - pad, max + pad];
        })();


    const tooltipFormatter: TooltipProps<ValueType, NameType>["formatter"] = (
        value,
        _name,
        payloadItem
    ) => {
        // payloadItem trae info de la serie activa
        const p = payloadItem as Payload<ValueType, NameType> | undefined;
        const key = (p?.dataKey as string) ?? String(_name); // "temperature" | "smoothTemp"

        const label =
            key === "temperature"
                ? "Temperatura"
                : key === "smoothTemp"
                    ? "Media móvil"
                    : String(_name);

        return [typeof value === "number" ? `${value.toFixed(2)}°C` : String(value), label];
    };

    const tooltipLabelFormatter: TooltipProps<ValueType, NameType>["labelFormatter"] = (
        label,
        payload
    ) => {
        const arr = payload as Payload<ValueType, NameType>[] | undefined;
        const first = Array.isArray(arr) ? arr[0] : undefined;
        const fullTime = (first?.payload as { fullTime?: string } | undefined)?.fullTime;
        return fullTime ?? `Hora: ${String(label)}`;
    };
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
                    className="h-[300px] w-full"
                >
                    <ResponsiveContainer>
                        <ComposedChart data={data} margin={{ top: 12, right: 16, bottom: 8, left: 8 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" tickLine={false} axisLine={false} />
                            <YAxis
                                domain={domain}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(v: number) => `${v.toFixed(1)}°C`}
                            />
                            <Tooltip
                                formatter={tooltipFormatter}
                                labelFormatter={tooltipLabelFormatter}
                            />
                            {showLegend && <Legend />}

                            {/* Línea de referencia del promedio */}
                            <ReferenceLine
                                y={avgTemp}
                                strokeDasharray="4 4"
                                stroke="currentColor"
                                ifOverflow="extendDomain"
                            />

                            {/* Área = datos crudos */}
                            <Area
                                type="monotone"
                                dataKey="temperature"
                                name="Temperatura"
                                stroke="var(--chart-4)"
                                fill="var(--chart-4)"
                                fillOpacity={0.15}
                                strokeWidth={2}
                                dot={false}
                                isAnimationActive={false}
                            />

                            {/* Línea = curva suavizada */}
                            <Line
                                type="monotone"
                                dataKey="smoothTemp"
                                name="Media móvil"
                                stroke="var(--chart-5)"
                                strokeWidth={2.5}
                                dot={false}
                                connectNulls
                                isAnimationActive={false}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
