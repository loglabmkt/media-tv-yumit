import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Image, Video, Youtube, Edit, Trash2, Clock, MapPin } from "lucide-react";

const typeIcons = {
  imagem: Image,
  video: Video,
  youtube: Youtube
};

const typeColors = {
  imagem: "bg-green-100 text-green-800",
  video: "bg-purple-100 text-purple-800",  
  youtube: "bg-red-100 text-red-800"
};

export default function SlideGrid({ slides, locais, isLoading, onEdit, onDelete }) {
  const getLocalNome = (localId) => {
    const local = locais.find(l => l.id === localId);
    return local ? local.nome : "Local não encontrado";
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-slate-200 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-slate-200 rounded"></div>
                <div className="h-3 bg-slate-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="text-center py-16">
        <Image className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-800 mb-2">Nenhum slide encontrado</h3>
        <p className="text-slate-500">Comece criando seu primeiro slide</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {slides.map((slide) => {
        const TypeIcon = typeIcons[slide.tipo];
        return (
          <Card key={slide.id} className="bg-white/80 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-300 group overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeColors[slide.tipo].replace('text-', 'bg-').replace('800', '100')}`}>
                    <TypeIcon className={`w-5 h-5 ${typeColors[slide.tipo].split(' ')[1]}`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-800">
                      {slide.titulo}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className={typeColors[slide.tipo]}>
                        {slide.tipo}
                      </Badge>
                      <Badge variant={slide.ativo ? "default" : "secondary"} className={slide.ativo ? "bg-green-100 text-green-800" : ""}>
                        {slide.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Preview do conteúdo */}
              <div className="h-32 bg-slate-100 rounded-lg overflow-hidden">
                {slide.tipo === "imagem" && (
                  <img 
                    src={slide.conteudo_url} 
                    alt={slide.titulo}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                )}
                {slide.tipo === "video" && (
                  <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                    <Video className="w-8 h-8 text-slate-400" />
                  </div>
                )}
                {slide.tipo === "youtube" && (
                  <div className="w-full h-full bg-red-100 flex items-center justify-center">
                    <Youtube className="w-8 h-8 text-red-500" />
                  </div>
                )}
                <div className="w-full h-full bg-slate-200 items-center justify-center" style={{display: 'none'}}>
                  <span className="text-slate-500 text-sm">Erro ao carregar</span>
                </div>
              </div>

              {/* Informações */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-slate-500">
                    <MapPin className="w-3 h-3" />
                    <span>Local:</span>
                  </div>
                  <span className="font-medium text-slate-700">
                    {getLocalNome(slide.local_id)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-3 h-3" />
                    <span>Duração:</span>
                  </div>
                  <span className="font-medium text-slate-700">
                    {slide.tempo_exibicao}s
                  </span>
                </div>

                {slide.tipo === "youtube" && slide.youtube_duracao && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">YouTube:</span>
                    <span className="font-medium text-slate-700">
                      {slide.youtube_duracao}s
                    </span>
                  </div>
                )}
              </div>

              {/* Ações */}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => onEdit(slide)}
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDelete(slide.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}