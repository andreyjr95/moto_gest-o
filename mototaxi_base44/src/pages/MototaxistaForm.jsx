const db = globalThis.__B44_DB__ || {
  auth: { isAuthenticated: async () => false, me: async () => null },
  entities: new Proxy({}, { get: () => ({ filter: async () => [], get: async () => null, create: async () => ({}), update: async () => ({}), delete: async () => ({}) }) }),
  integrations: { Core: { UploadFile: async () => ({ file_url: '' }) } }
};

import React, { useState, useEffect } from "react";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PersonalDataForm from "../components/mototaxistas/PersonalDataForm";
import LicenseForm from "../components/mototaxistas/LicenseForm";
import VehicleForm from "../components/mototaxistas/VehicleForm";
import DocumentsForm from "../components/mototaxistas/DocumentsForm";
import { toast } from "sonner";

export default function MototaxistaForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get("id");

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    status: "active",
    has_cnh: false,
    has_contran_course: false,
  });
  const [activeTab, setActiveTab] = useState("personal");

  useEffect(() => {
    db.auth.me().then(setUser);
  }, []);

  const { data: associations = [] } = useQuery({
    queryKey: ["associations"],
    queryFn: () => db.entities.Association.list(),
  });

  // Load existing data if editing
  useEffect(() => {
    if (editId) {
      db.entities.Mototaxista.filter({ id: editId }).then(results => {
        if (results.length > 0) setFormData(results[0]);
      });
    }
  }, [editId]);

  // Auto-set association for presidents
  useEffect(() => {
    if (user?.role === "president" && user?.association_id && !editId) {
      const assoc = associations.find(a => a.id === user.association_id);
      if (assoc) {
        setFormData(prev => ({
          ...prev,
          association_id: user.association_id,
          association_name: assoc.name
        }));
      }
    }
  }, [user, associations, editId]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (editId) {
        return db.entities.Mototaxista.update(editId, data);
      }
      return db.entities.Mototaxista.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mototaxistas"] });
      toast.success(editId ? "Mototaxista atualizado!" : "Mototaxista cadastrado!");
      navigate(createPageUrl("Mototaxistas"));
    },
  });

  const handleSave = () => {
    if (!formData.full_name || !formData.cpf || !formData.association_id) {
      toast.error("Preencha o nome, CPF e associação");
      return;
    }
    saveMutation.mutate(formData);
  };

  const availableAssociations = user?.role === "president" && user?.association_id
    ? associations.filter(a => a.id === user.association_id)
    : associations;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to={createPageUrl("Mototaxistas")}>
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {editId ? "Editar Mototaxista" : "Novo Cadastro"}
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">Preencha os dados abaixo</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 bg-slate-100 rounded-xl p-1">
          <TabsTrigger value="personal" className="rounded-lg text-xs">Pessoal</TabsTrigger>
          <TabsTrigger value="license" className="rounded-lg text-xs">Habilitação</TabsTrigger>
          <TabsTrigger value="vehicle" className="rounded-lg text-xs">Veículo</TabsTrigger>
          <TabsTrigger value="documents" className="rounded-lg text-xs">Documentos</TabsTrigger>
        </TabsList>

        <div className="mt-6 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <TabsContent value="personal" className="mt-0">
            <PersonalDataForm data={formData} onChange={setFormData} associations={availableAssociations} />
          </TabsContent>
          <TabsContent value="license" className="mt-0">
            <LicenseForm data={formData} onChange={setFormData} />
          </TabsContent>
          <TabsContent value="vehicle" className="mt-0">
            <VehicleForm data={formData} onChange={setFormData} />
          </TabsContent>
          <TabsContent value="documents" className="mt-0">
            <DocumentsForm data={formData} onChange={setFormData} />
          </TabsContent>
        </div>
      </Tabs>

      <div className="flex justify-end gap-3 pb-8">
        <Link to={createPageUrl("Mototaxistas")}>
          <Button variant="outline" className="rounded-xl">Cancelar</Button>
        </Link>
        <Button 
          onClick={handleSave} 
          disabled={saveMutation.isPending}
          className="bg-blue-600 hover:bg-blue-700 rounded-xl gap-2"
        >
          {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {editId ? "Atualizar" : "Cadastrar"}
        </Button>
      </div>
    </div>
  );
}