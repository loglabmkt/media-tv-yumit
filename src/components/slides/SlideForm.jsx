import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { UploadFile } from "@/integrations/Core";
import { Upload, Loader2 } from "lucide-react";

export default function SlideForm({ slide, locais, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(slide || {
    titulo: "",
    tipo: "imagem",
    conteudo_url: "",
    tempo_exibicao: 10,
    local_id: "",
    ordem: 0,
    ativo: true,
    youtube_duracao: null
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      setFormData(prev => ({ 
        ...prev, 
        conteudo_url: file_url,
        tipo: file.type.startsWith('image/') ? 'imagem' : 'video'
      }));
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
    }
    setIsUploading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const extractYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleYouTubeUrl = (url) => {
    const videoId = extractYouTubeId(url);
    if (videoId) {
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      setFormData(prev => ({ ...prev, conteudo_url: embedUrl }));
    } else {
      setFormData(prev => ({ ...prev, conteudo_url: url }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="titulo">Título do Slide *</Label>
          <Input
            id="titulo"
            value={formData.titulo}
            onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
            placeholder="Nome do slide"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="local">Local *</Label>
          <Select
            value={formData.local_id}
            onValueChange={(value) => setFormData(prev => ({ ...prev, local_id: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um local" />
            </SelectTrigger>
            <SelectContent>
              {locais.filter(l => l.ativo).map((local) => (
                <SelectItem key={local.id} value={local.id}>
                  {local.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tipo">Tipo de Conteúdo</Label>
        <Select
          value={formData.tipo}
          onValueChange={(value) => setFormData(prev => ({ ...prev, tipo: value, conteudo_url: "" }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="imagem">Imagem</SelectItem>
            <SelectItem value="video">Vídeo</SelectItem>
            <SelectItem value="youtube">YouTube</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Upload ou URL */}
      {formData.tipo === "imagem" || formData.tipo === "video" ? (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept={formData.tipo === "imagem" ? "image/*" : "video/*"}
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              disabled={isUploading}
            />
            <label 
              htmlFor="file-upload" 
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              {isUploading ? (
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              ) : (
                <Upload className="w-8 h-8 text-slate-400" />
              )}
              <span className="text-sm text-slate-600">
                {isUploading ? 'Enviando...' : `Clique para enviar ${formData.tipo}`}
              </span>
            </label>
          </div>
          {formData.conteudo_url && (
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700">Arquivo enviado com sucesso!</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="youtube-url">URL do YouTube</Label>
          <Input
            id="youtube-url"
            value={formData.conteudo_url}
            onChange={(e) => handleYouTubeUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {formData.tipo !== "youtube" && (
          <div className="space-y-2">
            <Label htmlFor="tempo">Tempo de Exibição (minutos)</Label>
            <Input
              id="tempo"
              type="number"
              min="0.1"
              step="0.1"
              value={formData.tempo_exibicao / 60}
              onChange={(e) => setFormData(prev => ({ ...prev, tempo_exibicao: Math.round(parseFloat(e.target.value) * 60) }))}
            />
            <p className="text-xs text-slate-500">{formData.tempo_exibicao} segundos</p>
          </div>
        )}

        {formData.tipo === "youtube" && (
          <div className="space-y-2">
            <Label htmlFor="youtube-duracao">Duração do Vídeo (minutos)</Label>
            <Input
              id="youtube-duracao"
              type="number"
              min="0.1"
              step="0.1"
              value={(formData.tempo_exibicao || 60) / 60}
              onChange={(e) => setFormData(prev => ({ ...prev, tempo_exibicao: Math.round(parseFloat(e.target.value) * 60) }))}
            />
            <p className="text-xs text-slate-500">{formData.tempo_exibicao || 60} segundos</p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="ordem">Ordem na Playlist</Label>
          <Input
            id="ordem"
            type="number"
            min="0"
            value={formData.ordem}
            onChange={(e) => setFormData(prev => ({ ...prev, ordem: parseInt(e.target.value) }))}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="ativo"
          checked={formData.ativo}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, ativo: checked }))}
        />
        <Label htmlFor="ativo">Slide ativo</Label>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          type="submit" 
          className="bg-blue-600 hover:bg-blue-700"
          disabled={!formData.conteudo_url}
        >
          {slide ? 'Atualizar Slide' : 'Criar Slide'}
        </Button>
      </div>
    </form>
  );
}