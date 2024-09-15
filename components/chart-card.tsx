"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A line chart"

const chartData = [
  { month: "January", openCases: 42 },
  { month: "February", openCases: 38 },
  { month: "March", openCases: 45 },
  { month: "April", openCases: 39 },
  { month: "May", openCases: 36 },
  { month: "June", openCases: 41 },
]

const chartConfig = {
  openCases: {
    label: "Open Cases",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

interface ChartCardProps {
  title: string
  description: string
  trendPercentage: number
  footerText: string
  chartData: { month: string; openCases: number }[];
}

export function ChartCard({ title, description, trendPercentage, footerText, chartData }: ChartCardProps) {
  const TrendIcon = trendPercentage >= 0 ? TrendingUp : TrendingDown
  const trendText = trendPercentage >= 0 ? "up" : "down"

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="openCases"
              type="natural"
              stroke="var(--color-openCases)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending {trendText} by {Math.abs(trendPercentage)}% this month <TrendIcon className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          {footerText}
        </div>
      </CardFooter>
    </Card>
  )
}
