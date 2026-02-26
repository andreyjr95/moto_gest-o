const db = globalThis.__B44_DB__ || {
  auth: { isAuthenticated: async () => false, me: async () => null },
  entities: new Proxy({}, { get: () => ({ filter: async () => [], get: async () => null, create: async () => ({}), update: async () => ({}), delete: async () => ({}) }) }),
  integrations: { Core: { UploadFile: async () => ({ file_url: '' }) } }
};

import React, { useState, useEffect } from "react";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, Pencil, Trash2, User, Phone, MapPin, ShieldCheck, ShieldAlert, 
  GraduationCap, Bike, Calendar, FileText 
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const statusMap = {
  active: { label: "Ativo", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  inactive: { label: "Inativo", className: "bg-red-50 text-red-700 border-red-200" },
  pending: { label: "Pendente", className: "bg-amber-50 text-amber-700 border-amber-200" }
};

function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm font-medium text-slate-700">{value}</p>
      </div>
    </div>
  );
}

function DocImage({ label, url }) {
  if (!url) return null;
  return (
    <div className="space-y-1.5">
      <p className="text-xs text-slate-500">{label}</p>
      <a href={url} target="_blank" rel="noopener noreferrer">
        <img src={url} alt={label} className="w-full h-36 object-cover rounded-xl border border-slate-200 hover:opacity-90 transition-opacity cursor-pointer" />
      </a>
    </div>
  );
}

