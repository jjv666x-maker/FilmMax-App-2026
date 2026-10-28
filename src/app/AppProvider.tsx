import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAppStore } from '../store/rootStore';

interface AppContextValue {
  movies: any[];
  activeProfile: any;
  accounts: any[];
  favorites: Array<string | number>;
  recommendations: any[];
  isLoading: boolean;
  loadInitialData: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    movies,
    activeProfile,
    accounts,
    favorites,
    recommendations,
    isLoading,
    loadInitialData
  } = useAppStore();

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const value = {
    movies,
    activeProfile,
    accounts,
    favorites,
    recommendations,
    isLoading,
    loadInitialData
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextValue => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext must be used inside AppProvider');
  }
  return ctx;
};
