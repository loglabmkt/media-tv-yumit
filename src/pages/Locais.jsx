import React, { useState, useEffect } from "react";
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Plus } from "lucide-react";
import { createPageUrl } from "@/utils";

import LocalForm from "../components/locais/LocalForm";
import LocalCard from "../components/locais/LocalCard";

export default function Locais() {
  const [locais, setLocais] = useState([]);
  const [slides, setSlides] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingLocal, setEditingLocal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const locaisData = await base44.entities.Local.list("-created_date");
      setLocais(locaisData);
      
      try {
        const slidesData = await base44.entities.Slide.list();
        setSlides(slidesData);
      } catch (slideError) {
        console.error("Erro ao carregar slides:", slideError);
        setSlides([]);
      }
    } catch (error) {
      console.error("Erro ao carregar locais:", error);
      setLocais([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (localData) => {
    try {
      if (editingLocal) {
        await base44.entities.Local.update(editingLocal.id, localData);
      } else {
        await base44.entities.Local.create(localData);
      }
      setShowForm(false);
      setEditingLocal(null);
      loadData();
    } catch (error) {
      console.error("Erro ao salvar local:", error);
      alert("Erro ao salvar local. Tente novamente.");
    }
  };

  const handleEdit = (local) => {
    setEditingLocal(local);
    setShowForm(true);
  };

  const handleDelete = async (localId) => {
    if (confirm("Tem certeza que deseja excluir este local?")) {
      try {
        await base44.entities.Local.delete(localId);
        loadData();
      } catch (error) {
        console.error("Erro ao excluir local:", error);
        alert("Erro ao excluir local. Tente novamente.");
      }
    }
  };

  const getPlayerUrl = (codigo) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}${createPageUrl(`Player?local=${codigo}`)}`;
  };

  return (
    <div className="p-6 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Gerenciar Locais</h1>
            <p className="text-slate-600">Cadastre e configure os ambientes para exibição</p>
          </div>
          <Button 
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Local
          </Button>
        </div>

        {showForm && (
          <div className="mb-8">
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {editingLocal ? 'Editar Local' : 'Novo Local'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LocalForm
                  local={editingLocal}
                  onSubmit={handleSubmit}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingLocal(null);
                  }}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-200 rounded"></div>
                    <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : locais.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locais.map((local) => {
              const slidesDoLocal = slides.filter(slide => slide.local_id === local.id && slide.ativo);
              return (
                <LocalCard
                  key={local.id}
                  local={local}
                  slidesCount={slidesDoLocal.length}
                  playerUrl={getPlayerUrl(local.codigo)}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <MapPin className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-800 mb-2">Nenhum local cadastrado</h3>
            <p className="text-slate-500 mb-6">Comece criando seu primeiro local para exibição</p>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Local
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}