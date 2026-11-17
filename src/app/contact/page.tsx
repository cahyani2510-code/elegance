'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    toast.success('Thank you! Your message has been sent. We will respond within 24 hours.', {
      style: { background: '#111', color: '#fff', border: '1px solid #C6A66B' },
    })
    setForm({ name: '', email: '', subject: '', message: '' })
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] py-12 md:py-20">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[#C6A66B] text-xs tracking-[0.3em] uppercase font-light mb-3">Client Services</p>
          <h1 className="font-serif text-3xl md:text-5xl text-[#111111] mb-4">Contact ÉLÉGANCE</h1>
          <div className="section-divider" />
          <p className="text-[#6b7280] font-light max-w-md mx-auto mt-4 text-sm">
            Our client advisors are available to assist with order inquiries, sizing advice, and private shopping appointments.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Details */}
          <div className="space-y-6">
            <div className="bg-white border border-[#e5e1d8] p-6 space-y-6">
              <h3 className="font-serif text-lg text-[#111111] mb-4">Get In Touch</h3>

              <div className="flex items-start gap-4">
                <Mail size={18} className="text-[#C6A66B] mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-xs text-[#111111] uppercase tracking-wider mb-1">Email</p>
                  <a href="mailto:concierge@elegance.id" className="text-sm text-[#6b7280] hover:text-[#C6A66B] transition-colors">
                    concierge@elegance.id
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone size={18} className="text-[#C6A66B] mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-xs text-[#111111] uppercase tracking-wider mb-1">Phone / WhatsApp</p>
                  <p className="text-sm text-[#6b7280]">+62 21 5088 9000</p>
                  <p className="text-xs text-[#6b7280] font-light mt-0.5">Mon–Sat: 09:00 – 18:00 WIB</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin size={18} className="text-[#C6A66B] mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-xs text-[#111111] uppercase tracking-wider mb-1">Boutique & Office</p>
                  <p className="text-sm text-[#6b7280] font-light leading-relaxed">
                    Pacific Place Mall, Level 3<br />
                    Jl. Jend. Sudirman Kav 52-53<br />
                    Jakarta Selatan 12190
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock size={18} className="text-[#C6A66B] mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-xs text-[#111111] uppercase tracking-wider mb-1">Response Time</p>
                  <p className="text-sm text-[#6b7280] font-light">Within 24 business hours</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white border border-[#e5e1d8] p-8 md:p-10">
            <h3 className="font-serif text-2xl text-[#111111] mb-6">Send Us a Message</h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#111111] mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-[#e5e1d8] px-3.5 py-3 text-sm focus:border-[#C6A66B] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#111111] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-[#e5e1d8] px-3.5 py-3 text-sm focus:border-[#C6A66B] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[#111111] mb-1.5">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="e.g. Order inquiry, Private Styling, Seller application"
                  className="w-full border border-[#e5e1d8] px-3.5 py-3 text-sm focus:border-[#C6A66B] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[#111111] mb-1.5">
                  Message *
                </label>
                <textarea
                  rows={6}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="How can our advisors assist you today?"
                  className="w-full border border-[#e5e1d8] px-3.5 py-3 text-sm focus:border-[#C6A66B] transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-gold px-8 py-4 text-xs inline-flex items-center gap-2"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>Send Message <Send size={14} /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
