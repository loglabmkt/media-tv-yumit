import React from "react";

export default function PlayerSlide({ slide }) {
  if (!slide) return null;

  const containerStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#000'
  };

  if (slide.tipo === "imagem") {
    return (
      <div style={containerStyle}>
        <img
          src={slide.conteudo_url}
          alt={slide.titulo}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center'
          }}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>
    );
  }
  
  if (slide.tipo === "video") {
    return (
      <div style={containerStyle}>
        <video
          src={slide.conteudo_url}
          autoPlay
          muted
          loop
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center'
          }}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>
    );
  }
  
  if (slide.tipo === "youtube") {
    const videoId = slide.conteudo_url.split('/').pop() || slide.conteudo_url;
    return (
      <div style={{
        ...containerStyle,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          maxWidth: '177.78vh', /* 16:9 aspect ratio */
          maxHeight: '56.25vw',
        }}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&loop=1&fs=0&disablekb=1&iv_load_policy=3&cc_load_policy=0&playlist=${videoId}&vq=hd1080&showinfo=0&playsinline=1`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
              pointerEvents: 'none'
            }}
            allow="autoplay; encrypted-media; accelerometer"
            allowFullScreen={false}
            loading="eager"
          />
        </div>
      </div>
    );
  }

  return <div style={containerStyle}></div>;
}