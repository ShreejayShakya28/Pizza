import { useState } from 'react';
import { api } from '../api.js';
import Button from './Button.jsx';
import Field from './Field.jsx';

const MODES = {
  login: {
    title: 'Sign in to order',
    submit: 'Sign in',
    prompt: 'New here?',
    switchTo: 'signup',
    switchLabel: 'Create an account',
    call: (form) => api.login({ email: form.email, password: form.password }),
  },
  signup: {
    title: 'Create your account',
    submit: 'Create account',
    prompt: 'Already have an account?',
    switchTo: 'login',
    switchLabel: 'Sign in',
    call: (form) => api.signup(form),
  },
};

const EMPTY_FORM = { name: '', email: '', password: '' };

export default function AuthGate({ onAuthed }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const current = MODES[mode];

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const switchMode = () => {
    setMode(current.switchTo);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      onAuthed(await current.call(form));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto max-w-md px-6 py-20">
      <h1 className="text-6xl font-extrabold tracking-tight">Little Slice</h1>
      <h2 className="mt-6 text-2xl font-semibold">{current.title}</h2>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        {mode === 'signup' && (
          <Field label="Name" value={form.name} onChange={set('name')}
                 maxLength={60} placeholder="Maya" autoComplete="name" required />
        )}
        <Field label="Email" type="email" value={form.email} onChange={set('email')}
               maxLength={120} placeholder="maya@example.com" autoComplete="email" required />
        <Field label="Password" type="password" value={form.password} onChange={set('password')}
               maxLength={100} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
               hint={mode === 'signup' ? 'At least 4 characters.' : undefined} required />

        <p role="alert" className="min-h-6 font-medium text-red-700">{error}</p>

        <Button type="submit" disabled={busy} className="w-full">
          {busy ? 'One moment…' : current.submit}
        </Button>
      </form>

      <p className="mt-6 text-ink/70">
        {current.prompt}{' '}
        <button type="button" onClick={switchMode} className="font-semibold text-enamel underline">
          {current.switchLabel}
        </button>
      </p>
      <p className="mt-10 text-sm text-ink/50">Demo account: maya@example.com / pizza123</p>
    </main>
  );
}
