import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { checkHealth } from './services/api';
import LyricsGenerator from './components/LyricsGenerator';
import Header from './components/Header';
import BackgroundDecoration from './components/BackgroundDecoration';

const AppContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 2rem;
`;

const Footer = styled.footer`
  text-align: center;
  margin-top: 4rem;
  padding: 1rem;
  color: #666;
  font-size: 0.9rem;
`;

const StatusBadge = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  background-color: ${props => props.isOnline ? '#4caf50' : '#f44336'};
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 100;
`;

const StatusDot = styled.span`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.isOnline ? '#ffffff' : '#ffffff'};
`;

function App() {
  const [modelStatus, setModelStatus] = useState({ loaded: false, checking: true });

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const data = await checkHealth();
        setModelStatus({ loaded: data.model_loaded, checking: false });
      } catch (error) {
        setModelStatus({ loaded: false, checking: false });
      }
    };

    checkServerStatus();
    const interval = setInterval(checkServerStatus, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <BackgroundDecoration />
      <AppContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Header />
        
        <MainContent>
          <LyricsGenerator />
        </MainContent>
        
        <Footer>
          <p>SwiftyScribe © {new Date().getFullYear()} | Powered by Taylor Swift's lyrical genius and machine learning</p>
        </Footer>
        
        {!modelStatus.checking && (
          <StatusBadge 
            isOnline={modelStatus.loaded}
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <StatusDot isOnline={modelStatus.loaded} />
            {modelStatus.loaded ? 'AI model ready' : 'AI model offline'}
          </StatusBadge>
        )}
      </AppContainer>
    </>
  );
}

export default App; 