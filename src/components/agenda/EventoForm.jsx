import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function EventoForm({ evento, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(evento || {
    titulo: "",
    data_hora: "",
    local: "",
    tipo: "palestra",
    cor: "amarelo",
    ativo: true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar data não passada
    const selectedDate = new Date(formData.data_hora);
    const now = new Date();
    if (selectedDate < now) {
      alert("Não é possível cadastrar eventos com data passada.");
      return;
    }
    
    onSubmit(formData);
  };

  const tipoLabels = {
    palestra: "Palestra",
    workshop: "Workshop",
    meetup: "Meetup",
    networking: "Networking",
    outro: "Outro"
  };

  const corLabels = {
    amarelo: "🟡 Amarelo",
    azul: "🔵 Azul",
    verde: "🟢 Verde",
    roxo: "🟣 Roxo",
    laranja: "🟠 Laranja"
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="titulo">Título do Evento *</Label>
          <Input
            id="titulo"
            value={formData.titulo}
            onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
            placeholder="Ex: Workshop de Inovação"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="local">Local *</Label>
          <Input
            id="local"
            value={formData.local}
            onChange={(e) => setFormData(prev => ({ ...prev, local: e.target.value }))}
            placeholder="Ex: Auditório Principal"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="data_hora">Data e Hora *</Label>
          <Input
            id="data_hora"
            type="datetime-local"
            value={formData.data_hora}
            onChange={(e) => setFormData(prev => ({ ...prev, data_hora: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipo">Tipo de Evento</Label>
          <Select
            value={formData.tipo}
            onValueChange={(value) => setFormData(prev => ({ ...prev, tipo: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(tipoLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cor">Cor</Label>
          <Select
            value={formData.cor}
            onValueChange={(value) => setFormData(prev => ({ ...prev, cor: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(corLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
          {evento ? 'Atualizar Evento' : 'Criar Evento'}
        </Button>
      </div>
    </form>
  );
}