import React from "react";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["#3b82f6", "#06b6d4", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444", "#ec4899", "#6366f1"];

export default function AssociationChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <Card className="border-0 shadow-sm p-6">
        <p className="text-sm text-slate-400 text-center py-8">Nenhuma associação cadastrada</p>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm p-6">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">Mototaxistas por Associação</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 11, fill: "#94a3b8" }} 
              angle={-30}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} allowDecimals={false} />
            <Tooltip 
              contentStyle={{ 
                borderRadius: 12, 
                border: "none", 
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                fontSize: 12
              }} 
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} name="Mototaxistas">
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}