import React, { useState, useEffect, useRef } from "react";
import { base44 } from '@/api/base44Client';
import { InvokeLLM } from "@/integrations/Core";

import PlayerSlide from "../components/player/PlayerSlide";
import InfoDashboardSlide from "../components/player/InfoDashboardSlide";
import QRCodeSlide from "../components/player/QRCodeSlide";

export default function Player() {
  const [slides, setSlides] = useState([]);
  const [local, setLocal] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  // currentSpecialSlide: null | 'info' | 'qr'
  const [currentSpecialSlide, setCurrentSpecialSlide] = useState(null);
  const [weather, setWeather] = useState(null);
  const [news, setNews] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [agenda, setAgenda] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [qrConfig, setQrConfig] = useState(null);
  // Contador de slides de mídia exibidos (para frequencia a_cada_n)
  const mediaSlideCountRef = useRef(0);
  // Qual especial mostrar a seguir (alterna entre info e qr quando ambos ativos)
  const nextSpecialRef = useRef('info');

  // Tempo de exibição do InfoDashboardSlide (em segundos)
  const INFO_SLIDE_DURATION = 15;

  // Entrar em tela cheia automaticamente
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
          await elem.webkitRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
          await elem.mozRequestFullScreen();
        } else if (elem.msRequestFullscreen) {
          await elem.msRequestFullscreen();
        }
      } catch (error) {
        console.log("Não foi possível entrar em tela cheia:", error);
      }
    };

    const timer = setTimeout(() => {
      enterFullscreen();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const localCodigo = urlParams.get('local');
    
    if (localCodigo) {
      const loadPlayerData = async (codigo) => {
        try {
          const locais = await base44.entities.Local.filter({ codigo: codigo, ativo: true });
          if (locais.length === 0) {
            console.error("Local não encontrado");
            setIsLoading(false);
            return;
          }
          
          const localData = locais[0];
          setLocal(localData);

          // Buscar slides e ordenar pela sequência salva no Local
          const slidesData = await base44.entities.Slide.filter({ local_id: localData.id, ativo: true });
          const sequence = localData.slides_sequence || [];
          
          let orderedSlides;
          if (sequence.length > 0) {
            // Ordenar conforme sequência salva
            orderedSlides = sequence
              .map(id => slidesData.find(s => s.id === id))
              .filter(Boolean);
            // Adicionar slides novos que não estão na sequência
            const slidesNaSequencia = new Set(sequence);
            const slidesNovos = slidesData.filter(s => !slidesNaSequencia.has(s.id));
            orderedSlides = [...orderedSlides, ...slidesNovos];
          } else {
            // Fallback: ordenar por campo ordem
            orderedSlides = slidesData.sort((a, b) => (a.ordem || 0) - (b.ordem || 0));
          }
          
          setSlides(orderedSlides);

          loadExternalData();
          loadAgenda();
          loadQRConfig();

        } catch (error) {
          console.error("Erro ao carregar dados:", error);
          setIsLoading(false);
        }
      };

      const loadQRConfig = async () => {
        try {
          const list = await base44.entities.QRSlideConfig.filter({ ativo: true });
          if (list.length > 0) setQrConfig(list[0]);
        } catch (e) {
          console.error("Erro ao carregar QRSlideConfig:", e);
        }
      };

      const loadAgenda = async () => {
        try {
          const eventos = await base44.entities.Evento.filter({ ativo: true }, 'data_hora');
          // Filtrar apenas eventos futuros
          const now = new Date();
          const eventosFuturos = eventos.filter(e => new Date(e.data_hora) > now);
          setAgenda(eventosFuturos);
        } catch (error) {
          console.error("Erro ao carregar agenda:", error);
          setAgenda([]);
        }
      };

      const loadExternalData = async () => {
        try {
          // Clima
          const weatherResponse = await InvokeLLM({
            prompt: "Temperatura atual em Cuiabá, Brasil. Responda apenas: temperatura em °C e nome da cidade.",
            add_context_from_internet: true,
            response_json_schema: {
              type: "object",
              properties: {
                temperatura: { type: "string" },
                cidade: { type: "string" }
              }
            }
          });
          setWeather(weatherResponse);

          // Notícias de múltiplas fontes brasileiras - Tech
          const newsResponse = await InvokeLLM({
            prompt: `Busque as notícias mais recentes de tecnologia do Brasil de TRÊS fontes diferentes:
1. UOL Tecnologia (https://tecnologia.uol.com.br)
2. G1 Tecnologia (https://g1.globo.com/tecnologia)
3. CNN Brasil Tech (https://www.cnnbrasil.com.br/tecnologia)

Retorne 10 manchetes misturadas (shuffle) dessas fontes. Cada notícia deve ter título e fonte.`,
            add_context_from_internet: true,
            response_json_schema: {
              type: "object",
              properties: {
                noticias: {
                  type: "array",
                  items: { 
                    type: "object", 
                    properties: { 
                      titulo: { type: "string" },
                      fonte: { type: "string" }
                    } 
                  }
                }
              }
            }
          });
          // Shuffle e pegar 5 aleatórias
          const allNews = newsResponse.noticias || [];
          const shuffled = allNews.sort(() => Math.random() - 0.5).slice(0, 5);
          setNews(shuffled);
          
          // Cotações
          const quotesResponse = await InvokeLLM({
            prompt: "Cotação atual: Dólar USD, Euro EUR, Bitcoin BTC, Ethereum ETH em BRL com variação alta/baixa/estável.",
            add_context_from_internet: true,
            response_json_schema: {
              type: "object",
              properties: {
                cotacoes: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      nome: { type: "string" },
                      codigo: { type: "string" },
                      valor: { type: "string" },
                      variacao: { type: "string" }
                    }
                  }
                }
              }
            }
          });
          setQuotes(quotesResponse.cotacoes || []);

          setIsLoading(false);

        } catch (error) {
          console.error("Erro ao carregar dados externos:", error);
          setIsLoading(false);
        }
      };

      loadPlayerData(localCodigo);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Helpers para decidir qual slide especial mostrar após um slide de mídia
  const shouldShowQR = (localData, qrCfg, mediaCount) => {
    if (!localData?.exibir_slide_qrcode) return false;
    if (!qrCfg?.ativo || !qrCfg?.link_qrcode?.startsWith('http')) return false;
    if (qrCfg.frequencia_tipo === 'entre_todos') return true;
    const n = qrCfg.frequencia_n || 1;
    return mediaCount % n === 0;
  };

  const getNextSpecial = (localData, qrCfg, mediaCount) => {
    const infoActive = localData?.exibir_slide_interativo !== false;
    const qrActive = shouldShowQR(localData, qrCfg, mediaCount);
    if (!infoActive && !qrActive) return null;
    if (infoActive && !qrActive) return 'info';
    if (!infoActive && qrActive) return 'qr';
    // Ambos ativos: alterna
    const next = nextSpecialRef.current;
    nextSpecialRef.current = next === 'info' ? 'qr' : 'info';
    return next;
  };

  // Lógica de rotação
  useEffect(() => {
    if (slides.length === 0) return;

    if (currentSpecialSlide === 'info') {
      const timer = setTimeout(() => {
        setCurrentSpecialSlide(null);
        setCurrentSlideIndex(prev => (prev + 1) % slides.length);
      }, INFO_SLIDE_DURATION * 1000);
      return () => clearTimeout(timer);
    }

    if (currentSpecialSlide === 'qr') {
      const duration = (qrConfig?.tempo_exibicao || 20) * 1000;
      const timer = setTimeout(() => {
        setCurrentSpecialSlide(null);
        setCurrentSlideIndex(prev => (prev + 1) % slides.length);
      }, duration);
      return () => clearTimeout(timer);
    }

    // Exibindo mídia
    const currentSlide = slides[currentSlideIndex];
    const duration = (currentSlide?.tempo_exibicao || 10) * 1000;

    const timer = setTimeout(() => {
      mediaSlideCountRef.current += 1;
      const next = getNextSpecial(local, qrConfig, mediaSlideCountRef.current);
      if (next) {
        setCurrentSpecialSlide(next);
      } else {
        setCurrentSlideIndex(prev => (prev + 1) % slides.length);
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [currentSlideIndex, currentSpecialSlide, slides, local, qrConfig]);

  if (isLoading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '24px'
      }}>
        <div>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid #3B82F6',
            borderTop: '4px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p>Carregando player...</p>
        </div>
      </div>
    );
  }

  if (!local || slides.length === 0) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '24px',
        textAlign: 'center'
      }}>
        <div>
          <p>Nenhum conteúdo disponível</p>
          <p style={{fontSize: '18px', color: '#999', marginTop: '10px'}}>
            Verifique as configurações do player
          </p>
        </div>
      </div>
    );
  }

  const currentSlide = slides[currentSlideIndex];

  // Pré-carregar próximos vídeos do YouTube
  const getNextYoutubeSlides = () => {
    return slides
      .filter((s, i) => s.tipo === 'youtube' && i !== currentSlideIndex)
      .slice(0, 2);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#000' }}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
      {/* Preconnect para YouTube */}
      <link rel="preconnect" href="https://www.youtube.com" />
      <link rel="preconnect" href="https://www.google.com" />
      <link rel="preconnect" href="https://i.ytimg.com" />
      <link rel="preconnect" href="https://s.ytimg.com" />
      
      {/* Pré-carregar thumbnails dos próximos vídeos */}
      {getNextYoutubeSlides().map((slide, idx) => {
        const videoId = slide.conteudo_url.split('/').pop();
        return (
          <link 
            key={idx}
            rel="prefetch" 
            href={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&vq=hd1080`} 
          />
        );
      })}
      
      {/* Conteúdo: Mídia, InfoDashboardSlide ou QRCodeSlide */}
      {currentSpecialSlide === 'info' ? (
        <InfoDashboardSlide
          weather={weather}
          quotes={quotes}
          news={news}
          agenda={agenda}
        />
      ) : currentSpecialSlide === 'qr' ? (
        <QRCodeSlide config={qrConfig} />
      ) : (
        <PlayerSlide slide={currentSlide} />
      )}
    </div>
  );
}