import { createContext, useState, ReactNode, useContext, useEffect } from "react";
import { getToken, decodeToken, removeToken } from "../utils/jwt-cookies"

interface UserContextProps {
  userDetails: User | null;
  setUserDetails: (details: User | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userDetails, setUserDetails] = useState<User | null>(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      const decodedUser = decodeToken(token);
      if (decodedUser) {
        setUserDetails(decodedUser);
      } else {
        removeToken();
      }
    }
  }, []);

  const logout = () => {
    removeToken();
    setUserDetails(null);
  };

  return (
    <UserContext.Provider value={{ userDetails, setUserDetails, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};