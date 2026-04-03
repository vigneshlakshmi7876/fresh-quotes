import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  ScrollView,
  Text,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import * as Sharing from 'expo-sharing';
import { useQuotes, Quote } from '@/context/QuotesContext';
import { fetchQuotes, fetchNextQuotes } from '@/services/zenQuotesApi';
import { AnimatedQuoteText } from '@/components/AnimatedQuoteText';
import { ThemedView } from '@/components/ThemedView';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CATEGORIES = ['Motivational', 'Life', 'Love', 'Success', 'Happiness', 'Wisdom'];

export function Home() {
  const { likeQuote, unlikeQuote, addToFavourite, removeFromFavourite, likedQuotes, favouriteQuotes } = useQuotes();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const loadQuotes = useCallback(async (categories?: string[]) => {
    setLoading(true);
    try {
      const fetchedQuotes = await fetchQuotes();
      setQuotes(fetchedQuotes);
    } catch (error) {
      console.error('Error loading quotes:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMoreQuotes = useCallback(async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const newQuotes = await fetchNextQuotes();
      setQuotes((prev) => [...prev, ...newQuotes]);
    } catch (error) {
      console.error('Error loading more quotes:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore]);

  useEffect(() => {
    loadQuotes();
  }, [loadQuotes]);

  const handleShare = async (quote: Quote) => {
    try {
      const shareText = `"${quote.quote}"\n— ${quote.author}`;
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(shareText);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleLike = (quote: Quote) => {
    const isLiked = likedQuotes.some((q) => q.id === quote.id);
    if (isLiked) {
      unlikeQuote(quote.id);
    } else {
      likeQuote(quote);
    }
  };

  const handleFavourite = (quote: Quote) => {
    const isFavourite = favouriteQuotes.some((q) => q.id === quote.id);
    if (isFavourite) {
      removeFromFavourite(quote.id);
    } else {
      addToFavourite(quote);
    }
  };

  const handleCategoryFilter = () => {
    setShowCategoryModal(true);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleCategoryClear = () => {
    setSelectedCategories([]);
  };

  const handleCategoryApply = async () => {
    setShowCategoryModal(false);
    setLoading(true);
    // Refetch quotes with selected categories
    await loadQuotes(selectedCategories);
  };

  const renderQuoteCard = ({ item, index }: { item: Quote; index: number }) => {
    const isLiked = likedQuotes.some((q) => q.id === item.id);
    const isFavourite = favouriteQuotes.some((q) => q.id === item.id);

    return (
      <View style={[styles.quoteCard, { backgroundColor: item.backgroundColor }]}>
        {/* Quote Text */}
        <View style={styles.quoteContainer}>
          <AnimatedQuoteText text={item.quote} style={styles.quoteText} />
        </View>

        {/* Bottom Left - Author */}
        <View style={styles.bottomLeft}>
          <View style={styles.avatarContainer}>
            <MaterialIcons name="person" size={40} color="#FFFFFF" />
          </View>
          <Text style={styles.authorText}>{item.author}</Text>
        </View>

        {/* Bottom Right - Actions */}
        <View style={styles.bottomRight}>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleLike(item)}>
            <MaterialCommunityIcons name={isLiked ? "thumb-up" : "thumb-up-outline"} size={32} color={isLiked ? '#FF6B6B' : '#FFFFFF'} />
            {/* <MaterialIcons
              name={isLiked ? 'thumb-up' : 'thumb-up-outline'}
              size={32}
              color={isLiked ? '#FF6B6B' : '#FFFFFF'}
            /> */}
            <Text style={styles.actionLabel}>Like</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => handleFavourite(item)}>
            <MaterialIcons
              name={isFavourite ? 'favorite' : 'favorite-border'}
              size={32}
              color={isFavourite ? '#FF6B6B' : '#FFFFFF'}
            />
            <Text style={styles.actionLabel}>Favourite</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => handleShare(item)}>
            <MaterialIcons name="share" size={32} color="#FFFFFF" />
            <Text style={styles.actionLabel}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleCategoryFilter}>
            <MaterialIcons name="more-vert" size={32} color="#FFFFFF" />
            <Text style={styles.actionLabel}>More</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const onEndReached = () => {
    if (!loadingMore) {
      loadMoreQuotes();
    }
  };

  if (loading && quotes.length === 0) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={quotes}
        renderItem={renderQuoteCard}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        getItemLayout={(data, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
      />

      {loadingMore && (
        <View style={styles.loadingMore}>
          <ActivityIndicator size="small" color="#FFFFFF" />
        </View>
      )}

      {/* Category Filter Modal */}
      <Modal
        visible={showCategoryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Categories</Text>
            <ScrollView style={styles.categoryList}>
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryItem,
                    selectedCategories.includes(category) && styles.categoryItemSelected,
                  ]}
                  onPress={() => handleCategorySelect(category)}>
                  <MaterialIcons
                    name={selectedCategories.includes(category) ? 'check-box' : 'check-box-outline-blank'}
                    size={24}
                    color={selectedCategories.includes(category) ? '#FF6B6B' : '#000000'}
                  />
                  <Text style={styles.categoryText}>{category}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleCategoryClear}>
                <Text style={styles.modalButtonText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.modalButtonPrimary]} onPress={handleCategoryApply}>
                <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quoteCard: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  quoteContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  quoteText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
    lineHeight: 40,
  },
  bottomLeft: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bottomRight: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    alignItems: 'center',
    gap: 20,
  },
  actionButton: {
    alignItems: 'center',
    gap: 5,
  },
  actionLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  loadingMore: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000000',
    textAlign: 'center',
  },
  categoryList: {
    maxHeight: 300,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#F5F5F5',
  },
  categoryItemSelected: {
    backgroundColor: '#FFE5E5',
  },
  categoryText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#000000',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: '#FF6B6B',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  modalButtonTextPrimary: {
    color: '#FFFFFF',
  },
});
