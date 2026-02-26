const db = globalThis.__B44_DB__ || {
  auth: { isAuthenticated: async () => false, me: async () => null },
  entities: new Proxy({}, { get: () => ({ filter: async () => [], get: async () => null, create: async () => ({}), update: async () => ({}), delete: async () => ({}) }) }),
  integrations: { Core: { UploadFile: async () => ({ file_url: '' }) } }
};

import React, { useRef, useState } from "react";

import { Upload, X, FileCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DocumentUpload({ label, sublabel, value, onChange }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await db.integrations.Core.UploadFile({ file });
    onChange(file_url);
    setUploading(false);
  };

  const handleRemove = () => {
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium text-slate-700">{label}</p>
      {sublabel && <p className="text-xs text-slate-400">{sublabel}</p>}
      
      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
          <img src={value} alt={label} className="w-full h-32 object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button size="sm" variant="destructive" onClick={handleRemove} className="rounded-full">
              <X className="w-4 h-4 mr-1" /> Remover
            </Button>
          </div>
          <div className="absolute top-2 right-2">
            <div className="bg-emerald-500 rounded-full p-1">
              <FileCheck className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-32 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-wait"
        >
          {uploading ? (
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
          ) : (
            <>
              <Upload className="w-6 h-6 text-slate-300" />
              <span className="text-xs text-slate-400">Clique para enviar</span>
            </>
          )}
        </button>
      )}
      
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
      />
    </div>
  );
}