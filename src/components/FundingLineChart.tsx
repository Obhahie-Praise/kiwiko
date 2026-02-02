"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const fundingData = [
  { month: "Jan", raised: 2000 },
  { month: "Feb", raised: 8000 },
  { month: "Mar", raised: 12000 },
  { month: "Apr", raised: 20000 },
  { month: "May", raised: 35000 },
  { month: "Jun", raised: 50000 },
];

export const FundingLineChart = () => (
  <div className="border rounded-2xl p-5 bg-white">
    <h3 className="font-semibold mb-4">Funding Momentum</h3>

    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={fundingData}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />

        <Line
          type="monotone"
          dataKey="raised"
          stroke="#000"
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);