import React, { useState, useRef, useEffect } from 'react';
import './RotatingWheel.css';

const RotatingWheel = () => {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [lastAngle, setLastAngle] = useState(0);
  const [focusedItem, setFocusedItem] = useState(1); 
  const [targetRotation, setTargetRotation] = useState(0); 
  const wheelRef = useRef(null);


  const getAngleFromCenter = (clientX, clientY, centerX, centerY) => {
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    return Math.atan2(deltaY, deltaX) * (180 / Math.PI);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    
    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const angle = getAngleFromCenter(e.clientX, e.clientY, centerX, centerY);
    setLastAngle(angle);
  };


  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const currentAngle = getAngleFromCenter(e.clientX, e.clientY, centerX, centerY);
    let deltaAngle = currentAngle - lastAngle;

    if (deltaAngle > 180) deltaAngle -= 360;
    if (deltaAngle < -180) deltaAngle += 360;
    
    const newRotation = rotation + deltaAngle;
    setRotation(newRotation);
    setTargetRotation(newRotation); 
    setLastAngle(currentAngle);
    
    updateFocusedItemRealTime(newRotation);
  };


  const handleMouseUp = () => {
    setIsDragging(false);
    snapToNearestPosition();
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    setIsDragging(true);
    
    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const angle = getAngleFromCenter(touch.clientX, touch.clientY, centerX, centerY);
    setLastAngle(angle);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const currentAngle = getAngleFromCenter(touch.clientX, touch.clientY, centerX, centerY);
    let deltaAngle = currentAngle - lastAngle;
    
    if (deltaAngle > 180) deltaAngle -= 360;
    if (deltaAngle < -180) deltaAngle += 360;
    
    const newRotation = rotation + deltaAngle;
    setRotation(newRotation);
    setTargetRotation(newRotation); 
    setLastAngle(currentAngle);
    
    updateFocusedItemRealTime(newRotation);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    snapToNearestPosition();
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, lastAngle, rotation]);


  const updateFocusedItemRealTime = (currentRotation) => {
    const normalizedRotation = ((currentRotation % 360) + 360) % 360;
    
 
    let closestItem = 1;
    let minDistance = Infinity;
    
    satelliteItems.forEach((item) => {
      const itemAngle = (item.offset + normalizedRotation) % 360;
      const distanceToTop = Math.min(
        Math.abs(itemAngle - 270),
        Math.abs(itemAngle - 270 + 360),
        Math.abs(itemAngle - 270 - 360)
      );
      
      if (distanceToTop < minDistance) {
        minDistance = distanceToTop;
        closestItem = item.id;
      }
    });
    
    setFocusedItem(closestItem);
  };


  const snapToNearestPosition = () => {
    const snapAngle = 51.43;
    const normalizedRotation = ((rotation % 360) + 360) % 360;

    const nearestSnapIndex = Math.round(normalizedRotation / snapAngle);
    const nearestSnapAngle = (nearestSnapIndex * snapAngle) % 360;
    
    
    const rotationDifference = nearestSnapAngle - normalizedRotation;
    let adjustedDifference = rotationDifference;
    
 
    if (adjustedDifference > 180) adjustedDifference -= 360;
    if (adjustedDifference < -180) adjustedDifference += 360;
    
    const newTargetRotation = rotation + adjustedDifference;
    setTargetRotation(newTargetRotation);
    
    
    const normalizedTarget = ((newTargetRotation % 360) + 360) % 360;
    

    let focusedId = 1;
    satelliteItems.forEach((item) => {
      const itemAngle = (item.offset + normalizedTarget) % 360;

      const distanceToTop = Math.min(
        Math.abs(itemAngle - 270),
        Math.abs(itemAngle - 270 + 360),
        Math.abs(itemAngle - 270 - 360)
      );
      
      if (distanceToTop < 36) { 
        focusedId = item.id;
      }
    });
    
    setFocusedItem(focusedId);
  };


  useEffect(() => {
    if (!isDragging && Math.abs(rotation - targetRotation) > 0.1) {
      const animationStep = () => {
        setRotation(prevRotation => {
          const difference = targetRotation - prevRotation;
          if (Math.abs(difference) < 0.1) {
            return targetRotation;
          }
          return prevRotation + difference * 0.15; 
        });
      };
      
      const animationFrame = requestAnimationFrame(animationStep);
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [rotation, targetRotation, isDragging]);

const getPrivadoText = (focusedItemId) => {
  switch(focusedItemId) {
    case 1: return "privado";
    case 2: return "privado 2";
    case 3: return "privado 3";
    case 4: return "privado 4";
    case 5: return "privado 5";
    case 6: return "privado 6";
    case 7: return "privado 7";
    default: return "privado";
  }
};
const satelliteItems = [
  { id: 1, title: 'Bosque Privado', radius: 340, offset: 270 },        
  { id: 2, title: 'Grupos Reducidos', radius: 340, offset: 321.43 },   
  { id: 3, title: 'Piscina Termal', radius: 340, offset: 12.86 },      
  { id: 4, title: 'Experiencia Exclusiva', radius: 340, offset: 64.29 }, 
  { id: 5, title: 'Prioridad: Seguridad', radius: 340, offset: 115.72 }, 
  { id: 6, title: 'Vistas Únicas', radius: 340, offset: 167.15 },     
  { id: 7, title: 'Naturaleza Viva', radius: 340, offset: 218.58 },    
];
  return (
    <div className="page-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          {/* Logo */}
          <div className="logo">
            <h1>SUPER QUADS</h1>
          </div>
          
          {/* Navigation */}
          <nav className="navigation">
  <a href="#tour" className="nav-link">Tour</a>
  <span className="nav-divider">|</span>
  <a href="#galeria" className="nav-link">Galería de Aventuras</a>
  <span className="nav-divider">|</span>
  <a href="#acerca" className="nav-link">Acerca de</a>
</nav>
          
          {/* Social Media & Reservation */}
          <div className="header-actions">
            <div className="social-media">
              <a href="#" className="social-link whatsapp">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                </svg>
              </a>
              <a href="#" className="social-link tiktok">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>
              <a href="#" className="social-link instagram">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.40z"/>
                </svg>
              </a>
            </div>
          <a href="#reservar" className="reservar-btn">
  RESERVAR
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="10" fill="white"/>
    <path d="M8 12h8" stroke="black" strokeWidth="2" strokeLinecap="round"/>
    <path d="M14 8l4 4-4 4" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
</a>
          </div>
        </div>


        
        {/* Title positioned below header */}
        <div className="header-title">
          <h1 className="header-main-title">
            Recorrido dentro de
            <br />
            nuestro bosque
            <br />
            {getPrivadoText(focusedItem)}
          </h1>
          <p className="header-subtitle">SUPER QUADS</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="rotating-wheel-container">
          <div className="wheel-area" ref={wheelRef}>
            
            {/* Red orbit circle with dots */}
            <div className="orbit-circle">
              {satelliteItems.map((item) => {
                const angle = rotation + item.offset;
                const dotX = Math.cos((angle * Math.PI) / 180) * 267;
                const dotY = Math.sin((angle * Math.PI) / 180) * 265;
                
                return (
                  <div
                    key={`dot-${item.id}`}
                    className={`orbit-dot ${focusedItem === item.id ? 'focused' : ''}`}
                    style={{
                      left: `calc(50% + ${dotX}px)`,
                      top: `calc(50% + ${dotY}px)`,
                    }}
                  />
                );
              })}
            </div>
            
{/* Satellite Items */}
{satelliteItems.map((item) => {
  const angle = rotation + item.offset;
  const x = Math.cos((angle * Math.PI) / 180) * item.radius;
  const y = Math.sin((angle * Math.PI) / 180) * item.radius;
  const isFocused = focusedItem === item.id;
  
  
  const tiltAngle = item.offset + 90 + rotation;
  
  return (
    <div
      key={item.id}
      className={`satellite-item ${isFocused ? 'focused' : ''}`}
      style={{
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        transform: `translate(-50%, -50%) rotate(${tiltAngle}deg) ${isFocused ? 'scale(2.3)' : 'scale(0.9)'}`,
        zIndex: isFocused ? 10 : 1,
        transition: 'transform 0.1s ease, z-index 0.1s ease'
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className="satellite-card">
        <div className="satellite-image" style={{
          backgroundImage: 'url(/images/personas.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          <div className="satellite-image-overlay"></div>
        </div>
        <div className="satellite-text">
          <p className="satellite-title">{item.title}</p>
        </div>
      </div>
    </div>
  );
})}



            {/* Central Wheel */}
            <div
              className="central-wheel"
              style={{
                transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
              }}
            >
              <div className="wheel-inner" style={{
                backgroundImage: 'url(/images/rueda.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}>
                {/* Optional */}
                <div className="wheel-overlay"></div>
              </div>
            </div>
          </div>
        </div>
      </main>


      {/* Galería de Aventuras Section */}
      <section className="galeria-section">
        <div className="galeria-container">
          <div className="galeria-content">
            <div className="galeria-text">
              <h2 className="galeria-title">GALERÍA DE AVENTURAS</h2>
              <button className="ver-galeria-btn">
                Ver galería
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="10" fill="white"/>
                  <path d="M8 12h8" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M14 8l4 4-4 4" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="galeria-images">
              <div className="galeria-image galeria-image-1" style={{
                backgroundImage: 'url(/images/personas.jpeg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}>
              </div>
              <div className="galeria-image galeria-image-2" style={{
                backgroundImage: 'url(/images/personas.jpeg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}>
              </div>
              <div className="galeria-image galeria-image-3" style={{
                backgroundImage: 'url(/images/personas.jpeg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}>
              </div>
              <div className="galeria-image galeria-image-4" style={{
                backgroundImage: 'url(/images/personas.jpeg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};



export default RotatingWheel;