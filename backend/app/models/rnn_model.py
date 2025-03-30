import numpy as np
import torch
import torch.nn as nn
from transformers import GPT2TokenizerFast

class RecurrentLM(nn.Module):
    def __init__(self, vocab_size, embed_dim, rnn_hidden_dim):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, embed_dim)
        self.gru = nn.GRU(embed_dim, rnn_hidden_dim, batch_first=True)
        self.layer_norm = nn.LayerNorm(rnn_hidden_dim)
        self.fc = nn.Linear(rnn_hidden_dim, vocab_size)

    def forward(self, x):
        embedded = self.embedding(x)
        output, hidden_state = self.gru(embedded)
        output = self.layer_norm(output)
        logits = self.fc(output)
        return logits, hidden_state

    def stepwise_forward(self, x, prev_hidden_state):
        embedded = self.embedding(x)
        output, hidden_state = self.gru(embedded, prev_hidden_state)
        output = self.layer_norm(output)
        logits = self.fc(output)
        return logits, hidden_state

class SwiftyModel:
    def __init__(self, model_path='app/models/model.pth'):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.tokenizer = GPT2TokenizerFast.from_pretrained("openai-community/gpt2")
        self.tokenizer.add_special_tokens({'pad_token': '<|endoftext|>'})
        self.tokenizer.add_special_tokens({
            'bos_token': '<s>',
            'eos_token': '</s>',
        })
        
        # Model hyperparameters
        self.vocab_size = len(self.tokenizer)
        self.embed_dim = 64
        self.rnn_hidden_dim = 1024
        
        # Initialize model
        self.model = RecurrentLM(self.vocab_size, self.embed_dim, self.rnn_hidden_dim)
        
        try:
            self.model.load_state_dict(torch.load(model_path, map_location=self.device))
            print(f"Model loaded from {model_path}")
        except Exception as e:
            print(f"Error loading model: {e}")
            print("Model will need to be trained before use")
        
        self.model.to(self.device)
        self.model.eval()
    
    def generate_with_sampling(self, start_phrase, max_len=64, temperature=0.8):
        """Generate text using random sampling with temperature"""
        if not start_phrase.startswith("<s>"):
            start_phrase = "<s>" + start_phrase
            
        input_ids = self.tokenizer.encode(start_phrase)
        generated_tokens = input_ids.copy()
        input_tensor = torch.tensor(input_ids, dtype=torch.long).unsqueeze(0).to(self.device)

        _, hidden_state = self.model(input_tensor)
        current_token = torch.tensor([[input_ids[-1]]], dtype=torch.long).to(self.device)

        for _ in range(max_len - len(input_ids)):
            logits, hidden_state = self.model.stepwise_forward(current_token, hidden_state)
            logits = logits[0, 0] / temperature

            probs = torch.softmax(logits, dim=0)
            next_token_id = torch.multinomial(probs, 1).item()
            generated_tokens.append(next_token_id)
            current_token = torch.tensor([[next_token_id]], dtype=torch.long).to(self.device)

            eos_token_id = self.tokenizer.convert_tokens_to_ids('</s>')
            pad_token_id = self.tokenizer.convert_tokens_to_ids('<|endoftext|>')
            if next_token_id == eos_token_id or next_token_id == pad_token_id:
                break

        generated_text = self.tokenizer.decode(generated_tokens)
        # Clean up the generated text by removing special tokens
        generated_text = generated_text.replace("<s>", "").replace("</s>", "").strip()
        
        return generated_text
    
    def format_as_song(self, text):
        """Format the generated text as song lyrics with line breaks"""
        # Split on punctuation and add line breaks
        for punct in ['.', '!', '?', ',']:
            text = text.replace(punct, punct + '\n')
        
        # Remove excessive newlines
        while '\n\n' in text:
            text = text.replace('\n\n', '\n')
            
        # Add some structure - every 4 lines, add an extra newline to create stanzas
        lines = text.split('\n')
        formatted_lines = []
        for i, line in enumerate(lines):
            formatted_lines.append(line)
            if (i + 1) % 4 == 0:
                formatted_lines.append('')  # Add an empty line every 4 lines
                
        return '\n'.join(formatted_lines) 