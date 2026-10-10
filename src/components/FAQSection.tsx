import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Calendar, Phone, Edit3 } from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

export const FAQSection: React.FC = () => {
  const { faqs, openBookingWithPrefill, setIsAdminOpen, clinicInfo } = useClinic();
  const [openFaqId, setOpenFaqId] = useState<string | null>(faqs[0]?.id || null);

  const toggleFaq = (id: string) => {
    setOpenFaqId(prev => (prev === id ? null : id));
  };

  return (
    <section id="faqs" className="py-16 md:py-24 bg-white border-b border-slate-200/70">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-teal-800 uppercase mb-2">
              <HelpCircle className="w-4 h-4 text-teal-700" />
              <span>Patient Assistance</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight [text-wrap:balance]">
              Frequently Asked Questions
            </h2>
            <p className="text-base text-slate-600 mt-2">
              Helpful answers regarding clinic visits, appointments, timings, and location.
            </p>
          </div>

          <button
            onClick={() => setIsAdminOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-md shadow-2xs hover:bg-slate-50 transition-colors whitespace-nowrap self-start sm:self-auto"
            title="Edit FAQs in clinic admin"
          >
            <Edit3 className="w-3.5 h-3.5 text-teal-700" />
            <span>Edit FAQs</span>
          </button>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {faqs.map(faq => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="border border-slate-200/90 rounded-xl overflow-hidden transition-all bg-slate-50/40 hover:border-slate-300"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-semibold text-slate-900 hover:text-teal-900 transition-colors"
                >
                  <span className="text-sm sm:text-base">{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'rotate-180 text-teal-800' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Further Questions Help Box */}
        <div className="mt-10 p-6 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Have a specific question about your visit?</h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Call our team directly at {clinicInfo.phoneDisplay} or schedule a consultation online.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`tel:${clinicInfo.phone}`}
              className="px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-md hover:bg-slate-100 transition-colors flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-teal-700" />
              <span>Call Us</span>
            </a>
            <button
              onClick={() => openBookingWithPrefill()}
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-md transition-colors flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Visit</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
