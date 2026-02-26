const db = globalThis.__B44_DB__ || {
  auth: { isAuthenticated: async () => false, me: async () => null },
  entities: new Proxy({}, { get: () => ({ filter: async () => [], get: async () => null, create: async () => ({}), update: async () => ({}), delete: async () => ({}) }) }),
  integrations: { Core: { UploadFile: async () => ({ file_url: '' }) } }
};

import React, { useState, useEffect } from "react";

import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import SearchFilter from "../components/shared/SearchFilter";
import MototaxistaCard from "../components/mototaxistas/MototaxistaCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function Mototaxistas() {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [associationFilter, setAssociationFilter] = useState("all");
  const [cnhFilter, setCnhFilter] = useState("all");
  const [contranFilter, setContranFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    db.auth.me().then(setUser);
  }, []);

  const { data: mototaxistas = [], isLoading: loadingM } = useQuery({
    queryKey: ["mototaxistas"],
    queryFn: () => db.entities.Mototaxista.list("-created_date"),
  });

  const { data: associations = [] } = useQuery({
    queryKey: ["associations"],
    queryFn: () => db.entities.Association.list(),
  });

  const isPresident = user?.role === "president";

  const filtered = mototaxistas.filter(m => {
    if (isPresident && user?.association_id && m.association_id !== user.association_id) return false;
    
    const search = searchTerm.toLowerCase();
    const matchSearch = !search || 
      m.full_name?.toLowerCase().includes(search) || 
      m.cpf?.includes(search) || 
      m.vehicle_plate?.toLowerCase().includes(search);

    const matchAssoc = associationFilter === "all" || m.association_id === associationFilter;
    const matchCnh = cnhFilter === "all" || (cnhFilter === "yes" ? m.has_cnh : !m.has_cnh);
    const matchContran = contranFilter === "all" || (contranFilter === "yes" ? m.has_contran_course : !m.has_contran_course);
    const matchStatus = statusFilter === "all" || m.status === statusFilter;

    return matchSearch && matchAssoc && matchCnh && matchContran && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Mototaxistas</h1>
          <p className="text-sm text-slate-400 mt-1">{filtered.length} cadastrado{filtered.length !== 1 ? "s" : ""}</p>
        </div>
        <Link to={createPageUrl("MototaxistaForm")}>
          <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl gap-2">
            <Plus className="w-4 h-4" /> Novo Cadastro
          </Button>
        </Link>
      </div>

      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        associationFilter={associationFilter}
        onAssociationChange={setAssociationFilter}
        cnhFilter={cnhFilter}
        onCnhChange={setCnhFilter}
        contranFilter={contranFilter}
        onContranChange={setContranFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        associations={isPresident ? associations.filter(a => a.id === user?.association_id) : associations}
      />

      {loadingM ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map(m => <MototaxistaCard key={m.id} mototaxista={m} />)}
        </div>
      )}

      {!loadingM && filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-slate-400 text-sm">Nenhum mototaxista encontrado.</p>
        </div>
      )}
    </div>
  );
}