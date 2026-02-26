import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function LicenseForm({ data, onChange }) {
  const update = (field, value) => onChange({ ...data, [field]: value });

  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Habilitação & Curso</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
          <div>
            <p className="text-sm font-medium text-slate-700">Possui CNH válida?</p>
            <p className="text-xs text-slate-400 mt-0.5">Carteira Nacional de Habilitação</p>
          </div>
          <Switch 
            checked={data.has_cnh || false}
            onCheckedChange={(v) => update("has_cnh", v)}
          />
        </div>

        {data.has_cnh && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 border-l-2 border-blue-200">
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Categoria da CNH</Label>
              <Input 
                value={data.cnh_category || ""} 
                onChange={(e) => update("cnh_category", e.target.value)} 
                placeholder="Ex: A, AB"
                className="border-slate-200 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Validade da CNH</Label>
              <Input 
                type="date"
                value={data.cnh_expiry || ""} 
                onChange={(e) => update("cnh_expiry", e.target.value)} 
                className="border-slate-200 rounded-xl"
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
          <div>
            <p className="text-sm font-medium text-slate-700">Possui curso do CONTRAN?</p>
            <p className="text-xs text-slate-400 mt-0.5">Conselho Nacional de Trânsito</p>
          </div>
          <Switch 
            checked={data.has_contran_course || false}
            onCheckedChange={(v) => update("has_contran_course", v)}
          />
        </div>

        {data.has_contran_course && (
          <div className="pl-4 border-l-2 border-emerald-200">
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Data de conclusão do curso</Label>
              <Input 
                type="date"
                value={data.contran_course_date || ""} 
                onChange={(e) => update("contran_course_date", e.target.value)} 
                className="border-slate-200 rounded-xl max-w-xs"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}