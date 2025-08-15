import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChartDataPoint } from "@/interfaces/dashboard.interface"
import { Thermometer } from "lucide-react"

export function TemperatureTable({ data }: { data: ChartDataPoint[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Hora</TableHead>
          <TableHead className="hidden sm:table-cell">Fecha Completa</TableHead>
          <TableHead className="text-right">Temperatura</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data
          .slice()
          .reverse()
          .map((point, index) => (
            <TableRow key={index}>
              <TableCell>
                <Badge variant="outline">{point.time}</Badge>
              </TableCell>
              <TableCell className="hidden sm:table-cell text-muted-foreground">
                {point.fullTime}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-2">
                  <Thermometer className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {point.temperature.toFixed(2)}°C
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  )
}
