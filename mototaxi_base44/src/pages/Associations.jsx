const db = globalThis.__B44_DB__ || {
  auth: { isAuthenticated: async () => false, me: async () => null },
  entities: new Proxy({}, { get: () => ({ filter: async () => [], get: async () => null, create: async () => ({}), update: async () => ({}), delete: async () => ({}) }) }),
  integrations: { Core: { UploadFile: async () => ({ file_url: '' }) } }
};

import React, { useState, useEffect } from "react";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Building2, Users, Pencil, Trash2, X, Save, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function Associations() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAssoc, setEditingAssoc] = useState(null);
  const [form, setForm] = useState({ name: "", president_name: "", president_email: "", phone: "", address: "" });

  useEffect(() => {
    db.auth.me().then(setUser);
  }, []);

  const { data: associations = [], isLoading } = useQuery({
    queryKey: ["associations"],
    queryFn: () => db.entities.Association.list(),
  });

  const { data: mototaxistas = [] } = useQuery({
    queryKey: ["mototaxistas"],
    queryFn: () => db.entities.Mototaxista.list(),
  });

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (editingAssoc) {
        return db.entities.Association.update(editingAssoc.id, data);
      }
      return db.entities.Association.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["associations"] });
      toast.success(editingAssoc ? "Associação atualizada!" : "Associação criada!");
      setDialogOpen(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => db.entities.Association.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["associations"] });
      toast.success("Associação excluída!");
    },
  });

  const resetForm = () => {
    setForm({ name: "", president_name: "", president_email: "", phone: "", address: "" });
    setEditingAssoc(null);
  };

  const openEdit = (assoc) => {
    setEditingAssoc(assoc);
    setForm({
      name: assoc.name || "",
      president_name: assoc.president_name || "",
      president_email: assoc.president_email || "",
      phone: assoc.phone || "",
      address: assoc.address || ""
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.president_name || !form.president_email) {
      toast.error("Preencha nome, presidente e email");
      return;
    }
    saveMutation.mutate(form);
  };

  const isAdmin = user?.role === "admin";

  const getAssocCount = (assocId) => mototaxistas.filter(m => m.association_id === assocId).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Associações</h1>
          <p className="text-sm text-slate-400 mt-1">{associations.length} associaç{associations.length !== 1 ? "ões" : "ão"} cadastrada{associations.length !== 1 ? "s" : ""}</p>
        </div>
        {isAdmin && (
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl gap-2">
                <Plus className="w-4 h-4" /> Nova Associação
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingAssoc ? "Editar Associação" : "Nova Associação"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500">Nome da Associação *</Label>
                  <Input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500">Nome do Presidente *</Label>
                  <Input value={form.president_name} onChange={(e) => setForm({...form, president_name: e.target.value})} className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500">Email do Presidente *</Label>
                  <Input type="email" value={form.president_email} onChange={(e) => setForm({...form, president_email: e.target.value})} className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500">Telefone</Label>
                  <Input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500">Endereço</Label>
                  <Input value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} className="rounded-xl" />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }} className="rounded-xl">Cancelar</Button>
                  <Button onClick={handleSave} disabled={saveMutation.isPending} className="bg-blue-600 hover:bg-blue-700 rounded-xl gap-2">
                    {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Salvar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3].map(i => <Skeleton key={i} className="h-40 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {associations.map(assoc => (
            <Card key={assoc.id} className="border-0 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">{assoc.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Pres: {assoc.president_name}</p>
                  </div>
                </div>
                {isAdmin && (
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(assoc)}>
                      <Pencil className="w-3.5 h-3.5 text-slate-400" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir associação?</AlertDialogTitle>
                          <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteMutation.mutate(assoc.id)} className="bg-red-600 hover:bg-red-700">Excluir</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">{getAssocCount(assoc.id)}</span> mototaxistas
                </div>
                {assoc.phone && <span className="text-xs text-slate-400">{assoc.phone}</span>}
              </div>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && associations.length === 0 && (
        <div className="text-center py-16">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Nenhuma associação cadastrada.</p>
        </div>
      )}
    </div>
  );
}