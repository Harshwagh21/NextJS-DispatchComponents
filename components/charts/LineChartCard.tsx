"use client";
import { TrendingUp } from "lucide-react";
import { CartesianGrid, Dot, Line, LineChart } from "recharts";
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

interface LineChartCardProps {
    data: ChartDataPoint[];
    config: ChartConfig;
    lineKey?: string;
    title?: string;
    description?: string;
    summary?: string;
    showFooter?: boolean;
}

export default function LineChartCard({
    data,
    config,
    lineKey = "visitors",
    title = "Line Chart - Dots Colors",
    description = "January - June 2024",
    summary = "Trending up by 5.2% this month",
    showFooter = true,
}: LineChartCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={config}>
                    <LineChart
                        accessibilityLayer
                        data={data}
                        margin={{ top: 24, left: 24, right: 24 }}
                    >
                        <CartesianGrid vertical={false} />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    indicator="line"
                                    nameKey={lineKey}
                                    hideLabel
                                />
                            }
                        />
                        <Line
                            dataKey={lineKey}
                            type="monotone"
                            stroke="var(--primary)"
                            strokeWidth={2}
                            dot={(props) => {
                                const key = props.index ?? `${props.cx}-${props.cy}`;
                                return (
                                    <Dot
                                        key={key}
                                        r={5}
                                        cx={props.cx}
                                        cy={props.cy}
                                        fill="var(--primary)"
                                        stroke="var(--primary)"
                                    />
                                );
                            }}
                        />
                    </LineChart>
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