'use client';

import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Mail, Wallet, ArrowRight } from 'lucide-react';
import TestnetBadge from '@/components/testnet-badge';

export default function AuthPage() {
  const { login, authenticated, ready } = usePrivy();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Redirect to dashboard if already authenticated
  if (ready && authenticated) {
    router.push('/dashboard');
    return null;
  }

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await login();
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-4">
      <div className="absolute top-4 right-4">
        <TestnetBadge />
      </div>
      
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Shield className="mx-auto h-12 w-12 text-violet-500 mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">ZKredit</h1>
          <p className="text-zinc-400">Privacy-Preserving Financial Passport for AI Agents</p>
        </div>
        
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white text-xl">Sign In or Create Account</CardTitle>
            <CardDescription className="text-zinc-400">
              Connect with your wallet or email to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700"
              size="lg"
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Connecting...
                </div>
              ) : (
                <div className="flex items-center">
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect Wallet
                </div>
              )}
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-700"></span>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-zinc-900 px-2 text-zinc-400">or</span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full border-zinc-700 text-white hover:bg-zinc-800"
              size="lg"
              onClick={handleLogin}
              disabled={isLoading}
            >
              <Mail className="mr-2 h-4 w-4" />
              Continue with Email
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <p className="text-xs text-zinc-500 text-center">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardFooter>
        </Card>
        
        <div className="mt-6 text-center">
          <Button 
            variant="link" 
            className="text-zinc-400 hover:text-violet-400"
            onClick={() => router.push('/')}
          >
            Back to Home <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
