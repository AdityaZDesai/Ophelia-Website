"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/auth-client";
import type { Personality } from "@/types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPersonality: Personality | null;
  onSuccess: () => void;
  initialMode?: "signin" | "signup";
  allowModeSwitch?: boolean;
}

export function AuthModal({
  isOpen,
  onClose,
  selectedPersonality,
  onSuccess,
  initialMode = "signup",
  allowModeSwitch = true,
}: AuthModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    }
  }, [initialMode, isOpen]);

  const getRedirectForChannel = (channel?: string | null) => {
    switch (channel) {
      case "imessage":
        return "/imessage-chat";
      case "whatsapp":
        return "/whatsapp-chat";
      default:
        return "/chat";
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log(`[AuthModal] handleSubmit started - mode: ${mode}, email: ${email}`);

    try {
      if (mode === "signup") {
        // New user signing up - always go to onboarding
        console.log(`[AuthModal] Starting sign up for email: ${email}`);
        const result = await signUp.email({
          email,
          password,
          name,
        });
        
        console.log(`[AuthModal] Sign up result:`, { 
          success: !result.error, 
          error: result.error?.message,
          hasData: !!result.data 
        });
        
        if (result.error) {
          console.error(`[AuthModal] Sign up failed:`, result.error);
          setError(result.error.message || "Failed to sign up");
          return;
        }

        console.log(`[AuthModal] Sign up successful, storing personality:`, selectedPersonality?.id);
        // Store selected personality in session storage for onboarding
        if (selectedPersonality) {
          sessionStorage.setItem("selectedPersonality", selectedPersonality.id);
        }

        console.log(`[AuthModal] Redirecting new user to /onboarding`);
        onSuccess();
        router.push("/onboarding");
      } else {
        // Existing user signing in - check if they've completed onboarding
        console.log(`[AuthModal] Starting sign in for email: ${email}`);
        const result = await signIn.email({
          email,
          password,
        });
        
        console.log(`[AuthModal] Sign in result:`, { 
          success: !result.error, 
          error: result.error?.message,
          hasData: !!result.data 
        });
        
        if (result.error) {
          console.error(`[AuthModal] Sign in failed:`, result.error);
          setError(result.error.message || "Failed to sign in");
          return;
        }

        console.log(`[AuthModal] Sign in successful, waiting for session to be available...`);
        // Check if user has already completed onboarding from database
        // Wait a bit for session to be available
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log(`[AuthModal] Checking user onboarding status from database...`);
        try {
          const statusResponse = await fetch("/api/user/status");
          console.log(`[AuthModal] Status API response:`, { 
            ok: statusResponse.ok, 
            status: statusResponse.status 
          });
          
          if (statusResponse.ok) {
            const status = await statusResponse.json();
            console.log(`[AuthModal] User status from database:`, {
              onboardingCompleted: status.onboardingCompleted,
              selectedPersonality: status.selectedPersonality,
              communicationChannel: status.communicationChannel
            });
            
            // If user has completed onboarding, redirect to chat
            if (status.onboardingCompleted) {
              const redirectPath = getRedirectForChannel(status.communicationChannel);
              console.log(`[AuthModal] User has completed onboarding, redirecting to ${redirectPath}`);
              onSuccess();
              router.push(redirectPath);
              return;
            } else {
              console.log(`[AuthModal] User has NOT completed onboarding`);
            }
          } else {
            const errorData = await statusResponse.json().catch(() => ({}));
            console.error(`[AuthModal] Status API error:`, { 
              status: statusResponse.status, 
              error: errorData 
            });
          }
        } catch (statusError) {
          console.error(`[AuthModal] Failed to check user status:`, statusError);
          // If status check fails, default to onboarding
        }

        console.log(`[AuthModal] Redirecting to /onboarding (user not completed onboarding or status check failed)`);
        // Existing user but not completed onboarding - go to onboarding
        onSuccess();
        router.push("/onboarding");
      }
    } catch (err) {
      console.error(`[AuthModal] Unexpected error in handleSubmit:`, err);
      setError("An unexpected error occurred");
    } finally {
      console.log(`[AuthModal] handleSubmit completed, setting loading to false`);
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: "google") => {
    setLoading(true);
    setError(null);
    
    console.log(`[AuthModal] handleSocialSignIn started - provider: ${provider}, hasPersonality: ${!!selectedPersonality}`);
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/83f7ebfb-fb98-414f-a762-f20f439aa009',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthModal.tsx:handleSocialSignIn:entry',message:'Social sign-in started',data:{provider,hasPersonality:!!selectedPersonality},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    
    try {
      if (selectedPersonality) {
        console.log(`[AuthModal] Storing selected personality in sessionStorage:`, selectedPersonality.id);
        sessionStorage.setItem("selectedPersonality", selectedPersonality.id);
      }
      
      console.log(`[AuthModal] Calling signIn.social for provider: ${provider}`);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/83f7ebfb-fb98-414f-a762-f20f439aa009',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthModal.tsx:handleSocialSignIn:before-signIn',message:'About to call signIn.social',data:{provider},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      
      await signIn.social({
        provider,
      });
      
      console.log(`[AuthModal] signIn.social completed successfully for provider: ${provider}`);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/83f7ebfb-fb98-414f-a762-f20f439aa009',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthModal.tsx:handleSocialSignIn:success',message:'signIn.social succeeded',data:{provider},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      
      console.log(`[AuthModal] Waiting 500ms for session to be available...`);
      // Check if user has already completed onboarding from database
      // Wait a bit for session to be available
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log(`[AuthModal] Checking user onboarding status from database...`);
      try {
        const statusResponse = await fetch("/api/user/status");
        console.log(`[AuthModal] Status API response:`, { 
          ok: statusResponse.ok, 
          status: statusResponse.status 
        });
        
        if (statusResponse.ok) {
          const status = await statusResponse.json();
          console.log(`[AuthModal] User status from database:`, {
            onboardingCompleted: status.onboardingCompleted,
            selectedPersonality: status.selectedPersonality,
            communicationChannel: status.communicationChannel
          });
          
          // If user has completed onboarding, redirect to chat
          if (status.onboardingCompleted) {
            const redirectPath = getRedirectForChannel(status.communicationChannel);
            console.log(`[AuthModal] User has completed onboarding, redirecting to ${redirectPath}`);
            router.push(redirectPath);
            return;
          } else {
            console.log(`[AuthModal] User has NOT completed onboarding`);
          }
        } else {
          const errorData = await statusResponse.json().catch(() => ({}));
          console.error(`[AuthModal] Status API error:`, { 
            status: statusResponse.status, 
            error: errorData 
          });
        }
      } catch (statusError) {
        console.error(`[AuthModal] Failed to check user status:`, statusError);
        // If status check fails, default to onboarding
      }

      console.log(`[AuthModal] Redirecting to /onboarding (new user or not completed onboarding or status check failed)`);
      // New user or not completed onboarding - go to onboarding
      router.push("/onboarding");
    } catch (err) {
      console.error(`[AuthModal] Error in handleSocialSignIn:`, err);
      // #region agent log
      const errorDetails = err instanceof Error ? {name:err.name,message:err.message,stack:err.stack?.substring(0,500)} : {raw:String(err)};
      fetch('http://127.0.0.1:7242/ingest/83f7ebfb-fb98-414f-a762-f20f439aa009',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthModal.tsx:handleSocialSignIn:error',message:'signIn.social failed',data:{provider,error:errorDetails},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      
      setError(`Failed to sign in with ${provider}`);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md mx-4 bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header with personality accent */}
        <div
          className="h-1 w-full"
          style={{
            background: selectedPersonality
              ? `linear-gradient(90deg, ${selectedPersonality.accentColor}, ${selectedPersonality.accentColor}80)`
              : "linear-gradient(90deg, #f59e0b, #f59e0b80)",
          }}
        />

        <div className="p-8">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="font-cormorant text-3xl text-white mb-2">
              {mode === "signup" ? "Begin Your Journey" : "Welcome Back"}
            </h2>
            <p className="font-jakarta text-white/60 text-sm">
              {selectedPersonality
                ? `Continue with ${selectedPersonality.name}`
                : "Create your account to continue"}
            </p>
          </div>

          {/* Social Sign In */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleSocialSignIn("google")}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-jakarta text-sm transition-all disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#0f0f0f] text-white/40 font-jakarta">
                or continue with email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 font-jakarta text-sm focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                />
              </div>
            )}
            <div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 font-jakarta text-sm focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 font-jakarta text-sm focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm font-jakarta text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-white text-black font-jakarta font-medium rounded-xl hover:bg-white/90 transition-all disabled:opacity-50"
            >
              {loading ? "Please wait..." : mode === "signup" ? "Create Account" : "Sign In"}
            </button>
          </form>

          {/* Toggle Mode */}
          {allowModeSwitch && (
            <p className="text-center mt-6 font-jakarta text-sm text-white/60">
              {mode === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
                className="text-white hover:underline"
              >
                {mode === "signup" ? "Sign in" : "Sign up"}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
