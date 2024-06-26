import { createContext, useState, ReactNode, useContext } from "react";

interface UserContextProps {
  userDetails: User | null;
  setUserDetails: (details: User | null) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userDetails, setUserDetails] = useState<User | null>({
    id: "667564dded84c75890b28e39",
    type: "student",
    email: "asd@asd.com",
    name: "mosh",
  });

  return (
    <UserContext.Provider value={{ userDetails, setUserDetails }}>
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
