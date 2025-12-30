import React, { useState, useEffect } from "react";
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Clock, MapPin, Trash2, Pencil } from "lucide-react";
import { format, isPast, isToday, isTomorrow } from "date-fns";
import { ptBR } from "date-fns/locale";
import EventoForm from "../components/agenda/EventoForm";

export default function Agenda() {
  const [eventos, setEventos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvento, setEditingEvento] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadEventos = async () => {
    const data = await base44.entities.Evento.list('-data_hora');
    setEventos(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadEventos();
  }, []);

  const handleSubmit = async (formData) => {
    if (editingEvento) {
      await base44.entities.Evento.update(editingEvento.id, formData);
    } else {
      await base44.entities.Evento.create(formData);
    }
    setShowForm(false);
    setEditingEvento(null);
    loadEventos();
  };

  const handleEdit = (evento) => {
    setEditingEvento(evento);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja excluir este evento?')) {
      await base44.entities.Evento.delete(id);
      loadEventos();
    }
  };

  const handleDeletePast = async () => {
    const pastEvents = eventos.filter(e => isPast(new Date(e.data_hora)));
    if (pastEvents.length === 0) {
      alert('Não há eventos passados para excluir.');
      return;
    }
    if (confirm(`Deseja excluir ${pastEvents.length} evento(s) passado(s)?`)) {
      for (const evento of pastEvents) {
        await base44.entities.Evento.delete(evento.id);
      }
      loadEventos();
    }
  };

  const corClasses = {
    amarelo: "bg-amber-100 text-amber-800 border-amber-300",
    azul: "bg-blue-100 text-blue-800 border-blue-300",
    verde: "bg-green-100 text-green-800 border-green-300",
    roxo: "bg-purple-100 text-purple-800 border-purple-300",
    laranja: "bg-orange-100 text-orange-800 border-orange-300"
  };

  const tipoLabels = {
    palestra: "Palestra",
    workshop: "Workshop",
    meetup: "Meetup",
    networking: "Networking",
    outro: "Outro"
  };

  const getDateLabel = (dateStr) => {
    const date = new Date(dateStr);
    if (isToday(date)) return "Hoje";
    if (isTomorrow(date)) return "Amanhã";
    return format(date, "dd/MM", { locale: ptBR });
  };

  // Separar eventos futuros e passados
  const eventosFuturos = eventos.filter(e => !isPast(new Date(e.data_hora))).sort((a, b) => new Date(a.data_hora) - new Date(b.data_hora));
  const eventosPassados = eventos.filter(e => isPast(new Date(e.data_hora)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <Calendar className="w-8 h-8 text-amber-600" />
              Agenda Yumit Hub
            </h1>
            <p className="text-slate-500 mt-1">Gerencie os eventos exibidos no Player</p>
          </div>
          <div className="flex gap-3">
            {eventosPassados.length > 0 && (
              <Button variant="outline" onClick={handleDeletePast} className="text-red-600 border-red-200 hover:bg-red-50">
                <Trash2 className="w-4 h-4 mr-2" />
                Limpar Passados ({eventosPassados.length})
              </Button>
            )}
            <Button onClick={() => { setShowForm(!showForm); setEditingEvento(null); }} className="bg-amber-600 hover:bg-amber-700">
              <Plus className="w-5 h-5 mr-2" />
              Novo Evento
            </Button>
          </div>
        </div>

        {/* Formulário */}
        {showForm && (
          <Card className="mb-8 border-amber-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
              <CardTitle className="text-amber-800">
                {editingEvento ? 'Editar Evento' : 'Novo Evento'}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <EventoForm
                evento={editingEvento}
                onSubmit={handleSubmit}
                onCancel={() => { setShowForm(false); setEditingEvento(null); }}
              />
            </CardContent>
          </Card>
        )}

        {/* Lista de Eventos */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : eventosFuturos.length === 0 ? (
          <Card className="text-center py-16 border-dashed border-2">
            <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">Nenhum evento futuro cadastrado</p>
            <Button 
              onClick={() => setShowForm(true)} 
              className="mt-4 bg-amber-600 hover:bg-amber-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Evento
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {eventosFuturos.map((evento) => (
              <Card 
                key={evento.id} 
                className={`relative overflow-hidden border-l-4 ${corClasses[evento.cor] || corClasses.amarelo} hover:shadow-lg transition-shadow`}
              >
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <Badge variant="outline" className={corClasses[evento.cor]}>
                      {tipoLabels[evento.tipo]}
                    </Badge>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-slate-400 hover:text-blue-600"
                        onClick={() => handleEdit(evento)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-slate-400 hover:text-red-600"
                        onClick={() => handleDelete(evento.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-lg text-slate-800 mb-3">{evento.titulo}</h3>
                  
                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-600" />
                      <span className="font-semibold text-amber-700">{getDateLabel(evento.data_hora)}</span>
                      <Clock className="w-4 h-4 text-slate-400 ml-2" />
                      <span>{format(new Date(evento.data_hora), "HH:mm")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>{evento.local}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}