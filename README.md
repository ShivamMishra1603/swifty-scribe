# SwiftyScribe: Taylor Swift-Inspired Lyrics Generator

SwiftyScribe is an AI-powered application that generates Taylor Swift-style song lyrics using a recurrent neural network (RNN) trained on Taylor Swift's song lyrics corpus.

## Features

- **AI-Powered Lyrics Generation**: Generates original lyrics in the style of Taylor Swift
- **Interactive UI**: Modern React frontend with animations and responsive design
- **Customizable Generation**: Adjust creativity and song length to your liking
- **RESTful API**: Flask backend with easy-to-use endpoints for lyrics generation

## Tech Stack

### Backend
- Flask (Python web framework)
- PyTorch (Deep learning library)
- Transformers (NLP library from Hugging Face)
- RNN-based neural language model

### Frontend
- React
- Styled Components
- Framer Motion (for animations)
- Axios (for API requests)

## Project Structure

```
swifty-scribe/
├── backend/              # Flask API
│   ├── app/              # Application code
│   │   ├── models/       # ML models
│   │   └── routes/       # API routes
│   ├── venv/             # Python virtual environment
│   ├── requirements.txt  # Python dependencies
│   ├── train_model.py    # Script to train the model
│   └── wsgi.py           # WSGI entry point
│
├── frontend/             # React frontend
│   ├── public/           # Static files
│   ├── src/              # React components and logic
│   │   ├── components/   # UI components
│   │   ├── pages/        # Page components
│   │   ├── assets/       # Images, fonts, etc.
│   │   └── services/     # API service layer
│   └── package.json      # Node.js dependencies
│
└── songs.csv             # Dataset of Taylor Swift lyrics
```

## Getting Started

### Prerequisites

- Python 3.8+ with pip
- Node.js 14+ with npm
- Taylor Swift lyrics dataset in CSV format

### Backend Setup

1. Create and activate a virtual environment:
   ```
   cd backend
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Unix/MacOS:
   source venv/bin/activate
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Train the model:
   ```
   python train_model.py ../songs.csv
   ```

4. Start the Flask server:
   ```
   python wsgi.py
   ```

### Frontend Setup

1. Install dependencies:
   ```
   cd frontend
   npm install
   ```

2. Start the development server:
   ```
   npm start
   ```

3. The application will be available at http://localhost:3000

## API Endpoints

- `GET /api/health` - Check if the API and model are running
- `POST /api/generate` - Generate lyrics based on a prompt
  - Parameters:
    - `prompt` (string): The starting text for generation
    - `max_length` (int, optional): Maximum length of generated text
    - `temperature` (float, optional): Controls randomness of generation

## Model Architecture

The lyrics generation model is based on a recurrent neural network (RNN) with GRU cells. It uses word embeddings and is trained on a corpus of Taylor Swift's lyrics to capture her unique writing style and themes.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- This project is created for educational purposes only
- Inspired by the lyrics and musical style of Taylor Swift
- Uses publicly available data