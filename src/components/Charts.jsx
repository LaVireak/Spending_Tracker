import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CFF', '#FF6699', '#33CC99', '#FF6666'];

// Example props:
// dataLine = [{ date: '2025-07-01', amount: 50 }, ...]
// dataPie = [{ name: 'Food', value: 200 }, ...]

export function SpendingLineChart({ data, categories }) {
  // categories: array of category names for multi-line support
  const COLORS_LINE = ['#8884d8','#82ca9d','#ffc658','#ff7300','#00c49f','#0088fe','#ff0000','#a832a6'];
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke="#fff" />
        <YAxis stroke="#fff" />
        <Tooltip contentStyle={{ background: "#222", color: "#fff" }} />
        <Legend wrapperStyle={{ color: "#fff" }} />
        {categories && categories.map((cat, i) => (
          <Line key={cat} type="monotone" dataKey={cat} stroke={COLORS_LINE[i % COLORS_LINE.length]} strokeWidth={2} dot={false} isAnimationActive={true} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function SpendingPieChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
