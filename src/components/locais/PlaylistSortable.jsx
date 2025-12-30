import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { GripVertical, Trash2, Image, Film, Youtube, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const typeIcons = {
  imagem: Image,
  video: Film,
  youtube: Youtube
};

const typeLabels = {
  imagem: "Imagem",
  video: "Vídeo",
  youtube: "YouTube"
};

export default function PlaylistSortable({ slides, onReorder, onRemove }) {
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(slides);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    onReorder(items);
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "10s";
    if (seconds >= 60) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return secs > 0 ? `${mins}m${secs}s` : `${mins}m`;
    }
    return `${seconds}s`;
  };

  const totalDuration = slides.reduce((acc, s) => acc + (s.tempo_exibicao || 10), 0);
  const totalMinutes = Math.floor(totalDuration / 60);
  const totalSeconds = totalDuration % 60;

  if (slides.length === 0) {
    return (
      <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
        <Image className="w-10 h-10 text-slate-300 mx-auto mb-2" />
        <p className="text-slate-500 text-sm">Nenhum slide na playlist</p>
        <p className="text-slate-400 text-xs mt-1">
          Adicione slides na página "Gerenciar Slides"
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
          {slides.length} {slides.length === 1 ? "item" : "itens"} • {totalMinutes > 0 ? `${totalMinutes}m` : ""}{totalSeconds}s total
        </span>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="playlist">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 ${
                snapshot.isDraggingOver ? "bg-blue-50 border-blue-200" : ""
              }`}
            >
              {slides.map((slide, index) => {
                const IconComponent = typeIcons[slide.tipo] || Image;
                return (
                  <Draggable key={slide.id} draggableId={slide.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`flex items-center gap-3 p-3 bg-white border rounded-lg transition-all ${
                          snapshot.isDragging
                            ? "border-blue-500 shadow-xl"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div
                          {...provided.dragHandleProps}
                          className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 p-1"
                        >
                          <GripVertical className="w-5 h-5" />
                        </div>

                        <span className="w-6 h-6 flex items-center justify-center bg-slate-100 rounded text-xs font-bold text-slate-600 flex-shrink-0">
                          {index + 1}
                        </span>

                        <div
                          className={`w-10 h-10 rounded flex items-center justify-center flex-shrink-0 ${
                            slide.tipo === "imagem"
                              ? "bg-emerald-100 text-emerald-600"
                              : slide.tipo === "video"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          <IconComponent className="w-5 h-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-800 truncate text-sm">
                            {slide.titulo}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span className="uppercase font-bold tracking-wider text-[10px]">
                              {typeLabels[slide.tipo]}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDuration(slide.tempo_exibicao)}
                            </span>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                          onClick={() => onRemove(slide.id)}
                          title="Remover da Playlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}