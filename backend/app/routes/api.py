from flask import Blueprint, request, jsonify
import os
from app.models.rnn_model import SwiftyModel

api_bp = Blueprint('api', __name__)

# Initialize model
model = None
try:
    model = SwiftyModel(model_path=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'app/models/model.pth'))
except Exception as e:
    print(f"Error initializing model: {e}")

@api_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'model_loaded': model is not None
    })

@api_bp.route('/generate', methods=['POST'])
def generate_lyrics():
    """Generate lyrics based on input text"""
    data = request.get_json()
    
    if not data or 'prompt' not in data:
        return jsonify({
            'error': 'No prompt provided'
        }), 400
    
    prompt = data['prompt']
    max_length = data.get('max_length', 128)
    temperature = data.get('temperature', 0.8)
    
    if not model:
        return jsonify({
            'error': 'Model not loaded properly'
        }), 500
    
    try:
        # Generate lyrics
        raw_text = model.generate_with_sampling(prompt, max_len=max_length, temperature=temperature)
        formatted_text = model.format_as_song(raw_text)
        
        return jsonify({
            'prompt': prompt,
            'raw_text': raw_text,
            'formatted_text': formatted_text
        })
    except Exception as e:
        return jsonify({
            'error': f'Error generating lyrics: {str(e)}'
        }), 500 