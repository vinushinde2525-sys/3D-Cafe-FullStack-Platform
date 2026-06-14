import { Link } from 'react-router-dom';
export default function VerifyEmailPage() {
  return (
    <div>
      <p className="eyebrow mb-3">VerifyEmailPage</p>
      <h1 className="font-serif text-3xl text-espresso mb-4">Coming Soon</h1>
      <p className="text-ink-3 font-sans text-sm mb-6">This page is being crafted with care.</p>
      <Link to="/" className="text-gold font-display text-sm hover:underline">← Back to Home</Link>
    </div>
  );
}
