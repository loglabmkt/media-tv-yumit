import React from "react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";

export default function QRCodeSlide({ config }) {
  if (!config) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      display: 'flex',
      alignItems: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: 'white',
      overflow: 'hidden'
    }}>
      {/* Elemento decorativo de fundo */}
      <div style={{
        position: 'absolute',
        top: '-200px',
        left: '-200px',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-150px',
        right: '30%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Coluna Esquerda — 55% */}
      <div style={{
        width: '55%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 'clamp(40px, 5vw, 100px)',
        paddingRight: 'clamp(20px, 3vw, 60px)'
      }}>
        {/* Label pequeno */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(59,130,246,0.2)',
            border: '1px solid rgba(59,130,246,0.4)',
            borderRadius: '30px',
            padding: '8px 20px',
            fontSize: 'clamp(14px, 1.4vw, 20px)',
            fontWeight: '600',
            color: '#93C5FD',
            marginBottom: 'clamp(24px, 3vh, 48px)',
            letterSpacing: '0.5px'
          }}>
            📱 {config.titulo || "Acesse agora"}
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          style={{
            fontSize: 'clamp(48px, 6.5vw, 112px)',
            fontWeight: '800',
            lineHeight: '1.05',
            margin: '0 0 clamp(20px, 2.5vh, 36px) 0',
            background: 'linear-gradient(135deg, #ffffff 0%, #CBD5E1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {config.headline}
        </motion.h1>

        {/* Subtítulo */}
        {config.subtitulo && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            style={{
              fontSize: 'clamp(20px, 2.2vw, 38px)',
              fontWeight: '400',
              color: '#94A3B8',
              margin: 0,
              lineHeight: '1.4',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {config.subtitulo}
          </motion.p>
        )}
      </div>

      {/* Coluna Direita — 45% */}
      <div style={{
        width: '45%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'clamp(16px, 2vh, 28px)'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          style={{
            background: 'white',
            borderRadius: '28px',
            padding: 'clamp(20px, 2.5vw, 40px)',
            boxShadow: '0 0 80px rgba(59,130,246,0.3), 0 30px 60px rgba(0,0,0,0.4)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          <QRCodeSVG
            value={config.link_qrcode}
            size={Math.min(window.innerHeight * 0.42, window.innerWidth * 0.28)}
            bgColor="#ffffff"
            fgColor="#0f172a"
            level="M"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7, ease: "easeOut" }}
          style={{
            fontSize: 'clamp(16px, 1.6vw, 26px)',
            color: '#64748B',
            margin: 0,
            textAlign: 'center',
            fontWeight: '500'
          }}
        >
          📷 Aponte a câmera do celular
        </motion.p>
      </div>
    </div>
  );
}