
import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthPage: React.FC = () => {
  // Redirect to the new sign-in page
  return <Navigate to="/signin" replace />;
};

export default AuthPage;
