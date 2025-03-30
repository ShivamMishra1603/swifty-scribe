import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

export const generateLyrics = async (prompt, maxLength = 128, temperature = 0.8) => {
  try {
    const response = await axios.post(`${API_URL}/generate`, {
      prompt,
      max_length: maxLength,
      temperature
    });
    
    return response.data;
  } catch (error) {
    console.error('Error generating lyrics:', error);
    throw error;
  }
};

export const checkHealth = async () => {
  try {
    const response = await axios.get(`${API_URL}/health`);
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
}; 