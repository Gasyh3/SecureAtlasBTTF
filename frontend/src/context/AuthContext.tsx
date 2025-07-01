import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { AuthContextType, User, RegisterRequest } from '../types/auth';
import { postLogin, postRegister, getCurrentUser, updateUserProfile } from '../services/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier le token au chargement
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('auth_user');

      if (storedToken) {
        setToken(storedToken);
        
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
            // Vérifier si le token est toujours valide
            await getCurrentUser();
          } catch (error) {
            console.error('Token invalide, déconnexion');
            logout();
          }
        } else {
          try {
            const userData = await getCurrentUser();
            setUser(userData);
            localStorage.setItem('auth_user', JSON.stringify(userData));
          } catch (error) {
            console.error('Erreur récupération utilisateur');
            logout();
          }
        }
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Connexion avec email ou username
      const authResponse = await postLogin({ username: email, password });
      
      // Stocker le token
      setToken(authResponse.access_token);
      localStorage.setItem('auth_token', authResponse.access_token);
      
      // Récupérer les informations utilisateur
      const userData = await getCurrentUser();
      setUser(userData);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      throw new Error(
        error.response?.data?.detail || 'Erreur de connexion'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Inscription
      await postRegister(data);
      
      // Connexion automatique après inscription
      await login(data.email, data.password);
      
    } catch (error: any) {
      console.error('Erreur d\'inscription:', error);
      throw new Error(
        error.response?.data?.detail || 'Erreur d\'inscription'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    try {
      const updatedUser = await updateUserProfile(data);
      setUser(updatedUser);
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    } catch (error: any) {
      console.error('Erreur mise à jour profil:', error);
      throw new Error(
        error.response?.data?.detail || 'Erreur de mise à jour'
      );
    }
  };

  const logout = (): void => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  const isAuthenticated = !!user && !!token;

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 