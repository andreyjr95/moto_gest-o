import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Phone, MapPin, Bike, ShieldCheck, ShieldAlert, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const statusMap = {
  active: { label: "Ativo", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  inactive: { label: "Inativo", className: "bg-red-50 text-red-700 border-red-200" },
  pending: { label: "Pendente", className: "bg-amber-50 text-amber-700 border-amber-200" }
};

export default function MototaxistaCard({ mototaxista }) {
  const status = statusMap[mototaxista.status] || statusMap.pending;

  return (
    <Link to={createPageUrl("MototaxistaDetail") + `?id=${mototaxista.id}`}>
      <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group overflow-hidden">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              {mototaxista.photo_url ? (
                <img src={mototaxista.photo_url} alt="" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <User className="w-5 h-5 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold text-slate-800 text-sm truncate">{mototaxista.full_name}</h3>
                <Badge variant="outline" className={`text-[10px] px-2 py-0 shrink-0 ${status.className}`}>
                  {status.label}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">CPF: {mototaxista.cpf}</p>
              
              <div className="flex items-center gap-3 mt-2.5">
                {mototaxista.phone && (
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Phone className="w-3 h-3" /> {mototaxista.phone}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                {mototaxista.association_name && (
                  <Badge variant="secondary" className="text-[10px] bg-slate-100 text-slate-600">
                    {mototaxista.association_name}
                  </Badge>
                )}
                {mototaxista.vehicle_plate && (
                  <Badge variant="secondary" className="text-[10px] bg-slate-100 text-slate-600 font-mono">
                    <Bike className="w-2.5 h-2.5 mr-1" /> {mototaxista.vehicle_plate}
                  </Badge>
                )}
                <div className="flex items-center gap-1 ml-auto">
                  {mototaxista.has_cnh ? (
                    <ShieldCheck className="w-4 h-4 text-blue-500" title="CNH válida" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 text-red-400" title="Sem CNH" />
                  )}
                  {mototaxista.has_contran_course && (
                    <GraduationCap className="w-4 h-4 text-emerald-500" title="Curso CONTRAN" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}