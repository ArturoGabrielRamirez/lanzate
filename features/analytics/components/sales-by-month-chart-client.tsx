/* 'use client'

import { useState } from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SalesByMonthChartClientProps } from "@/features/analytics/types"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B', '#4ECDC4', '#45B7D1']

export function SalesByMonthChartClient({ data }: SalesByMonthChartClientProps) {
    const [chartType, setChartType] = useState<'bar' | 'line' | 'area'>('bar')
    const [metric, setMetric] = useState<'revenue' | 'orders' | 'quantity' | 'averageOrder'>('revenue')

    // Calculate max value for Y axis with some padding
    const maxValue = Math.max(...data.map(item => item[metric]), 0)
    const yAxisMax = Math.ceil(maxValue * 1.2) // Add 20% padding

    const getMetricLabel = (metric: string) => {
        switch (metric) {
            case 'revenue': return 'Revenue ($)'
            case 'orders': return 'Orders'
            case 'quantity': return 'Quantity'
            case 'averageOrder': return 'Avg Order ($)'
            default: return metric
        }
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Sales by Month</CardTitle>
                    <div className="flex items-center gap-2">
                        <Select value={metric} onValueChange={(value: 'revenue' | 'orders' | 'quantity' | 'averageOrder') => setMetric(value)}>
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="revenue">Revenue</SelectItem>
                                <SelectItem value="orders">Orders</SelectItem>
                                <SelectItem value="quantity">Quantity</SelectItem>
                                <SelectItem value="averageOrder">Avg Order</SelectItem>
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
                            <Tooltip formatter={(value) => [value, getMetricLabel(metric)]} />
                            <Bar dataKey={metric} fill="#8884d8" radius={[2, 2, 0, 0]} />
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
                            <Tooltip formatter={(value) => [value, getMetricLabel(metric)]} />
                            <Line type="monotone" dataKey={metric} stroke="#8884d8" strokeWidth={3} dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }} />
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
                            <Tooltip formatter={(value) => [value, getMetricLabel(metric)]} />
                            <Area type="monotone" dataKey={metric} stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                        </AreaChart>
                    )}
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}  */