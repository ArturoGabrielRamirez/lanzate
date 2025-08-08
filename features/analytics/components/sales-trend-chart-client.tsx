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

type SalesTrendChartClientProps = {
    data: ChartData[]
}

export default function SalesTrendChartClient({ data }: SalesTrendChartClientProps) {
    const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('line')
    const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily')

    // Calculate max value for Y axis with some padding
    const maxRevenue = Math.max(...data.map(item => item.revenue), 0)
    const yAxisMax = Math.ceil(maxRevenue * 1.2) // Add 20% padding

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Sales Trend Over Time</CardTitle>
                    <div className="flex items-center gap-2">
                        <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                if (chartType === 'line') setChartType('area')
                                else if (chartType === 'area') setChartType('bar')
                                else setChartType('line')
                            }}
                        >
                            {chartType === 'line' ? 'Area Chart' : chartType === 'area' ? 'Bar Chart' : 'Line Chart'}
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    {chartType === 'line' ? (
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
                    ) : chartType === 'area' ? (
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
                    ) : (
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
                    )}
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
} 