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
  border-radius: 50px;
  border: 2px solid #e1e1e1;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: #722ed1;
    box-shadow: 0 4px 15px rgba(114, 46, 209, 0.2);
  }
`;

const SliderContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SliderLabel = styled.label`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-size: 0.9rem;
  color: #666;
`;

const Slider = styled.input`
  width: 100%;
  -webkit-appearance: none;
  height: 10px;
  border-radius: 5px;
  background: linear-gradient(to right, #722ed1, #13c2c2);
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
  }
`;

const SubmitButton = styled(motion.button)`
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(45deg, #722ed1, #2f54eb);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  margin-top: 1rem;
  width: 100%;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ResultContainer = styled(motion.div)`
  width: 100%;
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  position: relative;
  backdrop-filter: blur(5px);
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
  background: linear-gradient(45deg, #722ed1, #2f54eb);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
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
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  z-index: 2;
`;

const CopyButton = styled(motion.button)`
  background: none;
  border: none;
  font-size: 0.9rem;
  color: #722ed1;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  
  &:hover {
    background-color: rgba(114, 46, 209, 0.1);
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
  border-radius: 10px;
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
  const [temperature, setTemperature] = useState(0.8);
  const [maxLength, setMaxLength] = useState(128);
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
      const data = await generateLyrics(prompt, maxLength, temperature);
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
          
          <SliderContainer>
            <SliderLabel>
              <span>Creativity Level: {temperature.toFixed(1)}</span>
              <span>{temperature < 0.5 ? 'More Predictable' : temperature > 0.9 ? 'Very Creative' : 'Balanced'}</span>
            </SliderLabel>
            <Slider
              type="range"
              min="0.1"
              max="1.5"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              disabled={loading}
            />
          </SliderContainer>
          
          <SliderContainer>
            <SliderLabel>
              <span>Song Length: {maxLength}</span>
              <span>{maxLength < 100 ? 'Short' : maxLength > 180 ? 'Long' : 'Medium'}</span>
            </SliderLabel>
            <Slider
              type="range"
              min="64"
              max="256"
              step="8"
              value={maxLength}
              onChange={(e) => setMaxLength(parseInt(e.target.value))}
              disabled={loading}
            />
          </SliderContainer>
          
          <SubmitButton
            type="submit"
            disabled={loading || !prompt}
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.02 }}
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
          Enter a phrase to start your song, adjust the creativity level and length,
          then watch as AI generates Taylor Swift-style lyrics just for you!
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
                  border: '3px solid rgba(114, 46, 209, 0.2)', 
                  borderTop: '3px solid #722ed1' 
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
                <ResultTitle>Your SwiftyScribe Song</ResultTitle>
                <CopyButton 
                  onClick={copyToClipboard}
                  whileHover={{ scale: 1.05 }}
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