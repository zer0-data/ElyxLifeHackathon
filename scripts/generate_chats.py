# --- scripts/generate_chats.py ---
# This script generates the 8-month chat data for all members.

import datetime
import json
import random
import re
import torch
import os
from transformers import AutoTokenizer, AutoModelForCausalLM
from tqdm.auto import tqdm

# --- Model Initialization ---
model = None
tokenizer = None

def initialize_model():
    global model, tokenizer
    if model and tokenizer:
        return
    model_id = "deepseek-ai/deepseek-llm-7b-chat"
    try:
        tokenizer = AutoTokenizer.from_pretrained(model_id)
        model = AutoModelForCausalLM.from_pretrained(
            model_id,
            device_map="auto",
            torch_dtype=torch.bfloat16,
            trust_remote_code=True
        )
    except Exception as e:
        print(f"Failed to initialize model. Error: {e}")
        raise

def call_llm_for_conversation(prompt: str) -> str:
    initialize_model()
    messages = [{"role": "user", "content": prompt}]
    input_tensor = tokenizer.apply_chat_template(messages, add_generation_prompt=True, return_tensors="pt").to(model.device)
    outputs = model.generate(
        input_tensor, max_new_tokens=256, do_sample=True, temperature=0.7, top_p=0.9,
        eos_token_id=tokenizer.eos_token_id, pad_token_id=tokenizer.pad_token_id
    )
    result_text = tokenizer.decode(outputs[0][input_tensor.shape[1]:], skip_special_tokens=True)
    return result_text

# --- Simulation Logic ---
ELYX_TEAM = {
    "Ruby": {"role": "Concierge / Orchestrator", "voice": "Empathetic, organized, and proactive. She anticipates needs and confirms every action. Her job is to remove all friction from the client's life."},
    "Dr. Warren": {"role": "Medical Strategist", "voice": "Authoritative, precise, and scientific. He explains complex medical topics in clear, understandable terms."},
    "Advik": {"role": "Performance Scientist", "voice": "Analytical, curious, and pattern-oriented. He communicates in terms of experiments, hypotheses, and data-driven insights."},
    "Carla": {"role": "Nutritionist", "voice": "Practical, educational, and focused on behavioral change. She explains the 'why' behind every nutritional choice."},
    "Rachel": {"role": "PT / Physiotherapist", "voice": "Direct, encouraging, and focused on form and function. She is the expert on the body's physical structure and capacity."},
    "Neel": {"role": "Concierge Lead / Relationship Manager", "voice": "Strategic, reassuring, and focused on the big picture. He provides context and reinforces the long-term vision."}
}

DAYS_PER_MONTH = 30
AVG_MEMBER_QUERIES_PER_WEEK = 5

def get_relevant_expert(event_context: list[str]) -> str:
    context_str = " ".join(event_context).lower()
    if any(keyword in context_str for keyword in ["onboarding", "schedule", "travel", "logistics", "reminder"]): return "Ruby"
    if any(keyword in context_str for keyword in ["test results", "diagnostic", "blood panel", "chronic condition", "medication", "cardio"]): return "Dr. Warren"
    if any(keyword in context_str for keyword in ["wearable", "data", "sleep", "recovery", "hrv", "stress"]): return "Advik"
    if any(keyword in context_str for keyword in ["nutrition", "diet", "food", "supplement"]): return "Carla"
    if any(keyword in context_str for keyword in ["exercise", "workout", "mobility", "physical", "training", "pt"]): return "Rachel"
    return "Neel"

def generate_member_journey(member: dict, start_date: datetime.date, days: int, month: int, journey_config: dict) -> list[dict]:
    journey = []
    all_senders = list(ELYX_TEAM.keys()) + [member["name"]]
    monthly_events = journey_config.get(str(month), {}).get("events", [])
    
    for day_num in range(days):
        current_date = start_date + datetime.timedelta(days=day_num)
        
        event_context = []
        if day_num == 0 and monthly_events:
            event_context.append(f"Major events this month: {', '.join(monthly_events)}.")
        
        # Randomly select a member query
        if random.random() < AVG_MEMBER_QUERIES_PER_WEEK / 7.0:
            event_context.append(f"{member['name']} is asking a question based on a recent event or online research.")
        
        if not event_context: continue

        expert_name = get_relevant_expert(event_context)
        expert_info = ELYX_TEAM[expert_name]

        context_str = ". ".join(event_context)
        prompt = (f"Generate a brief, realistic WhatsApp-style conversation for {member['name']}. "
                  f"Format as: 'Sender: Message'. Use the full name. "
                  f"Member Persona: {member['name']}, {member['age']}, {member['occupation']} from {member['residence']}. "
                  f"Chronic Condition: {member['chronic_condition']}. "
                  f"Today's Context: {context_str}. "
                  f"The initial query is handled by {expert_name}. Your task is to generate a conversation where {expert_name} speaks with the voice: '{expert_info['voice']}' and {member['name']} responds naturally. "
                  f"Ensure the conversation has at least 2 messages and flows realistically.")
        
        raw_conversation = call_llm_for_conversation(prompt)
        conversation_lines = re.findall(r'^(.*?):\s*(.*)$', raw_conversation, re.MULTILINE)
        
        for sender, text in conversation_lines:
            sender_name = sender.strip()
            if sender_name in all_senders:
                journey.append({
                    "date": current_date.isoformat(),
                    "sender": sender_name,
                    "role": ELYX_TEAM.get(sender_name, {}).get("role", "Member"),
                    "text": text.strip()
                })
    return journey

def generate_chats_for_months(member, start_date, months, journey_config):
    all_chats = []
    for m in range(1, months + 1):
        print(f"\n--- Generating Month {m} for {member['name']} ---")
        month_start = start_date + datetime.timedelta(days=(m - 1) * DAYS_PER_MONTH)
        month_chats = generate_member_journey(
            member, month_start, DAYS_PER_MONTH, month=m, journey_config=journey_config
        )
        all_chats.extend(month_chats)
    return all_chats

if __name__ == "__main__":
    pass
