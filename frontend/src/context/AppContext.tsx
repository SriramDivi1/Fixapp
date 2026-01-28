import React, { createContext, useState, ReactNode } from 'react';

// Define the context type
interface AppContextType {
  // Add your context values here
  // Example:
  // user: User | null;
  // setUser: (user: User | null) => void;
}

// Create context with undefined default (will be provided by provider)
export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppContextProviderProps {
  children: ReactNode;
}

/**
 * App Context Provider
 * 
 * NOTE: Consider migrating to Zustand or React Query for state management
 * as recommended in the implementation plan.
 */
const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
  // Add your state here
  const [state, setState] = useState({});

  const value: AppContextType = {
    // Provide your context values
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;

/**
 * Custom hook to use the AppContext
 */
export const useAppContext = (): AppContextType => {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};
