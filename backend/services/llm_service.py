# backend/services/llm_service.py

import os
from openai import OpenAI
from ..config import OPENAI_API_KEY

class LLMService:
    def __init__(self):
        # Initialize the OpenAI client with your API key
        if not OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY not set. Please add your key to backend/config.py")
        self.client = OpenAI(api_key=OPENAI_API_KEY)

    def get_reasoning(self, query: str, context: str) -> str:
        """
        Uses an external LLM API to provide reasoning based on context.
        """
        # A well-structured prompt for the LLM
        prompt = (
            f"You are a helpful and knowledgeable health assistant. Your task is to provide a concise explanation for a health-related decision or event. "
            f"Use the provided context to form your answer. If the context doesn't contain the answer, state that. "
            f"The user's query is: '{query}'.\n\n"
            f"Relevant Chat Context:\n{context}\n\n"
            f"Provide a concise, direct, and empathetic explanation in a single paragraph."
        )

        try:
            # Make the API call
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",  # You can choose a more powerful model like gpt-4 if needed
                messages=[
                    {"role": "system", "content": "You are a helpful and knowledgeable health assistant."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=256,
            )

            reasoning = response.choices[0].message.content.strip()
            return reasoning

        except Exception as e:
            print(f"Error calling OpenAI API: {e}")
            return "Apologies, I could not generate a reason at this time. The LLM API call failed."

# Instantiate the service
llm_service = LLMService()
