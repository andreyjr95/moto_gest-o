import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PersonalDataForm({ data, onChange, associations = [] }) {
  const update = (field, value) => onChange({ ...data, [field]: value });

  const handleAssociationChange = (assocId) => {
    const assoc = associations.find(a => a.id === assocId);
    onChange({ ...data, association_id: assocId, association_name: assoc?.name || "" });
  };

  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Dados Pessoais</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 space-y-1.5">
          <Label className="text-xs text-slate-500">Nome Completo *</Label>
          <Input 
            value={data.full_name || ""} 
            onChange={(e) => update("full_name", e.target.value)} 
            placeholder="Nome completo do mototaxista"
            className="border-slate-200 rounded-xl"
          />
        </div>
        
        <div className="space-y-1.5">
          <Label className="text-xs text-slate-500">CPF *</Label>
          <Input 
            value={data.cpf || ""} 
            onChange={(e) => update("cpf", e.target.value)} 
            placeholder="000.000.000-00"
            className="border-slate-200 rounded-xl"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-slate-500">RG</Label>
          <Input 
            value={data.rg || ""} 
            onChange={(e) => update("rg", e.target.value)} 
            placeholder="Número do RG"
            className="border-slate-200 rounded-xl"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-slate-500">Telefone</Label>
          <Input 
            value={data.phone || ""} 
            onChange={(e) => update("phone", e.target.value)} 
            placeholder="(00) 00000-0000"
            className="border-slate-200 rounded-xl"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-slate-500">Associação *</Label>
          <Select value={data.association_id || ""} onValueChange={handleAssociationChange}>
            <SelectTrigger className="border-slate-200 rounded-xl">
              <SelectValue placeholder="Selecione a associação" />
            </SelectTrigger>
            <SelectContent>
              {associations.map(a => (
                <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2 space-y-1.5">
          <Label className="text-xs text-slate-500">Endereço</Label>
          <Input 
            value={data.address || ""} 
            onChange={(e) => update("address", e.target.value)} 
            placeholder="Endereço completo"
            className="border-slate-200 rounded-xl"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-slate-500">Status</Label>
          <Select value={data.status || "active"} onValueChange={(v) => update("status", v)}>
            <SelectTrigger className="border-slate-200 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="inactive">Inativo</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-slate-500">Observações</Label>
        <Textarea 
          value={data.notes || ""} 
          onChange={(e) => update("notes", e.target.value)} 
          placeholder="Observações adicionais..."
          className="border-slate-200 rounded-xl h-20 resize-none"
        />
      </div>
    </div>
  );
}