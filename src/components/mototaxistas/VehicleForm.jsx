import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function VehicleForm({ data, onChange }) {
  const update = (field, value) => onChange({ ...data, [field]: value });

  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Dados do Veículo</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs text-slate-500">Placa</Label>
          <Input 
            value={data.vehicle_plate || ""} 
            onChange={(e) => update("vehicle_plate", e.target.value.toUpperCase())} 
            placeholder="ABC-1234"
            className="border-slate-200 rounded-xl font-mono uppercase"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-slate-500">Modelo</Label>
          <Input 
            value={data.vehicle_model || ""} 
            onChange={(e) => update("vehicle_model", e.target.value)} 
            placeholder="Ex: Honda CG 160"
            className="border-slate-200 rounded-xl"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-slate-500">Cor</Label>
          <Input 
            value={data.vehicle_color || ""} 
            onChange={(e) => update("vehicle_color", e.target.value)} 
            placeholder="Ex: Preta"
            className="border-slate-200 rounded-xl"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-slate-500">Ano</Label>
          <Input 
            value={data.vehicle_year || ""} 
            onChange={(e) => update("vehicle_year", e.target.value)} 
            placeholder="Ex: 2023"
            className="border-slate-200 rounded-xl"
          />
        </div>
      </div>
    </div>
  );
}