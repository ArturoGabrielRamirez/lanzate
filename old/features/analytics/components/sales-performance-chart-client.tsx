'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, LineChart, Line, Area, AreaChart } from "recharts"
import { useState } from "react"

type ChartData = {
    name: string
    revenue: number
    orders: number
    quantity: number
    averageOrder: number
}

type SalesPerformanceChartClientProps = {
    data: ChartData[]
}

export default function SalesPerformanceChartClient({ data }: SalesPerformanceChartClientProps) {
    const [chartType, setChartType] = useState<'bar' | 'line' | 'area'>('bar')
    const [timeUnit, setTimeUnit] = useState<'hourly' | 'daily' | 'monthly'>('daily')

    // Calculate max value for Y axis with some padding
    const maxRevenue = Math.max(...data.map(item => item.revenue), 0)
    const yAxisMax = Math.ceil(maxRevenue * 1.2) // Add 20% padding

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Sales Performance by Time Periods</CardTitle>
                    <div className="flex items-center gap-2">
                        <Select value={timeUnit} onValueChange={(value: any) => setTimeUnit(value)}>
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="hourly">Hourly</SelectItem>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                if (chartType === 'bar') setChartType('line')
                                else if (chartType === 'line') setChartType('area')
                                else setChartType('bar')
                            }}
                        >
                            {chartType === 'bar' ? 'Line Chart' : chartType === 'line' ? 'Area Chart' : 'Bar Chart'}
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    {chartType === 'bar' ? (
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="name" 
                                angle={-45}
                                textAnchor="end"
                                height={100}
                                fontSize={12}
                            />
                            <YAxis domain={[0, yAxisMax]} />
                            <Tooltip formatter={(value: any) => [`$${value}`, 'Revenue']} />
                            <Bar dataKey="revenue" fill="#8884d8" radius={[2, 2, 0, 0]} />
                        </BarChart>
                    ) : chartType === 'line' ? (
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="name" 
                                angle={-45}
                                textAnchor="end"
                                height={100}
                                fontSize={12}
                            />
                            <YAxis domain={[0, yAxisMax]} />
                            <Tooltip formatter={(value: any) => [`$${value}`, 'Revenue']} />
                            <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={3} dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }} />
                        </LineChart>
                    ) : (
                        <AreaChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="name" 
                                angle={-45}
                                textAnchor="end"
                                height={100}
                                fontSize={12}
                            />
                            <YAxis domain={[0, yAxisMax]} />
                            <Tooltip formatter={(value: any) => [`$${value}`, 'Revenue']} />
                            <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                        </AreaChart>
                    )}
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
} 