'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, ShieldCheck, ChevronRight, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useSearchParams, useRouter } from 'next/navigation';

function AdminLoginModalInner() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [redirectError, setRedirectError] = useState<string | null>(null);
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Keyboard shortcut: Shift + Cmd/Ctrl + D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const resetState = () => {
    setTimeout(() => {
      setStep(1);
      setEmail('');
      setRedirectError(null);
      setInlineError(null);
      setIsLoading(false);
    }, 300);
  };

  const handleClose = () => {
    setIsOpen(false);
    resetState();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setInlineError(null);
    setRedirectError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        setStep(2);
      } else {
        setInlineError(data.error || 'This email is not registered as an admin.');
      }
    } catch {
      setInlineError('Failed to verify email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setInlineError(null);

    const supabase = createClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          prompt: 'select_account',
        },
      },
    });

    if (oauthError) {
      setInlineError('Failed to start Google sign-in. Please try again.');
      setIsLoading(false);
    }
  };

  const slideVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
    exit: {
      x: -50,
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-[360px] bg-white rounded-[32px] p-8 pb-6 shadow-2xl overflow-hidden flex flex-col items-center z-10"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full bg-gray-100/80 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors z-10"
            >
              <X className="w-3.5 h-3.5" strokeWidth={2.5} />
            </button>

            <AnimatePresence mode="wait">
              {/* ── Step 1: Email Verification ── */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  variants={slideVariants as any}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-col items-center text-center w-full mt-2"
                >
                  <div className="w-16 h-16 bg-gradient-to-b from-[#2a2a2a] to-[#111111] rounded-2xl flex items-center justify-center mb-6 shadow-[0_6px_0_0_#000000,0_8px_15px_rgba(0,0,0,0.4)] border-t border-gray-600">
                    <Lock className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>

                  <h2 className="text-[22px] font-bold text-gray-900 mb-2 tracking-tight">
                    Admin Access
                  </h2>
                  <p className="text-[#8c8c8c] text-[13px] leading-relaxed mb-6 px-4 font-medium">
                    Enter your authorised church email to access the secure admin portal.
                  </p>

                  {/* Redirect error banner */}
                  {redirectError && (
                    <div className="w-full flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-[12px] font-semibold rounded-2xl px-4 py-3 mb-4 text-left">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {redirectError}
                    </div>
                  )}

                  <form onSubmit={handleVerify} className="w-full flex flex-col gap-4">
                    <div className="flex flex-col text-left gap-1.5">
                      <label className="text-[12px] font-semibold text-[#8c8c8c] pl-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setInlineError(null);
                        }}
                        placeholder="ex. admin@christrevelation.org"
                        className={`w-full bg-[#f6f6f7] rounded-2xl px-4 py-3 text-[14px] outline-none transition-all placeholder:text-[#a1a1aa] font-medium text-gray-900 ${
                          inlineError
                            ? 'ring-2 ring-red-400 bg-red-50'
                            : 'focus:bg-white focus:ring-2 focus:ring-black'
                        }`}
                        required
                      />
                      {inlineError && (
                        <span className="text-red-500 text-[11px] pl-1 font-semibold mt-0.5">
                          {inlineError}
                        </span>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#111111] hover:bg-black text-white font-semibold text-[14px] rounded-2xl py-3.5 mt-1 flex items-center justify-center gap-1.5 transition-transform active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Verifying...' : (
                        <>Verify <ChevronRight className="w-4 h-4" strokeWidth={3} /></>
                      )}
                    </button>
                  </form>

                  <p className="text-[#a1a1aa] text-[11px] mt-6 font-semibold tracking-wide">
                    Restricted area · monitored access
                  </p>
                </motion.div>
              )}

              {/* ── Step 2: Google OAuth ── */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  variants={slideVariants as any}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-col items-center text-center w-full mt-2"
                >
                  <div className="w-16 h-16 bg-gradient-to-b from-green-400 to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-[0_6px_0_0_#166534,0_8px_15px_rgba(22,101,52,0.4)] border-t border-green-300">
                    <ShieldCheck className="w-7 h-7 text-white" strokeWidth={2.5} />
                  </div>

                  <h2 className="text-[22px] font-bold text-gray-900 mb-2 tracking-tight">
                    Identity Verified
                  </h2>
                  <p className="text-[#8c8c8c] text-[13px] leading-relaxed mb-8 px-2 font-medium">
                    Your email is authorised. Continue with Google to authenticate your session.
                  </p>

                  {inlineError && (
                    <div className="w-full flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-[12px] font-semibold rounded-2xl px-4 py-3 mb-4 text-left">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {inlineError}
                    </div>
                  )}

                  <button
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="w-full bg-white border-2 border-gray-100 hover:border-gray-200 hover:bg-gray-50 text-gray-900 font-bold text-[14px] rounded-2xl py-3.5 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                  >
                    {isLoading ? (
                      <svg className="w-5 h-5 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" className="w-5 h-5">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                    )}
                    {isLoading ? 'Redirecting to Google…' : 'Continue with Google'}
                  </button>

                  <button
                    onClick={handleClose}
                    className="text-[#a1a1aa] hover:text-gray-600 text-[12px] mt-6 font-semibold transition-colors"
                  >
                    Cancel Authentication
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function AdminLoginModal() {
  return (
    <Suspense fallback={null}>
      <AdminLoginModalInner />
    </Suspense>
  );
}

