import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
`;

const MusicNote = styled(motion.div)`
  position: absolute;
  width: ${props => props.size || '30px'};
  height: ${props => props.size || '30px'};
  opacity: ${props => props.opacity || 0.2};
  color: ${props => props.color || '#722ed1'};
  font-size: ${props => props.size || '30px'};
  
  &:before {
    content: '♪';
    font-size: inherit;
  }
`;

const Star = styled(motion.div)`
  position: absolute;
  width: ${props => props.size || '20px'};
  height: ${props => props.size || '20px'};
  opacity: ${props => props.opacity || 0.3};
  
  &:before {
    content: '★';
    position: absolute;
    color: ${props => props.color || '#f56a00'};
    font-size: inherit;
  }
`;

const BackgroundDecoration = () => {
  const musicNotes = Array(10).fill().map((_, i) => ({
    id: `note-${i}`,
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    size: `${Math.random() * 20 + 20}px`,
    opacity: Math.random() * 0.4 + 0.1,
    color: ['#722ed1', '#2f54eb', '#1890ff', '#fa8c16'][Math.floor(Math.random() * 4)],
    delay: Math.random() * 5,
  }));
  
  const stars = Array(15).fill().map((_, i) => ({
    id: `star-${i}`,
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    size: `${Math.random() * 15 + 10}px`,
    opacity: Math.random() * 0.4 + 0.1,
    color: ['#faad14', '#f5222d', '#eb2f96', '#fa8c16'][Math.floor(Math.random() * 4)],
    delay: Math.random() * 8,
  }));

  return (
    <BackgroundContainer>
      {musicNotes.map(note => (
        <MusicNote
          key={note.id}
          style={{ top: note.y, left: note.x }}
          size={note.size}
          opacity={note.opacity}
          color={note.color}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ 
            scale: [0.5, 1, 0.8, 1], 
            opacity: [0, note.opacity, note.opacity, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 8, 
            delay: note.delay,
            repeatType: 'reverse' 
          }}
        />
      ))}
      
      {stars.map(star => (
        <Star
          key={star.id}
          style={{ top: star.y, left: star.x }}
          size={star.size}
          opacity={star.opacity}
          color={star.color}
          initial={{ scale: 0.2, opacity: 0 }}
          animate={{ 
            scale: [0.2, 1, 0.5, 1], 
            opacity: [0, star.opacity, star.opacity/2, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 10, 
            delay: star.delay,
            repeatType: 'reverse' 
          }}
        />
      ))}
    </BackgroundContainer>
  );
};

export default BackgroundDecoration;