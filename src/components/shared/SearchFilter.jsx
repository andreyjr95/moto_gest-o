import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

export default function SearchFilter({ 
  searchTerm, 
  onSearchChange, 
  associationFilter, 
  onAssociationChange, 
  cnhFilter, 
  onCnhChange,
  contranFilter,
  onContranChange,
  statusFilter,
  onStatusChange,
  associations = [] 
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Buscar por nome, CPF ou placa..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 border-slate-200 rounded-xl h-10 text-sm"
        />
      </div>
      
      <Select value={associationFilter} onValueChange={onAssociationChange}>
        <SelectTrigger className="w-full sm:w-44 border-slate-200 rounded-xl h-10 text-sm">
          <SelectValue placeholder="Associação" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas associações</SelectItem>
          {associations.map(a => (
            <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={cnhFilter} onValueChange={onCnhChange}>
        <SelectTrigger className="w-full sm:w-36 border-slate-200 rounded-xl h-10 text-sm">
          <SelectValue placeholder="CNH" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas CNH</SelectItem>
          <SelectItem value="yes">Com CNH</SelectItem>
          <SelectItem value="no">Sem CNH</SelectItem>
        </SelectContent>
      </Select>

      <Select value={contranFilter} onValueChange={onContranChange}>
        <SelectTrigger className="w-full sm:w-36 border-slate-200 rounded-xl h-10 text-sm">
          <SelectValue placeholder="CONTRAN" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">CONTRAN</SelectItem>
          <SelectItem value="yes">Com curso</SelectItem>
          <SelectItem value="no">Sem curso</SelectItem>
        </SelectContent>
      </Select>

      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full sm:w-32 border-slate-200 rounded-xl h-10 text-sm">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="active">Ativo</SelectItem>
          <SelectItem value="inactive">Inativo</SelectItem>
          <SelectItem value="pending">Pendente</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}