export default function MototaxistaDetail() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  const { data: results = [], isLoading } = useQuery({
    queryKey: ["mototaxista", id],
    queryFn: () => db.entities.Mototaxista.filter({ id }),
    enabled: !!id,
  });

  const moto = results[0];

  const deleteMutation = useMutation({
    mutationFn: () => db.entities.Mototaxista.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mototaxistas"] });
      toast.success("Mototaxista excluído");
      navigate(createPageUrl("Mototaxistas"));
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-3xl mx-auto">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (!moto) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-400">Mototaxista não encontrado.</p>
        <Link to={createPageUrl("Mototaxistas")}>
          <Button variant="link" className="mt-2">Voltar</Button>
        </Link>
      </div>
    );
  }

  const status = statusMap[moto.status] || statusMap.pending;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={createPageUrl("Mototaxistas")}>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{moto.full_name}</h1>
            <Badge variant="outline" className={`mt-1 ${status.className}`}>{status.label}</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to={createPageUrl("MototaxistaForm") + `?id=${moto.id}`}>
            <Button variant="outline" className="rounded-xl gap-2">
              <Pencil className="w-3.5 h-3.5" /> Editar
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50">
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir mototaxista?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Todos os dados de {moto.full_name} serão removidos.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteMutation.mutate()} className="bg-red-600 hover:bg-red-700">
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Personal Info */}
      <Card className="border-0 shadow-sm p-6">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Dados Pessoais</h3>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center overflow-hidden">
            {moto.photo_url ? (
              <img src={moto.photo_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <User className="w-7 h-7 text-white" />
            )}
          </div>
          <div>
            <p className="font-bold text-lg text-slate-800">{moto.full_name}</p>
            {moto.association_name && <p className="text-sm text-slate-500">{moto.association_name}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
          <InfoRow icon={FileText} label="CPF" value={moto.cpf} />
          <InfoRow icon={FileText} label="RG" value={moto.rg} />
          <InfoRow icon={Phone} label="Telefone" value={moto.phone} />
          <InfoRow icon={MapPin} label="Endereço" value={moto.address} />
        </div>
        {moto.notes && (
          <div className="mt-4 p-3 bg-slate-50 rounded-xl">
            <p className="text-xs text-slate-400 mb-1">Observações</p>
            <p className="text-sm text-slate-600">{moto.notes}</p>
          </div>
        )}
      </Card>

      {/* License & Course */}
      <Card className="border-0 shadow-sm p-6">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Habilitação & Curso</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className={`p-4 rounded-xl border ${moto.has_cnh ? "bg-blue-50 border-blue-200" : "bg-red-50 border-red-200"}`}>
            <div className="flex items-center gap-2 mb-1">
              {moto.has_cnh ? <ShieldCheck className="w-5 h-5 text-blue-600" /> : <ShieldAlert className="w-5 h-5 text-red-500" />}
              <span className="font-semibold text-sm">{moto.has_cnh ? "CNH Válida" : "Sem CNH"}</span>
            </div>
            {moto.has_cnh && (
              <div className="text-xs text-slate-500 space-y-0.5 mt-2">
                {moto.cnh_category && <p>Categoria: <strong>{moto.cnh_category}</strong></p>}
                {moto.cnh_expiry && <p>Validade: <strong>{format(new Date(moto.cnh_expiry), "dd/MM/yyyy")}</strong></p>}
              </div>
            )}
          </div>
          <div className={`p-4 rounded-xl border ${moto.has_contran_course ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200"}`}>
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap className={`w-5 h-5 ${moto.has_contran_course ? "text-emerald-600" : "text-slate-400"}`} />
              <span className="font-semibold text-sm">{moto.has_contran_course ? "Curso CONTRAN" : "Sem Curso CONTRAN"}</span>
            </div>
            {moto.has_contran_course && moto.contran_course_date && (
              <p className="text-xs text-slate-500 mt-2">Concluído em: <strong>{format(new Date(moto.contran_course_date), "dd/MM/yyyy")}</strong></p>
            )}
          </div>
        </div>
      </Card>

      {/* Vehicle */}
      <Card className="border-0 shadow-sm p-6">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Veículo</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Placa", value: moto.vehicle_plate },
            { label: "Modelo", value: moto.vehicle_model },
            { label: "Cor", value: moto.vehicle_color },
            { label: "Ano", value: moto.vehicle_year },
          ].map((item, i) => item.value && (
            <div key={i} className="p-3 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-400">{item.label}</p>
              <p className="text-sm font-semibold text-slate-700 mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Documents */}
      <Card className="border-0 shadow-sm p-6">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Documentos</h3>
        <div className="space-y-4">
          {moto.rg_front_url || moto.rg_back_url ? (
            <div>
              <p className="text-xs font-medium text-slate-600 mb-2">RG</p>
              <div className="grid grid-cols-2 gap-3">
                <DocImage label="Frente" url={moto.rg_front_url} />
                <DocImage label="Verso" url={moto.rg_back_url} />
              </div>
            </div>
          ) : null}
          {moto.cpf_front_url || moto.cpf_back_url ? (
            <div>
              <p className="text-xs font-medium text-slate-600 mb-2">CPF</p>
              <div className="grid grid-cols-2 gap-3">
                <DocImage label="Frente" url={moto.cpf_front_url} />
                <DocImage label="Verso" url={moto.cpf_back_url} />
              </div>
            </div>
          ) : null}
          {moto.cnh_front_url || moto.cnh_back_url ? (
            <div>
              <p className="text-xs font-medium text-slate-600 mb-2">CNH</p>
              <div className="grid grid-cols-2 gap-3">
                <DocImage label="Frente" url={moto.cnh_front_url} />
                <DocImage label="Verso" url={moto.cnh_back_url} />
              </div>
            </div>
          ) : null}
          {moto.proof_of_residence_url && (
            <div>
              <p className="text-xs font-medium text-slate-600 mb-2">Comprovante de Residência</p>
              <div className="max-w-xs">
                <DocImage label="Comprovante" url={moto.proof_of_residence_url} />
              </div>
            </div>
          )}
          {moto.vehicle_doc_front_url || moto.vehicle_doc_back_url ? (
            <div>
              <p className="text-xs font-medium text-slate-600 mb-2">Documento do Veículo</p>
              <div className="grid grid-cols-2 gap-3">
                <DocImage label="Frente" url={moto.vehicle_doc_front_url} />
                <DocImage label="Verso" url={moto.vehicle_doc_back_url} />
              </div>
            </div>
          ) : null}
        </div>
      </Card>
    </div>
  );
}