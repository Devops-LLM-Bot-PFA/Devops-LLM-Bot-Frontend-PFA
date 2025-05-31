import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCredentials } from '@/contexts/CredentialsContext';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import FileUploader from '@/components/ui/FileUploader';
import { useToast } from '@/hooks/use-toast';

const CredentialsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { credentials, updateCredentials, submitCredentials, isSubmitted } = useCredentials();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle file upload
  const handlePrivateKeyUpload = (fileContent: string) => {
    try {
      if (!fileContent || typeof fileContent !== 'string' || fileContent.trim().length === 0) {
        throw new Error('Private Key is required and must be a string.');
      }
      const lines = fileContent.split(/\r?\n/).map((line) => line.trim());
      const escapedKey = lines.join('\n');
      updateCredentials('privateKey', escapedKey);
      toast({
        title: "File Uploaded",
        description: "Private key file has been uploaded successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to parse the private key file.",
        variant: "destructive"
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate webhookProxyUrl as a URL
    try {
      new URL(credentials.webhookProxyUrl);
    } catch {
      toast({
        title: "Validation Error",
        description: "Webhook Proxy URL must be a valid URL.",
        variant: "destructive"
      });
      return;
    }
    // Validate string fields and max length
    const stringFields = [
      { key: 'appId', label: 'App ID' },
      { key: 'webhookSecret', label: 'Webhook Secret' },
      { key: 'githubClientId', label: 'GitHub Client ID' },
      { key: 'githubClientSecret', label: 'GitHub Client Secret' },
    ];
    for (const { key, label } of stringFields) {
      const value = credentials[key as keyof typeof credentials];
      if (!value || typeof value !== 'string' || value.length === 0) {
        toast({
          title: "Validation Error",
          description: `${label} is required and must be a string.`,
          variant: "destructive"
        });
        return;
      }
      if (value.length > 200) {
        toast({
          title: "Validation Error",
          description: `${label} must be at most 200 characters.`,
          variant: "destructive"
        });
        return;
      }
    }
    // Validate privateKey
    if (!credentials.privateKey || typeof credentials.privateKey !== 'string' || credentials.privateKey.trim().length === 0) {
      toast({
        title: "Validation Error",
        description: "Private Key is required and must be a string.",
        variant: "destructive"
      });
      return;
    }
    if (credentials.privateKey.length > 5000) { // Increased validation limit for private key after stripping newlines
      toast({
        title: "Validation Error",
        description: "Private Key must be at most 5000 characters.",
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);
    try {
      submitCredentials(
        () => {
          toast({
            title: "Credentials Saved",
            description: "Your credentials have been saved successfully.",
          });
        },
        (error: any) => {
          toast({
            title: "Error",
            description: error.message || 'Failed to save credentials.',
            variant: "destructive",
          });
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout showFooter={false}>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <CardTitle className="text-2xl">Set Up Your DevOps LLM Bot</CardTitle>
            <CardDescription>
              Please provide the required credentials to create your Kubernetes instance
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="webhookProxyUrl">WEBHOOK_PROXY_URL</Label>
                  <Input
                    id="webhookProxyUrl"
                    placeholder="https://example.com/webhook"
                    value={credentials.webhookProxyUrl}
                    onChange={(e) => updateCredentials('webhookProxyUrl', e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">The URL where your webhook proxy is hosted</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="appId">APP_ID</Label>
                    <Input
                      id="appId"
                      placeholder="12345"
                      value={credentials.appId}
                      onChange={(e) => updateCredentials('appId', e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">Your GitHub App ID</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="webhookSecret">WEBHOOK_SECRET</Label>
                    <Input
                      id="webhookSecret"
                      type="password"
                      placeholder="••••••••"
                      value={credentials.webhookSecret}
                      onChange={(e) => updateCredentials('webhookSecret', e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">Your GitHub App webhook secret</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>PRIVATE_KEY</Label>
                  <FileUploader
                    onFileSelect={handlePrivateKeyUpload}
                    accept=".pem,.key,.txt"
                    className="mt-1"
                  />
                  <p className="text-sm text-muted-foreground">Upload the PEM file containing your private key (e.g., devops-llm-bot-app.2025-05-30.private-key.pem)</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="githubClientId">GITHUB_CLIENT_ID</Label>
                    <Input
                      id="githubClientId"
                      placeholder="Iv1.abcdef123456"
                      value={credentials.githubClientId}
                      onChange={(e) => updateCredentials('githubClientId', e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">Your GitHub OAuth App client ID</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="githubClientSecret">GITHUB_CLIENT_SECRET</Label>
                    <Input
                      id="githubClientSecret"
                      type="password"
                      placeholder="••••••••"
                      value={credentials.githubClientSecret}
                      onChange={(e) => updateCredentials('githubClientSecret', e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">Your GitHub OAuth App client secret</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
              >
                Back
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Continue'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CredentialsPage;
