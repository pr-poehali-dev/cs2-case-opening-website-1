import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  username: string;
  email: string;
  isAdmin: boolean;
  steamId?: string;
  avatar?: string;
  tradeUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, email: string, steamId?: string, avatar?: string) => void;
  logout: () => void;
  setTradeUrl: (tradeUrl: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('cs2_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (username: string, email: string, steamId?: string, avatar?: string) => {
    const newUser: User = {
      username,
      email,
      isAdmin: email.includes('admin'),
      steamId,
      avatar,
    };
    setUser(newUser);
    localStorage.setItem('cs2_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cs2_user');
  };

  const setTradeUrl = (tradeUrl: string) => {
    if (user && !user.tradeUrl) {
      const updatedUser = { ...user, tradeUrl };
      setUser(updatedUser);
      localStorage.setItem('cs2_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, setTradeUrl }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}