import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NavVisibilityContextProps {
  showNav: boolean;
  setShowNav: (visible: boolean) => void;
}

const NavVisibilityContext = createContext<NavVisibilityContextProps | undefined>(undefined);

export const NavVisibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [showNav, setShowNav] = useState(true);
  return (
    <NavVisibilityContext.Provider value={{ showNav, setShowNav }}>
      {children}
    </NavVisibilityContext.Provider>
  );
};

export const useNavVisibility = (): NavVisibilityContextProps => {
  const context = useContext(NavVisibilityContext);
  if (!context) {
    throw new Error('useNavVisibility must be used within a NavVisibilityProvider');
  }
  return context;
};
