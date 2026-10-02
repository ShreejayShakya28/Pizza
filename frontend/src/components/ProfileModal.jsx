import { useState } from 'react';
import { api } from '../api.js';
import Button from './Button.jsx';
import Field from './Field.jsx';
import Modal from './Modal.jsx';

const GENDER_OPTIONS = [
  ['', 'Not set'],
  ['female', 'Female'],
  ['male', 'Male'],
  ['non-binary', 'Non-binary'],
  ['prefer-not-to-say', 'Prefer not to say'],
];

export default function ProfileModal({ user, onClose, onSaved }) {
  // Form values are strings; empty age/gender mean "not set".
  const [form, setForm] = useState({
    name: user.name,
    age: user.age ?? '',
    gender: user.gender ?? '',
  });
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setStatus({ type: 'idle', message: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const saved = await api.updateProfile(user.id, {
        name: form.name,
        age: form.age === '' ? null : Number(form.age),
        gender: form.gender || null,
      });
      onSaved(saved); // e.g. { id: 1, name: "Maya", email: "maya@example.com", age: 28, gender: "female" }
      setStatus({ type: 'ok', message: 'Profile saved.' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal title="My profile" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Name" value={form.name} onChange={set('name')} maxLength={60} required />
        <Field label="Email" value={user.email} disabled readOnly />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Age" type="number" min={1} max={120} step={1}
                 value={form.age} onChange={set('age')} placeholder="28" />
          <Field label="Gender" as="select" value={form.gender} onChange={set('gender')}>
            {GENDER_OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </Field>
        </div>

        <p
          role="status"
          className={`min-h-6 font-medium ${status.type === 'error' ? 'text-red-700' : 'text-enamel'}`}
        >
          {status.message}
        </p>

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Close</Button>
          <Button type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save profile'}</Button>
        </div>
      </form>
    </Modal>
  );
}
