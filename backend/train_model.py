import sys
import re
import os
import csv
import numpy as np
from collections import Counter
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import TensorDataset, DataLoader
from transformers import GPT2TokenizerFast
from app.models.rnn_model import RecurrentLM

def chunk_tokens(tokens, start_token_id, end_token_id, pad_token_id, chunk_len=128):
    num_tokens = len(tokens)
    inner_chunk_len = chunk_len - 2
    num_chunks = (num_tokens + inner_chunk_len - 1) // inner_chunk_len
    chunks = torch.full((num_chunks, chunk_len), pad_token_id, dtype=torch.long)

    for i in range(num_chunks):
        chunks[i, 0] = start_token_id
        start_idx = i * inner_chunk_len
        end_idx = min(start_idx + inner_chunk_len, num_tokens)
        chunk_size = end_idx - start_idx
        chunks[i, 1:1+chunk_size] = torch.tensor(tokens[start_idx:end_idx])
        if i == num_chunks - 1 or chunk_size == inner_chunk_len:
            chunks[i, 1+chunk_size] = end_token_id

    return chunks

def train_model(songs_file_path, output_model_path, epochs=15):
    # Check for CUDA availability
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")
    
    # Initialize tokenizer
    tokenizer = GPT2TokenizerFast.from_pretrained("openai-community/gpt2")
    tokenizer.add_special_tokens({'pad_token': '<|endoftext|>'})
    tokenizer.add_special_tokens({
        'bos_token': '<s>',
        'eos_token': '</s>',
    })
    
    # Load and process data
    print("Loading and processing data...")
    with open(songs_file_path, newline='') as file:
        reader = csv.reader(file)
        data = list(reader)[1:-5]  # Skip header and last few rows
    
    # Process lyrics
    all_chunks = []
    for song in data:
        lyrics = song[2]
        lyrics = re.sub(r'\n\[[\x20-\x7f]+\]', '', lyrics)
        token_ids = tokenizer.encode(lyrics)

        start_token_id = tokenizer.convert_tokens_to_ids('<s>')
        end_token_id = tokenizer.convert_tokens_to_ids('</s>')
        pad_token_id = tokenizer.convert_tokens_to_ids('<|endoftext|>')

        song_chunks = chunk_tokens(token_ids, start_token_id, end_token_id, pad_token_id, chunk_len=64)
        all_chunks.append(song_chunks)

    all_chunks_tensor = torch.cat(all_chunks, dim=0)
    X = all_chunks_tensor[:, :-1]
    y = all_chunks_tensor[:, 1:]
    
    # Create dataset and dataloader
    dataset = TensorDataset(X, y)
    dataloader = DataLoader(dataset, batch_size=32, shuffle=True, drop_last=True)
    
    # Initialize model
    vocab_size = len(tokenizer)
    embed_dim = 64
    rnn_hidden_dim = 1024
    model = RecurrentLM(vocab_size, embed_dim, rnn_hidden_dim)
    model = model.to(device)
    
    # Define loss function and optimizer
    pad_token_id = tokenizer.convert_tokens_to_ids('<|endoftext|>')
    criterion = nn.CrossEntropyLoss(ignore_index=pad_token_id)
    optimizer = optim.Adam(model.parameters(), lr=0.0007)
    
    # Training loop
    print("Starting training...")
    losses = []
    
    for epoch in range(epochs):
        total_loss = 0
        model.train()
        
        for batch_idx, (batch_x, batch_y) in enumerate(dataloader):
            batch_x = batch_x.to(device)
            batch_y = batch_y.to(device)
            
            logits, _ = model(batch_x)
            
            b, s, v = logits.shape
            logits = logits.reshape(b * s, v)
            targets = batch_y.reshape(b * s)
            loss = criterion(logits, targets)
            
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()
            
            total_loss += loss.item()
            
            if batch_idx % 100 == 0:
                print(f"Epoch {epoch+1}/{epochs}, Batch {batch_idx}/{len(dataloader)}, Loss: {loss.item():.4f}")
        
        avg_loss = total_loss / len(dataloader)
        losses.append(avg_loss)
        print(f"Epoch {epoch+1}/{epochs} completed, Average Loss: {avg_loss:.4f}")
    
    # Save the model
    os.makedirs(os.path.dirname(output_model_path), exist_ok=True)
    torch.save(model.state_dict(), output_model_path)
    print(f"Model saved to {output_model_path}")
    
    return model, tokenizer

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print('Usage: python train_model.py songs_file.csv [output_model_path]')
        sys.exit(1)
    
    songs_file_path = sys.argv[1]
    output_model_path = sys.argv[2] if len(sys.argv) > 2 else "app/models/model.pth"
    
    train_model(songs_file_path, output_model_path) 