"use client";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

interface ChartDataPoint {
    month: string;
    [key: string]: string | number;
}

interface BarChartCardProps {
    data: ChartDataPoint[];
    config: ChartConfig;
    title?: string;
    description?: string;
    summary?: string;
    barKey?: string;
    showFooter?: boolean;
}

export default function BarChartCard({
    data,
    config,
    title = "Bar Chart",
    description = "January - June 2024",
    summary = "Trending up by 5.2% this month",
    barKey = "desktop",
    showFooter = true,
}: BarChartCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={config}>
                    <BarChart accessibilityLayer data={data}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey={barKey} fill="var(--primary)" radius={8} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            {showFooter && (
                <CardFooter className="flex-col items-start gap-2 text-sm">
                    <div className="flex gap-2 font-medium leading-none">
                        {summary} <TrendingUp className="h-4 w-4" />
                    </div>
                    <div className="leading-none text-muted-foreground">
                        Showing total visitors for the last 6 months
                    </div>
                </CardFooter>
            )}
        </Card>
    );
}
