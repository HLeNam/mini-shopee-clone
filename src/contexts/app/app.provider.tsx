import { useState } from 'react';
import { AppContext, INITIAL_APP_STATE } from '~/contexts/app/app.context';
import type { UserProfile } from '~/types/user.type';

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(INITIAL_APP_STATE.isAuthenticated);
  const [profile, setProfile] = useState<UserProfile | null>(INITIAL_APP_STATE.profile);

  return (
    <AppContext.Provider value={{ isAuthenticated, setIsAuthenticated, profile, setProfile }}>
      {children}
    </AppContext.Provider>
  );
};
