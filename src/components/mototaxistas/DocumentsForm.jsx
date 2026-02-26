import React from "react";
import DocumentUpload from "../shared/DocumentUpload";

export default function DocumentsForm({ data, onChange }) {
  const update = (field, value) => onChange({ ...data, [field]: value });

  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Documentos</h3>
      <p className="text-xs text-slate-400">Envie fotos de frente e verso de cada documento</p>

      <div className="space-y-6">
        <div>
          <p className="text-xs font-medium text-slate-600 mb-3">Foto do Mototaxista</p>
          <div className="max-w-xs">
            <DocumentUpload
              label="Foto pessoal"
              value={data.photo_url || ""}
              onChange={(v) => update("photo_url", v)}
            />
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-slate-600 mb-3">RG - Registro Geral</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DocumentUpload label="Frente" value={data.rg_front_url || ""} onChange={(v) => update("rg_front_url", v)} />
            <DocumentUpload label="Verso" value={data.rg_back_url || ""} onChange={(v) => update("rg_back_url", v)} />
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-slate-600 mb-3">CPF</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DocumentUpload label="Frente" value={data.cpf_front_url || ""} onChange={(v) => update("cpf_front_url", v)} />
            <DocumentUpload label="Verso" value={data.cpf_back_url || ""} onChange={(v) => update("cpf_back_url", v)} />
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-slate-600 mb-3">CNH - Carteira Nacional de Habilitação</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DocumentUpload label="Frente" value={data.cnh_front_url || ""} onChange={(v) => update("cnh_front_url", v)} />
            <DocumentUpload label="Verso" value={data.cnh_back_url || ""} onChange={(v) => update("cnh_back_url", v)} />
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-slate-600 mb-3">Comprovante de Residência</p>
          <div className="max-w-xs">
            <DocumentUpload label="Comprovante" value={data.proof_of_residence_url || ""} onChange={(v) => update("proof_of_residence_url", v)} />
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-slate-600 mb-3">Documentação do Veículo (CRLV)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DocumentUpload label="Frente" value={data.vehicle_doc_front_url || ""} onChange={(v) => update("vehicle_doc_front_url", v)} />
            <DocumentUpload label="Verso" value={data.vehicle_doc_back_url || ""} onChange={(v) => update("vehicle_doc_back_url", v)} />
          </div>
        </div>
      </div>
    </div>
  );
}