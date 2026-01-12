import { Quote } from '@/context/QuotesContext';

// Generate random background colors
const BACKGROUND_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
  '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B88B', '#AED6F1',
  '#A8E6CF', '#FFD3A5', '#C7CEEA', '#FFAAA5', '#FF8B94',
  '#A8DADC', '#F1C0E8', '#CFBAF0', '#90DBF4', '#A3C4F3',
];

function getRandomColor(): string {
  return BACKGROUND_COLORS[Math.floor(Math.random() * BACKGROUND_COLORS.length)];
}

interface ZenQuoteResponse {
  q: string; // quote text
  a: string; // author
}

export async function fetchQuotes(category?: string): Promise<Quote[]> {
  try {
    // ZenQuotes API endpoint
    const url = 'https://zenquotes.io/api/quotes';
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch quotes');
    }

    const data: ZenQuoteResponse[] = await response.json();

    // Transform API response to Quote format
    const quotes: Quote[] = data.map((item, index) => ({
      id: `quote-${Date.now()}-${index}`,
      quote: item.q,
      author: item.a,
      category: category,
      backgroundColor: getRandomColor(),
    }));

    return quotes;
  } catch (error) {
    console.error('Error fetching quotes:', error);
    // Return empty array on error
    return [];
  }
}

export async function fetchNextQuotes(category?: string): Promise<Quote[]> {
  // For now, fetch another batch (API doesn't support pagination)
  // In a real scenario, you might want to cache and manage pagination
  return fetchQuotes(category);
}
