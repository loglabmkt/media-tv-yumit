import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QrCode, Save, Eye, AlertCircle, CheckCircle2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import QRCodeSlide from "@/components/player/QRCodeSlide";

export default function QRSlide() {
  const [config, setConfig] = useState({
    titulo: "",
    link_qrcode: "",
    headline: "",
    subtitulo: "",
    tempo_exibicao: 20,
    frequencia_tipo: "entre_todos",
    frequencia_n: 3,
    ativo: true
  });
  const [configId, setConfigId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    const list = await base44.entities.QRSlideConfig.list();
    if (list.length > 0) {
      setConfig(list[0]);
      setConfigId(list[0].id);
    }
    setIsLoading(false);
  };

  const isValidUrl = (url) => url && (url.startsWith("http://") || url.startsWith("https://"));

  const handleSave = async () => {
    if (!isValidUrl(config.link_qrcode)) {
      alert("O link do QR Code deve começar com http:// ou https://");
      return;
    }
    setIsSaving(true);
    if (configId) {
      await base44.entities.QRSlideConfig.update(configId, config);
    } else {
      const created = await base44.entities.QRSlideConfig.create(config);
      setConfigId(created.id);
    }
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <QrCode className="w-8 h-8 text-blue-600" />
              Slide QR Code
            </h1>
            <p className="text-slate-500 mt-1">Configure o slide dinâmico com QR Code exibido no Player</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowPreview(true)}
              disabled={!config.headline || !isValidUrl(config.link_qrcode)}
            >
              <Eye className="w-4 h-4 mr-2" />
              Visualizar
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : saved ? (
                <CheckCircle2 className="w-4 h-4 mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {saved ? "Salvo!" : "Salvar Configuração"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Seção Conteúdo */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Conteúdo do Slide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label>Título interno (para identificação no admin)</Label>
                  <Input
                    value={config.titulo}
                    onChange={(e) => setConfig(p => ({ ...p, titulo: e.target.value }))}
                    placeholder="Ex: QR Code WiFi, Acesse o Site..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Headline <span className="text-red-500">*</span></Label>
                  <Input
                    value={config.headline}
                    onChange={(e) => setConfig(p => ({ ...p, headline: e.target.value }))}
                    placeholder="Ex: Conecte-se ao Wi-Fi"
                    className="text-lg font-semibold"
                  />
                  <p className="text-xs text-slate-500">Texto principal exibido em destaque no slide</p>
                </div>

                <div className="space-y-2">
                  <Label>Subtítulo</Label>
                  <Input
                    value={config.subtitulo}
                    onChange={(e) => setConfig(p => ({ ...p, subtitulo: e.target.value }))}
                    placeholder="Ex: Acesse nossa rede gratuitamente"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Link do QR Code <span className="text-red-500">*</span></Label>
                  <Input
                    value={config.link_qrcode}
                    onChange={(e) => setConfig(p => ({ ...p, link_qrcode: e.target.value }))}
                    placeholder="https://..."
                    type="url"
                  />
                  {config.link_qrcode && !isValidUrl(config.link_qrcode) && (
                    <div className="flex items-center gap-2 text-amber-600 text-xs">
                      <AlertCircle className="w-3 h-3" />
                      O link deve começar com http:// ou https://
                    </div>
                  )}
                  {!config.link_qrcode && (
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <AlertCircle className="w-3 h-3" />
                      Configure um link para ativar este slide
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Seção Tempo & Frequência */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tempo & Frequência</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Tempo de exibição (segundos)</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      min="5"
                      max="120"
                      value={config.tempo_exibicao}
                      onChange={(e) => setConfig(p => ({ ...p, tempo_exibicao: parseInt(e.target.value) || 20 }))}
                      className="w-32"
                    />
                    <span className="text-sm text-slate-500">segundos por exibição</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Frequência de exibição</Label>
                  <RadioGroup
                    value={config.frequencia_tipo}
                    onValueChange={(v) => setConfig(p => ({ ...p, frequencia_tipo: v }))}
                    className="space-y-3"
                  >
                    <div className="flex items-start gap-3 p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                      <RadioGroupItem value="entre_todos" id="freq-todos" className="mt-0.5" />
                      <label htmlFor="freq-todos" className="cursor-pointer">
                        <p className="font-medium text-slate-800">Entre todos os slides</p>
                        <p className="text-sm text-slate-500">Aparece após cada slide de mídia da playlist</p>
                      </label>
                    </div>
                    <div className="flex items-start gap-3 p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                      <RadioGroupItem value="a_cada_n_slides" id="freq-n" className="mt-0.5" />
                      <label htmlFor="freq-n" className="cursor-pointer flex-1">
                        <p className="font-medium text-slate-800">A cada N slides</p>
                        <p className="text-sm text-slate-500 mb-3">Aparece após um número específico de slides de mídia</p>
                        {config.frequencia_tipo === "a_cada_n_slides" && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-600">A cada</span>
                            <Input
                              type="number"
                              min="1"
                              max="20"
                              value={config.frequencia_n}
                              onChange={(e) => setConfig(p => ({ ...p, frequencia_n: parseInt(e.target.value) || 1 }))}
                              className="w-20"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <span className="text-sm text-slate-600">slides de mídia</span>
                          </div>
                        )}
                      </label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border">
                  <div>
                    <p className="font-medium text-slate-800">Slide ativo</p>
                    <p className="text-sm text-slate-500">Desative para pausar globalmente sem excluir a configuração</p>
                  </div>
                  <Switch
                    checked={config.ativo}
                    onCheckedChange={(v) => setConfig(p => ({ ...p, ativo: v }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview do QR Code ao vivo */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Preview do QR Code</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                {isValidUrl(config.link_qrcode) ? (
                  <>
                    <div className="bg-white p-4 rounded-xl border shadow-sm">
                      <QRCodeSVG
                        value={config.link_qrcode}
                        size={180}
                        bgColor="#ffffff"
                        fgColor="#0f172a"
                        level="M"
                      />
                    </div>
                    <p className="text-xs text-slate-500 text-center break-all">{config.link_qrcode}</p>
                  </>
                ) : (
                  <div className="w-full aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
                    <QrCode className="w-12 h-12 mb-2 opacity-30" />
                    <p className="text-sm text-center">Insira um link válido para gerar o QR Code</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-5">
                <h4 className="font-semibold text-blue-800 mb-2 text-sm">Como ativar nas TVs</h4>
                <ol className="text-xs text-blue-700 space-y-1.5 list-decimal list-inside">
                  <li>Configure o conteúdo e salve</li>
                  <li>Vá em <strong>Gerenciar Locais</strong></li>
                  <li>Edite o local desejado</li>
                  <li>Ative o toggle <strong>"Slide QR Code"</strong> na seção Playlist</li>
                  <li>O Player passará a exibir o slide automaticamente</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal de Preview */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden bg-slate-900">
          <DialogHeader className="sr-only">
            <DialogTitle>Preview do QR Slide</DialogTitle>
          </DialogHeader>
          <div style={{ aspectRatio: '16/9', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, transform: 'scale(0.5)', transformOrigin: 'top left', width: '200%', height: '200%' }}>
              <QRCodeSlide config={config} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}