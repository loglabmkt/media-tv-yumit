import React, { useState, useEffect } from "react";
import { Slide } from "@/entities/Slide";
import { Local } from "@/entities/Local";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, Plus, Video, Youtube } from "lucide-react";

import SlideForm from "../components/slides/SlideForm";
import SlideGrid from "../components/slides/SlideGrid";

export default function Slides() {
  const [slides, setSlides] = useState([]);
  const [locais, setLocais] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [activeTab, setActiveTab] = useState("todos");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Carregar locais
      const locaisData = await Local.list();
      setLocais(locaisData);
      
      // Tentar carregar slides, mas não falhar se der erro
      try {
        const slidesData = await Slide.list("-created_date");
        setSlides(slidesData);
      } catch (slideError) {
        console.error("Erro ao carregar slides:", slideError);
        setSlides([]);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setLocais([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (slideData) => {
    try {
      if (editingSlide) {
        await Slide.update(editingSlide.id, slideData);
      } else {
        await Slide.create(slideData);
      }
      setShowForm(false);
      setEditingSlide(null);
      loadData();
    } catch (error) {
      console.error("Erro ao salvar slide:", error);
      alert("Erro ao salvar slide. Tente novamente.");
    }
  };

  const handleEdit = (slide) => {
    setEditingSlide(slide);
    setShowForm(true);
  };

  const handleDelete = async (slideId) => {
    if (confirm("Tem certeza que deseja excluir este slide?")) {
      try {
        await Slide.delete(slideId);
        loadData();
      } catch (error) {
        console.error("Erro ao excluir slide:", error);
        alert("Erro ao excluir slide. Tente novamente.");
      }
    }
  };

  const filteredSlides = slides.filter(slide => {
    if (activeTab === "todos") return true;
    return slide.tipo === activeTab;
  });

  const slideStats = {
    total: slides.length,
    imagem: slides.filter(s => s.tipo === "imagem").length,
    video: slides.filter(s => s.tipo === "video").length,
    youtube: slides.filter(s => s.tipo === "youtube").length
  };

  return (
    <div className="p-6 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Gerenciar Slides</h1>
            <p className="text-slate-600">Crie e organize conteúdo para seus displays</p>
          </div>
          <Button 
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Slide
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Image className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{slideStats.total}</p>
                  <p className="text-sm text-slate-500">Total de Slides</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Image className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{slideStats.imagem}</p>
                  <p className="text-sm text-slate-500">Imagens</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Video className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{slideStats.video}</p>
                  <p className="text-sm text-slate-500">Vídeos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Youtube className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{slideStats.youtube}</p>
                  <p className="text-sm text-slate-500">YouTube</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {showForm && (
          <div className="mb-8">
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="w-5 h-5" />
                  {editingSlide ? 'Editar Slide' : 'Novo Slide'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SlideForm
                  slide={editingSlide}
                  locais={locais}
                  onSubmit={handleSubmit}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingSlide(null);
                  }}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs para filtros */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="imagem">Imagens</TabsTrigger>
            <TabsTrigger value="video">Vídeos</TabsTrigger>
            <TabsTrigger value="youtube">YouTube</TabsTrigger>
          </TabsList>
        </Tabs>

        <SlideGrid 
          slides={filteredSlides}
          locais={locais}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}