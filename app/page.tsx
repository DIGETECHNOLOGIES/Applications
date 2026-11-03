'use client';

import { useState } from 'formik' // or standard React state
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ApplyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    school: '',
    department: '',
    kashKnowledge: '',
    kashImprovements: '',
    contributionIntent: '',
    learningExpectations: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      router.push('/success');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-8">
        
        {/* Title & Announcement */}
        <div className="mb-8 border-b border-slate-800 pb-6">
          <span className="bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Volunteering Opportunity
          </span>
          <h1 className="text-3xl font-bold mt-3 text-white tracking-tight">
            DIGETECH KASH Internship Program
          </h1>
          <p className="mt-4 text-slate-300 leading-relaxed">
            The DIGETECH team is opening its doors to <strong className="text-white">10 year one and two students</strong> who would like to gain real-world experience on project development and work with real projects like <strong className="text-white">KASH</strong>.
          </p>
          <p className="mt-2 text-slate-300 leading-relaxed">
            If you would like to be selected kindly fill the application link below.
          </p>
          <div className="mt-4 bg-amber-500/10 border-l-4 border-amber-500 p-3 text-amber-400 text-sm font-medium">
            NB. THIS IS STRICTLY A VOLUNTEERING ACTIVITY.
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">1. Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
              placeholder="e.g., Tah Dylan"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">2. Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                placeholder="name@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">3. Phone Number (WhatsApp)</label>
              <input
                type="text"
                name="whatsapp"
                required
                value={formData.whatsapp}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                placeholder="+237 ..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">4. School / University</label>
              <input
                type="text"
                name="school"
                required
                value={formData.school}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                placeholder="e.g., NAHPI Bamenda"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">5. Department / Field</label>
              <input
                type="text"
                name="department"
                required
                value={formData.department}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                placeholder="e.g., Computer Engineering"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">6. What do you know about KASH?</label>
            <textarea
              name="kashKnowledge"
              rows={3}
              required
              value={formData.kashKnowledge}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
              placeholder="Tell us what you understand about the KASH project..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">7. What do you think can be improved about KASH?</label>
            <textarea
              name="kashImprovements"
              rows={3}
              required
              value={formData.kashImprovements}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
              placeholder="Your thoughts on features, performance, UI/UX..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">8. How do you intend to contribute?</label>
            <input
              type="text"
              name="contributionIntent"
              required
              value={formData.contributionIntent}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
              placeholder="Tech stack, public speaking, advertising, social media, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">9. What do you hope to learn through this experience?</label>
            <textarea
              name="learningExpectations"
              rows={3}
              required
              value={formData.learningExpectations}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
              placeholder="Your goals and expectations..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-4 rounded-lg transition duration-200 shadow-lg disabled:opacity-50"
          >
            {loading ? 'Submitting Application...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </main>
  );
}