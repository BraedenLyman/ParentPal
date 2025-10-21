import React from "react";
import { Chart, useChart } from "@chakra-ui/charts";
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function ReportsCharts({ loading, selectedChart, growthRecords, sleepRecords, feedingRecords }) {
    const growthChartData = growthRecords
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(record => ({
            date: new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            height: parseFloat(record.height),
            weight: parseFloat(record.weight),
        }));

    const growthChart = useChart({
        data: growthChartData,
    });

    const sleepChartData = sleepRecords
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(record => ({
            date: new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            hours: parseFloat(record.sleep_duration),
        }));

    const averageSleep = sleepChartData.length > 0
        ? (sleepChartData.reduce((sum, record) => sum + record.hours, 0) / sleepChartData.length).toFixed(1)
        : 0;

    const sleepChart = useChart({
        data: sleepChartData,
    });

    const feedingByDate = feedingRecords.reduce((acc, record) => {
        const date = new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (!acc[date]) {
            acc[date] = { date, count: 0, totalAmount: 0 };
        }
        acc[date].count += 1;
        acc[date].totalAmount += parseFloat(record.amount) || 0;
        return acc;
    }, {});

    const feedingChartData = Object.values(feedingByDate)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    const feedingChart = useChart({
        data: feedingChartData,
    });

    if (loading) {
        return <h2>Loading reports...</h2>;
    }

    if (selectedChart === "growth") {
        return (
            <div className="chartSection">
                <h2 className="chartTitle">Growth Over Time</h2>
                {growthChartData.length === 0 ? (
                    <p className="noDataMessage">No growth records available</p>
                ) : (
                    <div className="chartContainer">
                        <Chart.Root chart={growthChart}>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={growthChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#666"
                                        style={{ fontSize: '12px' }}
                                    />
                                    <YAxis
                                        stroke="#666"
                                        style={{ fontSize: '12px' }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.98)',
                                            border: '1px solid rgba(102, 126, 234, 0.3)',
                                            borderRadius: '12px',
                                            padding: '12px',
                                            boxShadow: '0 8px 20px rgba(102, 126, 234, 0.2)'
                                        }}
                                        labelStyle={{
                                            fontWeight: 'bold',
                                            color: '#667eea',
                                            marginBottom: '5px'
                                        }}
                                    />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="height"
                                        stroke={growthChart.color("primary")}
                                        strokeWidth={3}
                                        name="Height"
                                        dot={{ fill: growthChart.color("primary"), r: 5, strokeWidth: 2, stroke: '#fff' }}
                                        activeDot={{ r: 7, strokeWidth: 2 }}
                                        connectNulls={true}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="weight"
                                        stroke={growthChart.color("secondary")}
                                        strokeWidth={3}
                                        name="Weight"
                                        dot={{ fill: growthChart.color("secondary"), r: 5, strokeWidth: 2, stroke: '#fff' }}
                                        activeDot={{ r: 7, strokeWidth: 2 }}
                                        connectNulls={true}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </Chart.Root>
                    </div>
                )}
            </div>
        );
    }

    if (selectedChart === "sleep") {
        return (
            <div className="chartSection">
                <div className="chartHeader">
                    <h2 className="chartTitle">Sleep Patterns</h2>
                    <p className="averageLabel">Average: {averageSleep} hours</p>
                </div>
                {sleepChartData.length === 0 ? (
                    <p className="noDataMessage">No sleep records available</p>
                ) : (
                    <div className="chartContainer">
                        <Chart.Root chart={sleepChart}>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={sleepChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#666"
                                        style={{ fontSize: '12px' }}
                                    />
                                    <YAxis
                                        stroke="#666"
                                        style={{ fontSize: '12px' }}
                                        label={{ value: 'Hours', angle: -90, position: 'insideLeft' }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.98)',
                                            border: '1px solid rgba(102, 126, 234, 0.3)',
                                            borderRadius: '12px',
                                            padding: '12px',
                                            boxShadow: '0 8px 20px rgba(102, 126, 234, 0.2)'
                                        }}
                                        labelStyle={{
                                            fontWeight: 'bold',
                                            color: '#667eea',
                                            marginBottom: '5px'
                                        }}
                                    />
                                    <Legend />
                                    <Bar
                                        dataKey="hours"
                                        fill={sleepChart.color("primary")}
                                        name="Sleep Hours"
                                        radius={[10, 10, 0, 0]}
                                        maxBarSize={60}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </Chart.Root>
                    </div>
                )}
            </div>
        );
    }

    if (selectedChart === "feeding") {
        return (
            <div className="chartSection">
                <h2 className="chartTitle">Feeding Patterns</h2>
                {feedingChartData.length === 0 ? (
                    <p className="noDataMessage">No feeding records available</p>
                ) : (
                    <div className="chartContainer">
                        <Chart.Root chart={feedingChart}>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={feedingChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#666"
                                        style={{ fontSize: '12px' }}
                                    />
                                    <YAxis
                                        stroke="#666"
                                        style={{ fontSize: '12px' }}
                                        label={{ value: 'Count', angle: -90, position: 'insideLeft' }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.98)',
                                            border: '1px solid rgba(102, 126, 234, 0.3)',
                                            borderRadius: '12px',
                                            padding: '12px',
                                            boxShadow: '0 8px 20px rgba(102, 126, 234, 0.2)'
                                        }}
                                        labelStyle={{
                                            fontWeight: 'bold',
                                            color: '#667eea',
                                            marginBottom: '5px'
                                        }}
                                    />
                                    <Legend />
                                    <Bar
                                        dataKey="count"
                                        fill={feedingChart.color("primary")}
                                        name="Feeding Count"
                                        radius={[10, 10, 0, 0]}
                                        maxBarSize={50}
                                    />
                                    <Bar
                                        dataKey="totalAmount"
                                        fill={feedingChart.color("secondary")}
                                        name="Total Amount (oz)"
                                        radius={[10, 10, 0, 0]}
                                        maxBarSize={50}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </Chart.Root>
                    </div>
                )}
            </div>
        );
    }

    return null;
}
