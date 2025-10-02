import React, { createContext, useState } from 'react';
import { IAuthContext, AuthContextValueType, AuthProviderType } from './types';

const authContextDefault: IAuthContext = {
  accessToken: '',
  id: 0,
  name: '',
  email: '',
  role: '',
}

const AuthContext = createContext<AuthContextValueType>({
  auth : authContextDefault,
  setAuth: () => undefined
});

export const AuthProvider = ({ children }) => {

  const [auth, setAuth] = useState(authContextDefault);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
