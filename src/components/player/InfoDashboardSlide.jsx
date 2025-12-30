import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function InfoDashboardSlide({ weather, quotes, news, agenda = [] }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

  // Atualizar horário
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Rotacionar notícias
  useEffect(() => {
    if (!news || news.length === 0) return;
    const interval = setInterval(() => {
      setCurrentNewsIndex(prev => (prev + 1) % news.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [news]);

  const formatTime = (date) => date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formatDate = (date) => date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });

  const currentNews = news && news.length > 0 ? news[currentNewsIndex] : null;
  const dolar = quotes?.find(q => q.codigo === 'USD' || q.nome?.toLowerCase().includes('dólar'));

  // Dados de trânsito (simulados com fator de hora do rush)
  const getTrafficTime = (baseMinutes) => {
    const hour = currentTime.getHours();
    const isRushHour = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19);
    const factor = isRushHour ? 1.4 : 1;
    return Math.round(baseMinutes * factor);
  };

  const trafficDestinations = [
    { name: 'Aeroporto Marechal Rondon', icon: '✈️', baseTime: 25, color: '#3B82F6' },
    { name: 'Centro de Cuiabá', icon: '🏛️', baseTime: 15, color: '#10B981' },
    { name: 'Shopping Estação', icon: '🛒', baseTime: 12, color: '#F59E0B' }
  ];

  // Formatar eventos da agenda
  const formatAgendaItem = (evento) => {
    const date = new Date(evento.data_hora);
    const isToday = new Date().toDateString() === date.toDateString();
    const isTomorrow = new Date(Date.now() + 86400000).toDateString() === date.toDateString();
    return {
      titulo: evento.titulo,
      horario: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      local: evento.local,
      dateLabel: isToday ? 'Hoje' : isTomorrow ? 'Amanhã' : date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
    };
  };

  const agendaItems = agenda.length > 0 ? agenda.map(formatAgendaItem) : [];
  const hasAgenda = agendaItems.length > 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        padding: 'clamp(20px, 3vw, 50px)',
        display: 'grid',
        gridTemplateColumns: '1.5fr 1fr',
        gridTemplateRows: '1fr 1fr auto',
        gap: 'clamp(15px, 2vw, 30px)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: 'white',
        overflow: 'hidden'
      }}
    >
      {/* Bloco Principal - Notícias (ocupa 2 linhas à esquerda) */}
      <motion.div
        variants={itemVariants}
        style={{
          gridRow: 'span 2',
          borderRadius: '24px',
          overflow: 'hidden',
          position: 'relative',
          background: 'linear-gradient(180deg, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.1) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 'clamp(24px, 3vw, 40px)'
        }}
      >
        {/* Background decorativo */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.15
        }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: 'clamp(16px, 2vh, 24px)'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #4285F4, #34A853)',
              padding: '10px 20px',
              borderRadius: '30px',
              fontSize: 'clamp(12px, 1.2vw, 16px)',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              📰 Google News • Tecnologia
            </div>
          </div>
          
          {currentNews ? (
            <motion.h2
              key={currentNewsIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={{
                fontSize: 'clamp(28px, 3.5vw, 56px)',
                fontWeight: '700',
                lineHeight: '1.2',
                margin: 0,
                textShadow: '0 4px 20px rgba(0,0,0,0.5)'
              }}
            >
              {currentNews.titulo}
            </motion.h2>
          ) : (
            <h2 style={{
              fontSize: 'clamp(28px, 3.5vw, 56px)',
              fontWeight: '700',
              opacity: 0.5
            }}>
              Carregando notícias...
            </h2>
          )}
          
          {/* Indicadores de notícias */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginTop: 'clamp(20px, 3vh, 32px)'
          }}>
            {news?.slice(0, 5).map((_, idx) => (
              <div
                key={idx}
                style={{
                  width: idx === currentNewsIndex ? '40px' : '12px',
                  height: '6px',
                  borderRadius: '3px',
                  background: idx === currentNewsIndex ? '#4285F4' : 'rgba(255,255,255,0.3)',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Bloco Agenda Yumit Hub */}
      <motion.div
        variants={itemVariants}
        style={{
          borderRadius: '24px',
          background: 'linear-gradient(180deg, rgba(251, 191, 36, 0.2) 0%, rgba(251, 191, 36, 0.05) 100%)',
          border: '1px solid rgba(251, 191, 36, 0.3)',
          backdropFilter: 'blur(20px)',
          padding: 'clamp(20px, 2.5vw, 32px)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: 'clamp(12px, 1.5vh, 20px)'
        }}>
          <span style={{ fontSize: 'clamp(20px, 2vw, 28px)' }}>📅</span>
          <h3 style={{
            fontSize: 'clamp(16px, 1.6vw, 22px)',
            fontWeight: 'bold',
            color: '#FCD34D',
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Agenda Yumit Hub
          </h3>
        </div>
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1vh, 14px)' }}>
          {hasAgenda ? (
            agendaItems.slice(0, 3).map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  padding: 'clamp(10px, 1.2vh, 16px) clamp(12px, 1.5vw, 20px)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <p style={{
                    fontSize: 'clamp(14px, 1.4vw, 18px)',
                    fontWeight: '600',
                    margin: '0 0 4px 0'
                  }}>
                    {item.titulo}
                  </p>
                  <p style={{
                    fontSize: 'clamp(11px, 1.1vw, 14px)',
                    color: '#9CA3AF',
                    margin: 0
                  }}>
                    {item.dateLabel} • {item.local}
                  </p>
                </div>
                <div style={{
                  background: 'rgba(251, 191, 36, 0.2)',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: 'clamp(13px, 1.3vw, 17px)',
                  fontWeight: 'bold',
                  color: '#FCD34D'
                }}>
                  {item.horario}
                </div>
              </div>
            ))
          ) : (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.5
            }}>
              <span style={{ fontSize: 'clamp(32px, 3vw, 48px)', marginBottom: '8px' }}>📅</span>
              <p style={{
                fontSize: 'clamp(16px, 1.6vw, 20px)',
                fontWeight: '600',
                color: '#FCD34D',
                margin: 0
              }}>
                Em breve
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Bloco Trânsito */}
      <motion.div
        variants={itemVariants}
        style={{
          borderRadius: '24px',
          background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.05) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          backdropFilter: 'blur(20px)',
          padding: 'clamp(20px, 2.5vw, 32px)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: 'clamp(12px, 1.5vh, 20px)'
        }}>
          <span style={{ fontSize: 'clamp(20px, 2vw, 28px)' }}>🚗</span>
          <h3 style={{
            fontSize: 'clamp(16px, 1.6vw, 22px)',
            fontWeight: 'bold',
            color: '#10B981',
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Trânsito Agora
          </h3>
        </div>
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1vh, 14px)' }}>
          {trafficDestinations.map((dest, idx) => {
            const time = getTrafficTime(dest.baseTime);
            const status = time > dest.baseTime * 1.2 ? 'lento' : 'normal';
            return (
              <div
                key={idx}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  padding: 'clamp(10px, 1.2vh, 16px) clamp(12px, 1.5vw, 20px)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: 'clamp(18px, 1.8vw, 24px)' }}>{dest.icon}</span>
                  <span style={{ fontSize: 'clamp(13px, 1.3vw, 17px)', fontWeight: '500' }}>
                    {dest.name}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: status === 'lento' ? '#F59E0B' : '#10B981'
                  }} />
                  <span style={{
                    fontSize: 'clamp(16px, 1.6vw, 22px)',
                    fontWeight: 'bold',
                    color: dest.color
                  }}>
                    {time} min
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Faixa Inferior - Relógio, Clima, Cotação */}
      <motion.div
        variants={itemVariants}
        style={{
          gridColumn: 'span 2',
          borderRadius: '24px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(20px)',
          padding: 'clamp(16px, 2vw, 28px) clamp(24px, 3vw, 40px)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {/* Relógio */}
        <div style={{ flex: 1 }}>
          <p style={{
            fontSize: 'clamp(48px, 6vw, 90px)',
            fontWeight: '200',
            margin: 0,
            letterSpacing: '-3px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            {formatTime(currentTime)}
          </p>
          <p style={{
            fontSize: 'clamp(14px, 1.4vw, 20px)',
            color: '#9CA3AF',
            margin: '4px 0 0 0',
            textTransform: 'capitalize'
          }}>
            {formatDate(currentTime)}
          </p>
        </div>

        {/* Clima */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(12px, 1.5vw, 20px)',
          padding: '0 clamp(24px, 3vw, 40px)',
          borderLeft: '1px solid rgba(255,255,255,0.1)',
          borderRight: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{
            width: 'clamp(50px, 5vw, 80px)',
            height: 'clamp(50px, 5vw, 80px)',
            background: 'linear-gradient(135deg, #FCD34D, #F59E0B)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'clamp(24px, 2.5vw, 40px)',
            boxShadow: '0 8px 32px rgba(252, 211, 77, 0.4)'
          }}>
            ☀️
          </div>
          <div>
            <p style={{
              fontSize: 'clamp(36px, 4vw, 60px)',
              fontWeight: 'bold',
              margin: 0,
              lineHeight: 1
            }}>
              {weather?.temperatura || '32°C'}
            </p>
            <p style={{
              fontSize: 'clamp(12px, 1.2vw, 16px)',
              color: '#9CA3AF',
              margin: 0
            }}>
              {weather?.cidade || 'Cuiabá'}
            </p>
          </div>
        </div>

        {/* Cotação Dólar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(12px, 1.5vw, 20px)',
          paddingLeft: 'clamp(24px, 3vw, 40px)'
        }}>
          <div style={{
            width: 'clamp(50px, 5vw, 80px)',
            height: 'clamp(50px, 5vw, 80px)',
            background: 'linear-gradient(135deg, #10B981, #059669)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'clamp(24px, 2.5vw, 40px)',
            fontWeight: 'bold',
            boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4)'
          }}>
            $
          </div>
          <div>
            <p style={{
              fontSize: 'clamp(36px, 4vw, 60px)',
              fontWeight: 'bold',
              margin: 0,
              lineHeight: 1
            }}>
              {dolar?.valor || 'R$ 5,85'}
            </p>
            <p style={{
              fontSize: 'clamp(12px, 1.2vw, 16px)',
              color: dolar?.variacao === 'alta' ? '#10B981' : dolar?.variacao === 'baixa' ? '#EF4444' : '#9CA3AF',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span>
                {dolar?.variacao === 'alta' ? '↑' : dolar?.variacao === 'baixa' ? '↓' : '−'}
              </span>
              Dólar USD
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}