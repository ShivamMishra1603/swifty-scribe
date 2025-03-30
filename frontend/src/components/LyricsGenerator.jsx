import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import ReactTypingEffect from 'react-typing-effect';
import { generateLyrics } from '../services/api';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  gap: 2rem;
`;

const InputContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StyledInput = styled.input`
  padding: 1rem 1.5rem;
  font-size: 1.2rem;
  border-radius: 8px;
  border: 1px solid #e1e1e1;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: #8B0000;
    box-shadow: 0 2px 5px rgba(139, 0, 0, 0.1);
  }
`;

const SubmitButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  background-color: #8B0000;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  margin-top: 1rem;
  width: 100%;
  
  &:hover {
    background-color: #6B0000;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ResultContainer = styled(motion.div)`
  width: 100%;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const ResultHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const ResultTitle = styled.h3`
  font-size: 1.5rem;
  margin: 0;
  color: #8B0000;
`;

const LyricsContent = styled.div`
  font-family: 'Playfair Display', serif;
  line-height: 1.8;
  font-size: 1.1rem;
  white-space: pre-line;
  flex-grow: 1;
`;

const LoadingIndicator = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  z-index: 2;
`;

const CopyButton = styled(motion.button)`
  background: none;
  border: none;
  font-size: 0.9rem;
  color: #8B0000;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  
  &:hover {
    background-color: rgba(139, 0, 0, 0.05);
  }
`;

const LoaderText = styled.p`
  margin-top: 1rem;
  font-size: 1rem;
  color: #666;
`;

const ErrorMessage = styled(motion.div)`
  padding: 1rem;
  background-color: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 8px;
  color: #f5222d;
  margin-top: 1rem;
  width: 100%;
`;

const HelpText = styled.p`
  font-size: 0.9rem;
  color: #888;
  margin-top: 0.5rem;
  text-align: center;
  max-width: 70%;
`;

const LyricsGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!prompt) {
      setError('Please enter a starting phrase');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      // Use fixed values for maxLength and temperature
      const data = await generateLyrics(prompt, 128, 0.8);
      setResult(data);
    } catch (err) {
      setError('Failed to generate lyrics. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const copyToClipboard = () => {
    if (!result) return;
    
    navigator.clipboard.writeText(result.formatted_text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Container>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <InputContainer>
          <StyledInput
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a starting phrase (e.g., 'I remember when we')"
            disabled={loading}
          />
          
          <SubmitButton
            type="submit"
            disabled={loading || !prompt}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Generating...' : 'Generate Lyrics'}
          </SubmitButton>
        </InputContainer>
      </form>
      
      {error && (
        <ErrorMessage
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          {error}
        </ErrorMessage>
      )}
      
      {!result && !loading && (
        <HelpText>
          Enter a phrase to start your song, then watch as AI generates Taylor Swift-style lyrics just for you!
        </HelpText>
      )}
      
      {(result || loading) && (
        <ResultContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {loading ? (
            <LoadingIndicator
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                style={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%', 
                  border: '3px solid rgba(139, 0, 0, 0.2)', 
                  borderTop: '3px solid #8B0000' 
                }}
              />
              <LoaderText>
                <ReactTypingEffect
                  text={[
                    "Channeling Taylor's creativity...",
                    "Crafting catchy choruses...",
                    "Writing heartfelt verses...",
                    "Composing emotional bridges...",
                  ]}
                  speed={80}
                  eraseSpeed={80}
                  typingDelay={500}
                  eraseDelay={2000}
                />
              </LoaderText>
            </LoadingIndicator>
          ) : (
            <>
              <ResultHeader>
                <ResultTitle>Your Swifty Scribe Song</ResultTitle>
                <CopyButton 
                  onClick={copyToClipboard}
                  whileTap={{ scale: 0.95 }}
                >
                  {copied ? 'Copied! ✓' : 'Copy to clipboard'}
                </CopyButton>
              </ResultHeader>
              <LyricsContent>
                {result?.formatted_text}
              </LyricsContent>
            </>
          )}
        </ResultContainer>
      )}
    </Container>
  );
};

export default LyricsGenerator; 