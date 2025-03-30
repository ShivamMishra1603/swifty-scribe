import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const HeaderContainer = styled.header`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled(motion.h1)`
  font-size: 3.5rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(45deg, #ff6b6b, #6b66ff);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  text-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.2rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Title
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        SwiftyScribe
      </Title>
      <Subtitle
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Turn your ideas into Taylor Swift-inspired lyrics with the power of AI
      </Subtitle>
    </HeaderContainer>
  );
};

export default Header; 