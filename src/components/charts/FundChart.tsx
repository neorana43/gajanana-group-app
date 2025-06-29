"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const dummyData = [
  { name: "Main Fund", amount: 4000 },
  { name: "Secret Fund", amount: 2000 },
];

export const FundChart = () => (
  <ResponsiveContainer width="100%" height={250}>
    <BarChart data={dummyData}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="amount" />
    </BarChart>
  </ResponsiveContainer>
);
