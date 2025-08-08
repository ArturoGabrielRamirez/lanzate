'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell, LineChart, Line } from "recharts"
import { useState } from "react"

type ChartData = {
    name: string
    branch: string
    product: string
    quantity: number
    revenue: number
}

type PieData = {
    name: string
    value: number
}

type TopProductsByBranchChartClientProps = {
    data: ChartData[]
    pieData: PieData[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B', '#4ECDC4', '#45B7D1']

export default function TopProductsByBranchChartClient({ data, pieData }: TopProductsByBranchChartClientProps) {
    const [chartType, setChartType] = useState<'bar' | 'pie' | 'line'>('bar')
    const [timeRange, setTimeRange] = useState('30')

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Top Products by Branch</CardTitle>
                    <div className="flex items-center gap-2">
                        <Select value={timeRange} onValueChange={setTimeRange}>
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7">Last Week</SelectItem>
                                <SelectItem value="30">Last Month</SelectItem>
                                <SelectItem value="365">Last Year</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                if (chartType === 'bar') setChartType('pie')
                                else if (chartType === 'pie') setChartType('line')
                                else setChartType('bar')
                            }}
                        >
                            {chartType === 'bar' ? 'Pie Chart' : chartType === 'pie' ? 'Line Chart' : 'Bar Chart'}
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
                                height={120}
                                fontSize={10}
                            />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="quantity" fill="#8884d8" />
                        </BarChart>
                    ) : chartType === 'pie' ? (
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    ) : (
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="name" 
                                angle={-45}
                                textAnchor="end"
                                height={120}
                                fontSize={10}
                            />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="quantity" stroke="#8884d8" strokeWidth={2} />
                            <Line type="monotone" dataKey="revenue" stroke="#82ca9d" strokeWidth={2} />
                        </LineChart>
                    )}
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
} 