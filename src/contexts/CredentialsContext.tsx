import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useCreateConfig, useUpdateConfig } from '@/hooks/useConfig';
import { useQuery } from '@tanstack/react-query';
import { UserService } from '@/services/userService';
import { ConfigService } from '@/services/configService';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';

// Define the credentials type
export type Credentials = {
  webhookProxyUrl: string;
  appId: string;
  webhookSecret: string;
  privateKey: string;
  githubClientId: string;
  githubClientSecret: string;
  submitted: boolean;
};

// Define initial empty credentials
const initialCredentials: Credentials = {
  webhookProxyUrl: '',
  appId: '',
  webhookSecret: '',
  privateKey: '',
  githubClientId: '',
  githubClientSecret: '',
  submitted: false
};

// Define the credentials context type
type CredentialsContextType = {
  credentials: Credentials;
  updateCredentials: (field: keyof Credentials, value: string) => void;
  submitCredentials: (onSuccess: () => void, onError: (error: Error) => void) => void;
  resetCredentials: () => void;
  isSubmitted: boolean;
};

// Create the credentials context
const CredentialsContext = createContext<CredentialsContextType | undefined>(undefined);

// Credentials provider props
type CredentialsProviderProps = {
  children: ReactNode;
};

// Create the credentials provider
export const CredentialsProvider: React.FC<CredentialsProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [credentials, setCredentials] = useState<Credentials>(initialCredentials);
  const [configId, setConfigId] = useState<string | null>(null);
  const { mutate: createConfig } = useCreateConfig();
  const { mutate: updateConfig } = useUpdateConfig();
  const navigate = useNavigate();

  // Fetch configs for the user from API
  const { data: configs, refetch } = useQuery({
    queryKey: ['user', 'configs'],
    queryFn: ConfigService.getConfigs,
    enabled: !!user,
  });

  // Sync credentials and configId when configs change
  React.useEffect(() => {
    if (configs) {
      setConfigId(configs.id);
      // Initialize credentials with existing values or empty strings
      // Note: `configs` from /me only contains id, createdAt, updatedAt.
      // Other fields for Credentials type must be initialized from initialCredentials
      // or fetched separately if needed.
      setCredentials({
        ...initialCredentials,
        submitted: true,
      });
    } else {
      setCredentials(initialCredentials);
      setConfigId(null);
    }
  }, [configs]);

  useEffect(() => {
    // Only redirect to /credentials if user is logged in, no config exists, and not already on /credentials
    if (user && !configs && window.location.pathname !== '/credentials') {
      navigate('/credentials');
    }
  }, [configs, user, navigate]);

  // Update credentials in state
  const updateCredentials = (field: keyof Credentials, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  };

  // Submit credentials to API (create or alter config)
  const submitCredentials = (onSuccess: () => void, onError: (error: Error) => void) => {
    const { submitted, ...restOfCredentials } = credentials;

    // Create a new object containing only the fields expected by the backend DTOs
    const payloadToSend = {
      webhookProxyUrl: restOfCredentials.webhookProxyUrl,
      appId: restOfCredentials.appId,
      webhookSecret: restOfCredentials.webhookSecret,
      privateKey: restOfCredentials.privateKey,
      githubClientId: restOfCredentials.githubClientId,
      githubClientSecret: restOfCredentials.githubClientSecret,
    };

    if (configId) {
      updateConfig({ id: configId, data: payloadToSend }, { onSuccess, onError });
    } else {
      createConfig(payloadToSend, { onSuccess, onError });
    }
  };

  // Reset credentials (delete config is not specified, so just clear state)
  const resetCredentials = () => {
    setCredentials(initialCredentials);
    setConfigId(null);
  };

  return (
    <CredentialsContext.Provider value={{
      credentials,
      updateCredentials,
      submitCredentials,
      resetCredentials,
      isSubmitted: credentials.submitted
    }}>
      {children}
    </CredentialsContext.Provider>
  );
};

// Custom hook to use the credentials context
export const useCredentials = () => {
  const context = useContext(CredentialsContext);
  if (context === undefined) {
    throw new Error('useCredentials must be used within a CredentialsProvider');
  }
  return context;
};
