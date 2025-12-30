import React, { useState, useEffect } from "react";
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ListVideo } from "lucide-react";
import PlaylistSortable from "./PlaylistSortable";

export default function LocalForm({ local, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(local || {
    nome: "",
    descricao: "",
    codigo: "",
    ativo: true,
    slides_sequence: []
  });
  const [allSlides, setAllSlides] = useState([]);
  const [playlistSlides, setPlaylistSlides] = useState([]);
  const [isLoadingSlides, setIsLoadingSlides] = useState(false);

  // Carregar slides quando for edição
  useEffect(() => {
    if (local?.id) {
      loadSlides();
    }
  }, [local?.id]);

  const loadSlides = async () => {
    setIsLoadingSlides(true);
    try {
      // Buscar todos os slides deste local
      const slides = await base44.entities.Slide.filter({ local_id: local.id, ativo: true });
      setAllSlides(slides);

      // Ordenar conforme slides_sequence salva
      const sequence = local.slides_sequence || [];
      if (sequence.length > 0) {
        const orderedSlides = sequence
          .map(id => slides.find(s => s.id === id))
          .filter(Boolean);
        // Adicionar slides que não estão na sequência
        const slidesNaSequencia = new Set(sequence);
        const slidesNovos = slides.filter(s => !slidesNaSequencia.has(s.id));
        setPlaylistSlides([...orderedSlides, ...slidesNovos]);
      } else {
        // Ordenar por campo ordem
        setPlaylistSlides(slides.sort((a, b) => (a.ordem || 0) - (b.ordem || 0)));
      }
    } catch (error) {
      console.error("Erro ao carregar slides:", error);
    }
    setIsLoadingSlides(false);
  };

  const handleReorder = (newOrder) => {
    setPlaylistSlides(newOrder);
    setFormData(prev => ({
      ...prev,
      slides_sequence: newOrder.map(s => s.id)
    }));
  };

  const handleRemoveFromPlaylist = async (slideId) => {
    // Remove da playlist visual
    const newPlaylist = playlistSlides.filter(s => s.id !== slideId);
    setPlaylistSlides(newPlaylist);
    setFormData(prev => ({
      ...prev,
      slides_sequence: newPlaylist.map(s => s.id)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Garantir que slides_sequence está atualizado
    const dataToSubmit = {
      ...formData,
      slides_sequence: playlistSlides.map(s => s.id)
    };
    onSubmit(dataToSubmit);
  };

  const generateCodigo = () => {
    const codigo = Math.random().toString(36).substring(2, 8).toUpperCase();
    setFormData(prev => ({ ...prev, codigo }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome do Local *</Label>
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
            placeholder="Ex: Recepção, Sala de Reunião"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="codigo">Código Único *</Label>
          <div className="flex gap-2">
            <Input
              id="codigo"
              value={formData.codigo}
              onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value.toUpperCase() }))}
              placeholder="Ex: REC001"
              required
            />
            <Button 
              type="button" 
              variant="outline" 
              onClick={generateCodigo}
            >
              Gerar
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          value={formData.descricao}
          onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
          placeholder="Descreva o ambiente onde será exibido o conteúdo"
          rows={3}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="ativo"
          checked={formData.ativo}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, ativo: checked }))}
        />
        <Label htmlFor="ativo">Local ativo</Label>
      </div>

      {/* Seção de Playlist - apenas na edição */}
      {local?.id && (
        <>
          <Separator className="my-6" />
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ListVideo className="w-5 h-5 text-blue-600" />
              <Label className="text-lg font-semibold">Playlist / Sequência de Exibição</Label>
            </div>
            <p className="text-sm text-slate-500">
              Arraste os slides para definir a ordem de reprodução no Player.
            </p>

            {isLoadingSlides ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-14 bg-slate-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              <PlaylistSortable
                slides={playlistSlides}
                onReorder={handleReorder}
                onRemove={handleRemoveFromPlaylist}
              />
            )}
          </div>
        </>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          {local ? 'Atualizar Local' : 'Criar Local'}
        </Button>
      </div>
    </form>
  );
}