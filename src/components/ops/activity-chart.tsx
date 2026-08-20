"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface ActivityChartProps {
  data: { date: string; count: number }[];
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00Z");
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export default function ActivityChart({ data }: ActivityChartProps) {
  if (!data.length) {
    return (
      <p className="text-sm text-text-secondary py-8 text-center">No conversation data yet.</p>
    );
  }

  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart data={data} margin={{ top: 4, right: 0, left: -28, bottom: 0 }}>
        <XAxis
          dataKey="date"
          tickFormatter={(v) => {
            const d = new Date(v + "T12:00:00Z");
            return d.toLocaleDateString("en-US", { weekday: "short" });
          }}
          tick={{ fontSize: 11, fill: "#8a8a96" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#8a8a96" }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          cursor={{ fill: "rgba(56,189,248,0.06)" }}
          contentStyle={{
            background: "#141416",
            border: "1px solid #242428",
            borderRadius: "8px",
            fontSize: "12px",
            color: "#f0f0f2",
          }}
          labelFormatter={(v) => formatDate(v as string)}
          formatter={(v) => [Number(v ?? 0), "conversations"]}
        />
        {data.map((entry) => (
          <Cell
            key={entry.date}
            fill={entry.count === max ? "#38bdf8" : "#1e3a4a"}
          />
        ))}
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {data.map((entry) => (
            <Cell
              key={entry.date}
              fill={entry.count === max ? "#38bdf8" : "#1e3a4a"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
