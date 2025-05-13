"use client";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "./chart";

interface AreaChartCardProps {
    data: any[];
    config: ChartConfig;
    areaKey?: string;
    title?: string;
    description?: string;
    summary?: string;
    footerSubtext?: string;
}

export default function AreaChartCard({
    data,
    config,
    areaKey = "desktop",
    title = "Area Chart",
    description = "Showing total visitors for the last 6 months",
    summary = "Trending up by 5.2% this month",
    footerSubtext = "January - June 2024",
}: AreaChartCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={config}>
                    <AreaChart
                        accessibilityLayer
                        data={data}
                        margin={{ left: 12, right: 12 }}
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
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Area
                            dataKey={areaKey}
                            type="monotone"
                            fill="var(--primary)"
                            fillOpacity={0.4}
                            stroke="var(--primary)"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 font-medium leading-none">
                            {summary} <TrendingUp className="h-4 w-4" />
                        </div>
                        <div className="flex items-center gap-2 leading-none text-muted-foreground">
                            {footerSubtext}
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
} 