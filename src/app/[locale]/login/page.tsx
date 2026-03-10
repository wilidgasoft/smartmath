'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { SpaceScene } from '@/components/game/SpaceScene';
import { Button } from '@/components/ui';

type Tab = 'login' | 'register';

export default function LoginPage() {
  const t = useTranslations('auth');
  const tApp = useTranslations('app');
  const locale = useLocale();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [displayName, setDisplayName] = useState('');
  const [age, setAge] = useState(8);
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        email: loginEmail,
        password: loginPassword,
        redirect: false,
      });
      if (result?.error) {
        setError('Invalid email or password. Please try again.');
      } else {
        router.push(`/${locale}/galaxy`);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn('nodemailer', { email: loginEmail, redirect: false });
      setMagicLinkSent(true);
    } catch {
      setError('Could not send magic link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: regEmail, password: regPassword, displayName, age }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? 'Registration failed');
      } else {
        await signIn('credentials', { email: regEmail, password: regPassword, redirect: false });
        router.push(`/${locale}/galaxy`);
      }
    } catch {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0">
        <SpaceScene />
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="bg-space-card border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
          {/* Tabs */}
          <div className="flex">
            {(['login', 'register'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); }}
                className={`flex-1 py-4 font-heading font-semibold text-sm transition-colors ${
                  tab === t ? 'bg-primary text-white' : 'text-white/50 hover:text-white'
                }`}
              >
                {t === 'login' ? '🚀 Log In' : '✨ Create Account'}
              </button>
            ))}
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {tab === 'login' ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  {magicLinkSent ? (
                    <div className="text-center py-4">
                      <div className="text-4xl mb-3">📧</div>
                      <p className="text-white font-body">{t('magicLinkSent')}</p>
                    </div>
                  ) : (
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <label className="block text-white/70 text-sm mb-1">{t('parentEmail')}</label>
                        <input
                          type="email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="parent@email.com"
                          required
                          className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-white/70 text-sm mb-1">{t('password')}</label>
                        <input
                          type="password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-primary"
                        />
                      </div>
                      {error && <p className="text-warning text-sm">{error}</p>}
                      <Button variant="primary" size="md" className="w-full" loading={loading} type="submit">
                        {t('logIn')}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        className="w-full"
                        onClick={handleMagicLink}
                        loading={loading}
                      >
                        ✉️ {t('magicLink')}
                      </Button>
                    </form>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <label className="block text-white/70 text-sm mb-1">{t('astronautName')}</label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder={t('astronautNamePlaceholder')}
                        required
                        maxLength={20}
                        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm mb-1">{t('howOld')}</label>
                      <div className="flex gap-2 flex-wrap">
                        {[5,6,7,8,9,10,11,12].map((a) => (
                          <button
                            key={a}
                            type="button"
                            onClick={() => setAge(a)}
                            className={`w-10 h-10 rounded-xl font-heading font-bold text-sm border transition-colors ${
                              age === a
                                ? 'bg-primary border-primary text-white'
                                : 'border-white/20 text-white/60 hover:border-white/40'
                            }`}
                          >
                            {a}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm mb-1">{t('parentEmail')}</label>
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="parent@email.com"
                        required
                        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm mb-1">{t('password')}</label>
                      <input
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        minLength={4}
                        required
                        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-primary"
                      />
                    </div>
                    {error && <p className="text-warning text-sm">{error}</p>}
                    <Button variant="success" size="md" className="w-full" loading={loading} type="submit">
                      {t('signUp')} 🚀
                    </Button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Guest play */}
            <div className="mt-4 pt-4 border-t border-white/10 text-center">
              <button
                onClick={() => router.push(`/${locale}/galaxy`)}
                className="text-white/50 text-sm hover:text-white transition-colors"
              >
                {tApp('guest')} →
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
