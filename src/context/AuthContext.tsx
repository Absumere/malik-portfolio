'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSession, SessionProvider } from 'next-auth/react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role?: string;
  bio?: string;
  socialLinks?: Array<{ platform: string; url: string }>;
  preferences?: {
    theme?: string;
    newsletter?: boolean;
    notifications?: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAdmin: false,
});

function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const upsertUser = useMutation(api.users.upsertUser);
  const getUser = useQuery(api.users.getUser, 
    session?.user?.email ? { email: session.user.email } : "skip"
  );

  useEffect(() => {
    const syncUser = async () => {
      if (session?.user && !user) {
        const { name, email, image } = session.user;
        if (!email) return;

        // Sync with Convex
        await upsertUser({
          name: name || 'Anonymous',
          email,
          image: image || undefined,
          provider: 'github',
          providerId: email,
          createdAt: Date.now(),
        });
      }
    };

    syncUser();
  }, [session, user, upsertUser]);

  useEffect(() => {
    if (getUser) {
      setUser(getUser);
    }
  }, [getUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: status === 'loading',
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthContextProvider>{children}</AuthContextProvider>
    </SessionProvider>
  );
}

export const useAuth = () => useContext(AuthContext);
