import React, { useState, useEffect } from "react";
import { Local } from "@/entities/Local";
import { Slide } from "@/entities/Slide";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Monitor, MapPin, Image, Play, Plus, Activity } from "lucide-react";

export default function Dashboard() {
  const [locais, setLocais] = useState([]);
  const [slides, setSlides] = useState([]);
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
        const slidesData = await Slide.list();
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

  const locaisAtivos = locais.filter(local => local.ativo);
  const slidesAtivos = slides.filter(slide => slide.ativo);

  return (
    <div className="p-6 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Dashboard</h1>
          <p className="text-slate-600">Gerencie seu sistema de mídia indoor</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total de Locais
              </CardTitle>
              <MapPin className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{locais.length}</div>
              <p className="text-xs text-slate-500 mt-1">
                {locaisAtivos.length} ativos
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total de Slides
              </CardTitle>
              <Image className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{slides.length}</div>
              <p className="text-xs text-slate-500 mt-1">
                {slidesAtivos.length} ativos
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Players Ativos
              </CardTitle>
              <Monitor className="w-4 h-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{locaisAtivos.length}</div>
              <p className="text-xs text-slate-500 mt-1">
                Com conteúdo
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Status Geral
              </CardTitle>
              <Activity className="w-4 h-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">Ativo</div>
              <p className="text-xs text-slate-500 mt-1">
                Sistema funcionando
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Ações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to={createPageUrl("Locais")}>
                <Button variant="secondary" className="w-full justify-start">
                  <MapPin className="w-4 h-4 mr-2" />
                  Criar Novo Local
                </Button>
              </Link>
              <Link to={createPageUrl("Slides")}>
                <Button variant="secondary" className="w-full justify-start">
                  <Image className="w-4 h-4 mr-2" />
                  Adicionar Slide
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5 text-purple-500" />
                Links dos Players
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                </div>
              ) : locaisAtivos.length > 0 ? (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {locaisAtivos.map((local) => (
                    <div key={local.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                      <span className="text-sm font-medium text-slate-700">
                        {local.nome}
                      </span>
                      <Link to={createPageUrl(`Player?local=${local.codigo}`)}>
                        <Button size="sm" variant="outline">
                          <Play className="w-3 h-3 mr-1" />
                          Abrir
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  Crie locais para gerar links dos players
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
          <CardHeader>
            <CardTitle>Locais Cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-slate-200 rounded-lg animate-pulse"></div>
                    <div className="space-y-1">
                      <div className="h-4 bg-slate-200 rounded animate-pulse w-32"></div>
                      <div className="h-3 bg-slate-200 rounded animate-pulse w-24"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : locais.length > 0 ? (
              <div className="space-y-4">
                {locais.map((local) => {
                  const slidesDoLocal = slides.filter(slide => slide.local_id === local.id && slide.ativo);
                  return (
                    <div key={local.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{local.nome}</p>
                          <p className="text-sm text-slate-500">
                            {slidesDoLocal.length} slides • Código: {local.codigo}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${local.ativo ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-sm text-slate-500">
                          {local.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Nenhum local cadastrado ainda</p>
                <Link to={createPageUrl("Locais")}>
                  <Button className="mt-2">
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeiro Local
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}