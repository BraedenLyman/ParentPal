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

    const feedingChartData = feedingRecords
        .sort((a, b) => new Date(a.date) - new Date(b.date) || a.time_fed.localeCompare(b.time_fed))
        .map((record, index) => ({
            id: record.feeding_id || index,
            label: new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            foodType: record.type_of_food,
            amount: parseFloat(record.amount) || 0,
            fedFrom: record.fed_from,
        }));

    const feedingChart = useChart({
        data: feedingChartData,
    });

    if (loading) {
        return <h2>Loading reports...</h2>;
    }

    if (selectedChart === "growth") {
        return (
            <>
                <div className="chartSection">
                    <h2 className="chartTitle">Height Over Time</h2>
                    {growthChartData.length === 0 ? (
                        <p className="noDataMessage">No growth records available</p>
                    ) : (
                        <div className="chartContainer">
                            <Chart.Root chart={growthChart}>
                                <ResponsiveContainer width="100%" height={220}>
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
                                            label={{ value: 'Height (in)', angle: -90 }}
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
                                            name="Height (in)"
                                            dot={{ fill: growthChart.color("primary"), r: 5, strokeWidth: 2, stroke: '#fff' }}
                                            activeDot={{ r: 7, strokeWidth: 2 }}
                                            connectNulls={true}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Chart.Root>
                        </div>
                    )}
                </div>

                <div className="chartSection">
                    <h2 className="chartTitle">Weight Over Time</h2>
                    {growthChartData.length === 0 ? (
                        <p className="noDataMessage">No growth records available</p>
                    ) : (
                        <div className="chartContainer">
                            <Chart.Root chart={growthChart}>
                                <ResponsiveContainer width="100%" height={220}>
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
                                            label={{ value: 'Weight (lbs)', angle: -90 }}
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
                                            dataKey="weight"
                                            stroke={growthChart.color("secondary")}
                                            strokeWidth={3}
                                            name="Weight (lbs)"
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
            </>
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
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={sleepChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#666"
                                        style={{ fontSize: '12px' }}
                                        angle={-30}
                                        textAnchor="end"
                                        height={60}
                                    />
                                    <YAxis
                                        stroke="#666"
                                        style={{ fontSize: '12px' }}
                                        label={{ value: 'Hours', angle: -90}}
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
                                    
                                    <Bar
                                        dataKey="hours"
                                        fill={sleepChart.color("primary")}
                                        name="Sleep Hours"
                                        radius={[5, 5, 0, 0]}
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
        const CustomTooltip = ({ active, payload }) => {
            if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                    <div style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.98)',
                        border: '1px solid rgba(102, 126, 234, 0.3)',
                        borderRadius: '12px',
                        padding: '12px',
                        boxShadow: '0 8px 20px rgba(102, 126, 234, 0.2)'
                    }}>
                        <p style={{ fontWeight: 'bold', color: '#667eea', marginBottom: '5px' }}>
                            {data.label}
                        </p>
                        <p style={{ margin: '4px 0', color: '#333' }}>
                            <strong>Food Type:</strong> {data.foodType}
                        </p>
                        <p style={{ margin: '4px 0', color: '#333' }}>
                            <strong>Amount:</strong> {data.amount} fl oz
                        </p>
                        <p style={{ margin: '4px 0', color: '#333', fontSize: '12px' }}>
                            <strong>Fed from:</strong> {data.fedFrom}
                        </p>
                    </div>
                );
            }
            return null;
        };

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
                                        dataKey="label"
                                        stroke="#666"
                                        style={{ fontSize: '11px' }}
                                        angle={-30}
                                        textAnchor="end"
                                        height={60}
                                    />
                                    <YAxis
                                        stroke="#666"
                                        style={{ fontSize: '12px' }}
                                        label={{ value: 'Amount (fl oz)', angle: -90}}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                
                                    <Bar
                                        dataKey="amount"
                                        fill={feedingChart.color("primary")}
                                        name="Amount (fl oz)"
                                        radius={[5, 5, 0, 0]}
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

    return null;
}
