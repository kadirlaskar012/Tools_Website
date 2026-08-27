'use client';

import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, ShieldCheck } from 'lucide-react';

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Contact Info Sidebar */}
      <div className="space-y-6">
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Email Us Directly
              </div>
              <a
                href="mailto:contact@fileintelligence.dev"
                className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition truncate block"
              >
                contact@fileintelligence.dev
              </a>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-2">
            <p>
              <strong>Response Time:</strong> We typically respond to technical inquiries and suggestions within 1–2 business days.
            </p>
            <p>
              <strong>Feature Requests:</strong> If you need a specific binary parser or file specification tool, please let us know!
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20 text-xs text-emerald-900 dark:text-emerald-300 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <p>
            Please do not email sensitive documents. All inspection should be done directly via your local browser.
          </p>
        </div>
      </div>

      {/* Contact Form */}
      <div className="md:col-span-2">
        {submitted ? (
          <div className="p-8 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Message Received!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              Thank you for reaching out. We have received your inquiry and will review your feedback promptly.
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-4 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 transition"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Your Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Alex Morgan"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Email Address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="alex@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="contact-subject"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Inquiry Topic
              </label>
              <select
                id="contact-subject"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option>General Inquiry</option>
                <option>Tool Suggestion / Feature Request</option>
                <option>Bug Report / Parser Feedback</option>
                <option>Privacy / Security Question</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Your Message
              </label>
              <textarea
                id="contact-message"
                required
                rows={4}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="Describe your inquiry or suggested file inspection tool..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold text-xs sm:text-sm hover:bg-slate-800 dark:hover:bg-slate-200 shadow-md transition"
            >
              <Send className="w-4 h-4" />
              <span>Submit Inquiry</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
