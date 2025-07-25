import { createContext, useContext } from 'react';
import type { ExtendedPurchase } from '~/types/purchase.type';
import type { UserProfile } from '~/types/user.type';
import { getAccessTokenFromLocalStorage, getProfileFromLocalStorage } from '~/utils/auth';

interface AppContextInterface {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  profile: UserProfile | null;
  setProfile: (profile: UserProfile | null) => void;
  extendedPurchases: ExtendedPurchase[];
  setExtendedPurchases: React.Dispatch<React.SetStateAction<ExtendedPurchase[]>>;
}

export const INITIAL_APP_STATE: AppContextInterface = {
  isAuthenticated: getAccessTokenFromLocalStorage() !== null,
  setIsAuthenticated: () => {},
  profile: getProfileFromLocalStorage(),
  setProfile: () => {},
  extendedPurchases: [],
  setExtendedPurchases: () => {}
};

export const AppContext = createContext<AppContextInterface>(INITIAL_APP_STATE);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
