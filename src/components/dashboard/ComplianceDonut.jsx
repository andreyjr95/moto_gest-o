import React from "react";
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function ComplianceDonut({ cnhCount, contranCount, total }) {
  const noCnh = total - cnhCount;
  const noContran = total - contranCount;

  const cnhData = [
    { name: "Com CNH", value: cnhCount },
    { name: "Sem CNH", value: noCnh }
  ];

  const contranData = [
    { name: "Com CONTRAN", value: contranCount },
    { name: "Sem CONTRAN", value: noContran }
  ];

  const COLORS_CNH = ["#3b82f6", "#e2e8f0"];
  const COLORS_CONTRAN = ["#10b981", "#e2e8f0"];

  if (total === 0) {
    return (
      <Card className="border-0 shadow-sm p-6">
        <p className="text-sm text-slate-400 text-center py-8">Nenhum dado disponível</p>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm p-6">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">Conformidade</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={cnhData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={3} dataKey="value">
                  {cnhData.map((_, i) => <Cell key={i} fill={COLORS_CNH[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-500 mt-1">CNH Válida</p>
          <p className="text-lg font-bold text-blue-600">{total > 0 ? Math.round((cnhCount / total) * 100) : 0}%</p>
        </div>
        <div className="text-center">
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={contranData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={3} dataKey="value">
                  {contranData.map((_, i) => <Cell key={i} fill={COLORS_CONTRAN[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-500 mt-1">Curso CONTRAN</p>
          <p className="text-lg font-bold text-emerald-600">{total > 0 ? Math.round((contranCount / total) * 100) : 0}%</p>
        </div>
      </div>
    </Card>
  );
}