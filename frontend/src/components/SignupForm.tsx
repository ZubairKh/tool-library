import { useState } from 'react';
import { signup } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export function SignupForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const { token, user } = await signup(form.name, form.email, form.password);
      login(token, user);
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-grid">
      <input placeholder="Name" value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        className="input-field" />
      <input placeholder="Email" type="email" value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
        className="input-field" />
      <input placeholder="Password" type="password" value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })}
        className="input-field" />
      {error && <p className="form-error">{error}</p>}
      <button type="submit" className="primary-btn">
        Sign Up
      </button>
    </form>
  );
}