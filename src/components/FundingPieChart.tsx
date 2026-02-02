"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Angels", value: 40 },
  { name: "VCs", value: 25 },
  { name: "Public", value: 20 },
  { name: "Friends", value: 15 },
];

const COLORS = ["#111", "#333", "#555", "#777"];

export const InvestorPieChart = () => (
  <div className="border rounded-2xl p-5 bg-white">
    <h3 className="font-semibold mb-4">Investor Composition</h3>

    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          outerRadius={90}
          label
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i]} />
          ))}
        </Pie>

        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
);
