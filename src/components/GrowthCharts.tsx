import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { GrowthRecord } from '../types';

interface GrowthChartsProps {
    records: GrowthRecord[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 border border-border-light rounded shadow-lg text-xs">
                <p className="font-bold mb-1">{new Date(label).toLocaleDateString()}</p>
                {payload.map((entry: any) => (
                    <p key={entry.name} style={{ color: entry.color }}>
                        {entry.name}: {entry.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const GrowthCharts: React.FC<GrowthChartsProps> = ({ records }) => {
    // Sort by date
    const sortedData = [...records].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(r => ({
        ...r,
        formattedDate: new Date(r.date).toLocaleDateString()
    }));

    if (sortedData.length === 0) {
        return (
            <div className="p-8 text-center text-text-muted bg-background-light rounded-lg">
                Nenhum dado de crescimento registrado.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Weight Chart */}
            <div className="bg-white p-4 rounded-xl border border-border-light shadow-sm">
                <h4 className="font-bold text-text-main mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">monitor_weight</span>
                    Peso (kg)
                </h4>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={sortedData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="date" tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { month: 'short', year: '2-digit' })} tick={{ fontSize: 10 }} stroke="#9CA3AF" />
                            <YAxis tick={{ fontSize: 10 }} stroke="#9CA3AF" />
                            <Tooltip content={<CustomTooltip />} />
                            <Line type="monotone" dataKey="weight" name="Peso" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 4, fill: "#0ea5e9" }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Height Chart */}
            <div className="bg-white p-4 rounded-xl border border-border-light shadow-sm">
                <h4 className="font-bold text-text-main mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">height</span>
                    Altura (cm)
                </h4>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={sortedData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="date" tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { month: 'short', year: '2-digit' })} tick={{ fontSize: 10 }} stroke="#9CA3AF" />
                            <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10 }} stroke="#9CA3AF" />
                            <Tooltip content={<CustomTooltip />} />
                            <Line type="monotone" dataKey="height" name="Altura" stroke="#10b981" strokeWidth={2} dot={{ r: 4, fill: "#10b981" }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Head Circumference Chart */}
            <div className="bg-white p-4 rounded-xl border border-border-light shadow-sm">
                <h4 className="font-bold text-text-main mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">face</span>
                    Perímetro Craniano (cm)
                </h4>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={sortedData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="date" tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { month: 'short', year: '2-digit' })} tick={{ fontSize: 10 }} stroke="#9CA3AF" />
                            <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10 }} stroke="#9CA3AF" />
                            <Tooltip content={<CustomTooltip />} />
                            <Line type="monotone" dataKey="head_circumference" name="P. Cefálico" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4, fill: "#8b5cf6" }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default GrowthCharts;
