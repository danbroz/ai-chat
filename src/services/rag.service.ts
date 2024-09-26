// src/services/rag.service.ts

export async function getRagResponse(query: string) {
    const response = await fetch('/api/rag', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`RAG API error: ${errorText}`);
    }
  
    const data = await response.json();
    return data;
  }
  