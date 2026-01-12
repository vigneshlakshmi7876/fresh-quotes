import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Quote {
  id: string;
  quote: string;
  author: string;
  category?: string;
  backgroundColor: string;
}

interface QuotesContextType {
  likedQuotes: Quote[];
  favouriteQuotes: Quote[];
  likeQuote: (quote: Quote) => void;
  unlikeQuote: (id: string) => void;
  addToFavourite: (quote: Quote) => void;
  removeFromFavourite: (id: string) => void;
}

const QuotesContext = createContext<QuotesContextType | undefined>(undefined);

export function QuotesProvider({ children }: { children: ReactNode }) {
  const [likedQuotes, setLikedQuotes] = useState<Quote[]>([]);
  const [favouriteQuotes, setFavouriteQuotes] = useState<Quote[]>([]);

  const likeQuote = (quote: Quote) => {
    setLikedQuotes((prev) => {
      // Check if already liked
      if (prev.some((q) => q.id === quote.id)) {
        return prev;
      }
      return [...prev, quote];
    });
  };

  const unlikeQuote = (id: string) => {
    setLikedQuotes((prev) => prev.filter((q) => q.id !== id));
  };

  const addToFavourite = (quote: Quote) => {
    setFavouriteQuotes((prev) => {
      // Check if already in favourites
      if (prev.some((q) => q.id === quote.id)) {
        return prev;
      }
      return [...prev, quote];
    });
  };

  const removeFromFavourite = (id: string) => {
    setFavouriteQuotes((prev) => prev.filter((q) => q.id !== id));
  };

  return (
    <QuotesContext.Provider
      value={{
        likedQuotes,
        favouriteQuotes,
        likeQuote,
        unlikeQuote,
        addToFavourite,
        removeFromFavourite,
      }}>
      {children}
    </QuotesContext.Provider>
  );
}

export function useQuotes() {
  const context = useContext(QuotesContext);
  if (context === undefined) {
    throw new Error('useQuotes must be used within a QuotesProvider');
  }
  return context;
}
