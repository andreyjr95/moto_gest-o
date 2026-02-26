const db = globalThis.__B44_DB__ || {
  auth: { isAuthenticated: async () => false, me: async () => null },
  entities: new Proxy({}, { get: () => ({ filter: async () => [], get: async () => null, create: async () => ({}), update: async () => ({}), delete: async () => ({}) }) }),
  integrations: { Core: { UploadFile: async () => ({ file_url: '' }) } }
};

import React, { useState, useEffect } from "react";

import { useQuery } from "@tanstack/react-query";
import { Users, Building2, ShieldCheck, GraduationCap, AlertTriangle } from "lucide-react";
import StatCard from "../components/dashboard/StatCard";
import AssociationChart from "../components/dashboard/AssociationChart";
import ComplianceDonut from "../components/dashboard/ComplianceDonut";
import MototaxistaCard from "../components/mototaxistas/MototaxistaCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    db.auth.me().then(setUser);
  }, []);

  const { data: mototaxistas = [], isLoading: loadingM } = useQuery({
    queryKey: ["mototaxistas"],
    queryFn: () => db.entities.Mototaxista.list("-created_date"),
  });

  const { data: associations = [], isLoading: loadingA } = useQuery({
    queryKey: ["associations"],
    queryFn: () => db.entities.Association.list(),
  });

  // Filter by association if user is president
  const isPresident = user?.role === "president";
  const filteredMotos = isPresident && user?.association_id
    ? mototaxistas.filter(m => m.association_id === user.association_id)
    : mototaxistas;

  const total = filteredMotos.length;
  const withCnh = filteredMotos.filter(m => m.has_cnh).length;
  const withContran = filteredMotos.filter(m => m.has_contran_course).length;
  const activeCount = filteredMotos.filter(m => m.status === "active").length;
  const pendingCount = filteredMotos.filter(m => m.status === "pending").length;

  const chartData = associations.map(a => ({
    name: a.name,
    count: filteredMotos.filter(m => m.association_id === a.id).length
  })).filter(d => d.count > 0);

  const recentMotos = [...filteredMotos].slice(0, 6);

  const isLoading = loadingM || loadingA;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Painel de Controle</h1>
        <p className="text-sm text-slate-400 mt-1">
          {isPresident ? "Visão geral da sua associação" : "Visão geral de todos os mototaxistas da cidade"}
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total" value={total} icon={Users} color="text-blue-600" bgColor="bg-blue-50" subtitle={`${activeCount} ativos`} />
            <StatCard title="Associações" value={isPresident ? 1 : associations.length} icon={Building2} color="text-purple-600" bgColor="bg-purple-50" />
            <StatCard title="Com CNH" value={withCnh} icon={ShieldCheck} color="text-emerald-600" bgColor="bg-emerald-50" subtitle={total > 0 ? `${Math.round((withCnh/total)*100)}% do total` : ""} />
            <StatCard title="Curso CONTRAN" value={withContran} icon={GraduationCap} color="text-amber-600" bgColor="bg-amber-50" subtitle={total > 0 ? `${Math.round((withContran/total)*100)}% do total` : ""} />
          </div>

          {pendingCount > 0 && (
            <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              <p className="text-sm text-amber-700">
                <strong>{pendingCount}</strong> mototaxista{pendingCount > 1 ? "s" : ""} com cadastro pendente
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {!isPresident && <AssociationChart data={chartData} />}
            <ComplianceDonut cnhCount={withCnh} contranCount={withContran} total={total} />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-700 mb-3">Últimos cadastrados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {recentMotos.map(m => <MototaxistaCard key={m.id} mototaxista={m} />)}
            </div>
            {recentMotos.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-8">Nenhum mototaxista cadastrado ainda.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}