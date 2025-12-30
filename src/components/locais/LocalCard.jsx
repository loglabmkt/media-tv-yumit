import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Play, Edit, Trash2, Copy } from "lucide-react";

export default function LocalCard({ local, slidesCount, playerUrl, onEdit, onDelete }) {
  const copyPlayerUrl = () => {
    navigator.clipboard.writeText(playerUrl);
  };

  const openPlayer = () => {
    window.open(playerUrl, '_blank');
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-slate-800">
                {local.nome}
              </CardTitle>
              <p className="text-sm text-slate-500">#{local.codigo}</p>
            </div>
          </div>
          <Badge 
            variant={local.ativo ? "default" : "secondary"} 
            className={local.ativo ? "bg-green-100 text-green-800" : ""}
          >
            {local.ativo ? 'Ativo' : 'Inativo'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {local.descricao && (
          <p className="text-sm text-slate-600">{local.descricao}</p>
        )}
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Slides:</span>
          <span className="font-medium text-slate-800">{slidesCount}</span>
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={openPlayer}
            >
              <Play className="w-3 h-3 mr-1" />
              Player
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={copyPlayerUrl}
            >
              <Copy className="w-3 h-3" />
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => onEdit(local)}
            >
              <Edit className="w-3 h-3 mr-1" />
              Editar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(local.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}