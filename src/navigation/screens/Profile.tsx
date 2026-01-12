import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useQuotes, Quote } from '@/context/QuotesContext';
import { AnimatedQuoteText } from '@/components/AnimatedQuoteText';
import { ThemedView } from '@/components/ThemedView';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type TabType = 'liked' | 'favourites';

export function Profile() {
  const { likedQuotes, favouriteQuotes } = useQuotes();
  const [activeTab, setActiveTab] = useState<TabType>('liked');

  const currentQuotes = activeTab === 'liked' ? likedQuotes : favouriteQuotes;

  const renderQuoteCard = ({ item }: { item: Quote }) => {
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
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      {/* Top Section - User Info */}
      <View style={styles.topSection}>
        <View style={styles.avatarContainerLarge}>
          <MaterialIcons name="person" size={60} color="#FFFFFF" />
        </View>
        <Text style={styles.userName}>User</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'liked' && styles.tabActive]}
          onPress={() => setActiveTab('liked')}>
          <Text style={[styles.tabText, activeTab === 'liked' && styles.tabTextActive]}>
            Liked ({likedQuotes.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'favourites' && styles.tabActive]}
          onPress={() => setActiveTab('favourites')}>
          <Text style={[styles.tabText, activeTab === 'favourites' && styles.tabTextActive]}>
            Favourites ({favouriteQuotes.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Quotes List */}
      {currentQuotes.length > 0 ? (
        <FlatList
          data={currentQuotes}
          renderItem={renderQuoteCard}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          getItemLayout={(data, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialIcons
            name={activeTab === 'liked' ? 'thumb-up-outline' : 'favorite-border'}
            size={64}
            color="#CCCCCC"
          />
          <Text style={styles.emptyText}>
            No {activeTab === 'liked' ? 'liked' : 'favourite'} quotes yet
          </Text>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  topSection: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
  },
  avatarContainerLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#FF6B6B',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#CCCCCC',
  },
  tabTextActive: {
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
  quoteCard: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - 250, // Account for top section and tabs
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
    bottom: 40,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#CCCCCC',
    marginTop: 20,
  },
});
