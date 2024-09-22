import React, { createContext, useState, useContext } from 'react';

const EmailContext = createContext();

export const useEmail = () => useContext(EmailContext);

export const EmailProvider = ({ children }) => {
  const [email, setEmail] = useState(localStorage.getItem('email') || '');

  const updateEmail = (newEmail) => {
    localStorage.removeItem('email');
    localStorage.setItem('email', newEmail);
    setEmail(newEmail);
  };

  return (
    <EmailContext.Provider value={{ email, updateEmail }}>
      {children}
    </EmailContext.Provider>
  );
};
