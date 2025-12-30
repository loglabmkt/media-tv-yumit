import React, { useState, useEffect } from "react";

export default function PlayerSidebar({ weather, quotes, news }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [currentTrafficIndex, setCurrentTrafficIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Atualizar horário
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Controlar aparição automática da barra
  useEffect(() => {
    const showHideCycle = () => {
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 40000);
    };

    showHideCycle();
    const interval = setInterval(() => {
      showHideCycle();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Rotacionar cotações a cada 5 segundos
  useEffect(() => {
    if (!quotes || quotes.length === 0) return;
    const quoteInterval = setInterval(() => setCurrentQuoteIndex(prev => (prev + 1) % quotes.length), 5000);
    return () => clearInterval(quoteInterval);
  }, [quotes]);

  // Rotacionar notícias a cada 6 segundos
  useEffect(() => {
    if (!news || news.length === 0) return;
    const newsInterval = setInterval(() => setCurrentNewsIndex(prev => (prev + 1) % news.length), 6000);
    return () => clearInterval(newsInterval);
  }, [news]);

  // Rotacionar destinos de trânsito a cada 5 segundos
  useEffect(() => {
    const trafficInterval = setInterval(() => setCurrentTrafficIndex(prev => (prev + 1) % 3), 5000);
    return () => clearInterval(trafficInterval);
  }, []);

  const formatTime = (date) => date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const formatDate = (date) => date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });

  const currentQuote = quotes && quotes.length > 0 ? quotes[currentQuoteIndex] : null;
  const currentNews = news && news.length > 0 ? news[currentNewsIndex] : null;

  // Destinos de trânsito
  const trafficDestinations = [
    { name: 'Centro', time: '15 min', color: '#10B981' },
    { name: 'UFMT', time: '10 min', color: '#10B981' },
    { name: 'Aeroporto', time: '25 min', color: '#FCD34D' }
  ];
  const currentTraffic = trafficDestinations[currentTrafficIndex];

  const sidebarStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 'clamp(320px, 26vw, 480px)',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(30px)',
    WebkitBackdropFilter: 'blur(30px)',
    padding: 'clamp(20px, 2.5vh, 40px) clamp(20px, 2vw, 36px)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    color: 'white',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    overflow: 'hidden',
    boxShadow: '4px 0 24px rgba(0, 0, 0, 0.5)',
    transform: isVisible ? 'translateX(0)' : 'translateX(-100%)',
    opacity: isVisible ? 1 : 0,
    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease',
    zIndex: 100
  };

  return (
    <div style={sidebarStyle}>
      {/* Cabeçalho: Data/Hora e Clima na mesma linha */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 'clamp(16px, 2.5vh, 24px)',
        gap: 'clamp(12px, 1.5vw, 20px)',
        flexShrink: 0
      }}>
        {/* Data e Hora */}
        <div style={{ flex: 1 }}>
          <p style={{ 
            color: '#D1D5DB', 
            fontSize: 'clamp(11px, 1vw, 14px)', 
            margin: '0 0 4px 0',
            textTransform: 'capitalize',
            fontWeight: '500',
            letterSpacing: '0.3px'
          }}>
            {formatDate(currentTime)}
          </p>
          <p style={{ 
            fontSize: 'clamp(36px, 4vw, 56px)', 
            fontWeight: '300', 
            margin: 0,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            letterSpacing: '-2px',
            lineHeight: '1',
            color: '#FFFFFF'
          }}>
            {formatTime(currentTime)}
          </p>
        </div>

        {/* Clima */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'clamp(8px, 1vw, 12px)',
          padding: 'clamp(8px, 1vh, 12px) clamp(12px, 1.5vw, 16px)',
          backgroundColor: 'rgba(252, 211, 77, 0.15)',
          borderRadius: '12px'
        }}>
          <div style={{
            width: 'clamp(32px, 3.5vw, 40px)',
            height: 'clamp(32px, 3.5vw, 40px)',
            backgroundColor: '#FCD34D',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'clamp(16px, 1.8vw, 20px)',
            boxShadow: '0 4px 12px rgba(252, 211, 77, 0.4)'
          }}>
            ☀
          </div>
          <div>
            <p style={{ 
              fontSize: 'clamp(28px, 3vw, 40px)', 
              fontWeight: 'bold', 
              margin: 0,
              lineHeight: '1',
              color: '#FFFFFF'
            }}>
              {weather?.temperatura || '--'}
            </p>
            <p style={{ 
              color: '#D1D5DB', 
              fontSize: 'clamp(10px, 1vw, 13px)', 
              margin: 0,
              fontWeight: '500'
            }}>
              {weather?.cidade || "Cuiabá"}
            </p>
          </div>
        </div>
      </div>

      {/* Cotações - Layout Horizontal */}
      <div style={{ 
        marginBottom: 'clamp(16px, 2.5vh, 24px)',
        flexShrink: 0
      }}>
        {currentQuote && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 'clamp(10px, 1.5vh, 14px) clamp(12px, 1.5vw, 16px)',
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            transition: 'all 0.5s ease-in-out',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 1vw, 12px)' }}>
              <span style={{ 
                fontWeight: 'bold', 
                fontSize: 'clamp(16px, 1.6vw, 20px)', 
                color: '#FFFFFF'
              }}>
                {currentQuote.codigo}
              </span>
              <span style={{ 
                color: '#D1D5DB', 
                fontSize: 'clamp(12px, 1.2vw, 15px)' 
              }}>
                {currentQuote.nome}
              </span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(6px, 0.8vw, 8px)',
              fontFamily: 'monospace',
              fontSize: 'clamp(16px, 1.6vw, 20px)',
              fontWeight: 'bold',
              color: currentQuote.variacao === 'alta' ? '#10B981' : 
                     currentQuote.variacao === 'baixa' ? '#EF4444' : '#9CA3AF'
            }}>
              <span style={{ fontSize: 'clamp(14px, 1.4vw, 16px)' }}>
                {currentQuote.variacao === 'alta' ? '↑' : currentQuote.variacao === 'baixa' ? '↓' : '−'}
              </span>
              <span>{currentQuote.valor}</span>
            </div>
          </div>
        )}
      </div>

      {/* Google News - Uma notícia por vez */}
      <div style={{ 
        flexShrink: 0,
        marginBottom: 'clamp(16px, 2.5vh, 24px)'
      }}>
        <div style={{
          backgroundColor: 'rgba(66, 133, 244, 0.15)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          borderRadius: '14px',
          padding: 'clamp(14px, 1.8vh, 18px)',
          boxShadow: '0 6px 24px rgba(66, 133, 244, 0.2)',
          border: '1px solid rgba(66, 133, 244, 0.3)',
          minHeight: 'clamp(100px, 12vh, 140px)'
        }}>
          <div style={{ marginBottom: 'clamp(10px, 1.5vh, 14px)' }}>
            <h3 style={{ 
              fontSize: 'clamp(16px, 1.6vw, 20px)', 
              fontWeight: 'bold', 
              color: '#4285F4', 
              margin: '0 0 6px 0',
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}>
              Google News - Tech
            </h3>
            <div style={{
              width: '100%',
              height: '2px',
              background: 'linear-gradient(90deg, #4285F4 0%, transparent 100%)'
            }}></div>
          </div>
          
          {currentNews ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              minHeight: 'clamp(60px, 8vh, 80px)'
            }}>
              <p style={{ 
                fontSize: 'clamp(14px, 1.4vw, 17px)', 
                fontWeight: '600', 
                lineHeight: '1.4',
                margin: 0,
                color: '#FFFFFF'
              }}>
                {currentNews.titulo}
              </p>
            </div>
          ) : (
            <div style={{ textAlign: 'center', paddingTop: 'clamp(20px, 3vh, 30px)' }}>
              <p style={{ color: '#9CA3AF', fontSize: 'clamp(12px, 1.2vw, 14px)', margin: 0 }}>
                Carregando notícias...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Status & Utilidade - Dois blocos compactos */}
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(12px, 1.8vh, 18px)',
        flex: 1,
        justifyContent: 'flex-end'
      }}>
        {/* Trânsito ao Redor - Um destino por vez */}
        <div style={{
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          borderRadius: '14px',
          padding: 'clamp(14px, 1.8vh, 18px)',
          boxShadow: '0 6px 24px rgba(16, 185, 129, 0.2)',
          border: '1px solid rgba(16, 185, 129, 0.3)'
        }}>
          <h3 style={{ 
            fontSize: 'clamp(16px, 1.6vw, 20px)', 
            fontWeight: 'bold', 
            color: '#10B981', 
            margin: '0 0 clamp(10px, 1.5vh, 14px) 0',
            letterSpacing: '0.5px',
            textTransform: 'uppercase'
          }}>
            🚗 Trânsito ao Redor
          </h3>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 'clamp(10px, 1.5vh, 12px)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            transition: 'all 0.5s ease'
          }}>
            <span style={{ 
              fontSize: 'clamp(16px, 1.6vw, 20px)', 
              fontWeight: '600',
              color: '#FFFFFF'
            }}>
              {currentTraffic.name}
            </span>
            <span style={{ 
              color: currentTraffic.color, 
              fontWeight: 'bold', 
              fontSize: 'clamp(18px, 1.8vw, 24px)' 
            }}>
              {currentTraffic.time}
            </span>
          </div>
        </div>

        {/* Agenda Yumit Hub */}
        <div style={{
          backgroundColor: 'rgba(255, 204, 0, 0.15)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          borderRadius: '14px',
          padding: 'clamp(14px, 1.8vh, 18px)',
          boxShadow: '0 6px 24px rgba(255, 204, 0, 0.2)',
          border: '1px solid rgba(255, 204, 0, 0.3)'
        }}>
          <h3 style={{ 
            fontSize: 'clamp(16px, 1.6vw, 20px)', 
            fontWeight: 'bold', 
            color: '#FFCC00', 
            margin: '0 0 clamp(10px, 1.5vh, 14px) 0',
            letterSpacing: '0.5px',
            textTransform: 'uppercase'
          }}>
            📅 Agenda Yumit Hub
          </h3>
          <div style={{ fontSize: 'clamp(14px, 1.4vw, 17px)', lineHeight: '1.6' }}>
            <div style={{ 
              marginBottom: 'clamp(8px, 1.2vh, 12px)',
              padding: 'clamp(8px, 1vh, 10px)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px'
            }}>
              <div style={{ color: '#FFCC00', fontWeight: 'bold', marginBottom: '4px', fontSize: 'clamp(12px, 1.2vw, 15px)' }}>
                Hoje
              </div>
              <div style={{ fontWeight: '600', color: '#FFFFFF', fontSize: 'clamp(14px, 1.4vw, 17px)' }}>
                Palestra Conecta Jovem
              </div>
              <div style={{ color: '#D1D5DB', fontSize: 'clamp(12px, 1.2vw, 14px)', marginTop: '2px' }}>
                16h • Sala 2
              </div>
            </div>
            
            <div style={{
              padding: 'clamp(8px, 1vh, 10px)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px'
            }}>
              <div style={{ color: '#9CA3AF', fontWeight: 'bold', marginBottom: '4px', fontSize: 'clamp(12px, 1.2vw, 15px)' }}>
                Amanhã
              </div>
              <div style={{ fontWeight: '600', color: '#E5E7EB', fontSize: 'clamp(14px, 1.4vw, 17px)' }}>
                Workshop de Inovação
              </div>
              <div style={{ color: '#9CA3AF', fontSize: 'clamp(12px, 1.2vw, 14px)', marginTop: '2px' }}>
                14h • Auditório
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}