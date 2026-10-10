import React, { useState } from 'react';
import { Calendar, Phone, HeartHandshake, CheckCircle2, Shield, Edit3 } from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

export const AboutDoctor: React.FC = () => {
  const { clinicInfo, openBookingWithPrefill, setIsAdminOpen } = useClinic();
  const [showAdminNote, setShowAdminNote] = useState(false);

  return (
    <section id="about" className="py-16 md:py-24 bg-white border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Doctor Portrait Frame */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative max-w-md mx-auto">
              
              {/* Main Image Frame with refined border */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-50">
                <img
                  src="/src/assets/images/dr_akshata_portrait_1791205007587.jpg"
                  alt="Dr. Akshata - Dental Surgeon at A1 Dental Care"
                  referrerPolicy="no-referrer"
                  className="w-full aspect-[3/3.8] object-cover object-top"
                  loading="lazy"
                />

                {/* Subtitle card */}
                <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{clinicInfo.doctorName}</h3>
                    <p className="text-xs text-teal-800 font-semibold">{clinicInfo.doctorRole}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Clinic</p>
                    <p className="text-xs font-semibold text-slate-800">A1 Dental Care, Piranwadi</p>
                  </div>
                </div>
              </div>

              {/* Decorative accent card: Doctor-Led Care */}
              <div className="absolute -top-4 -right-4 bg-white p-3 rounded-lg border border-slate-200/90 shadow-sm flex items-center gap-2 max-w-[200px]">
                <HeartHandshake className="w-5 h-5 text-teal-700 flex-shrink-0" />
                <p className="text-xs font-semibold text-slate-800 leading-tight">
                  Doctor-Led Personal Attention
                </p>
              </div>

            </div>
          </div>

          {/* Editorial Content */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            
            {/* Subtle editorial kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-teal-800 uppercase">
              <span>Practitioner Profile</span>
              <span className="text-slate-400">·</span>
              <span>A1 Dental Care</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight [text-wrap:balance]">
              Meet Dr. Akshata
            </h2>

            <p className="text-sm font-semibold text-teal-800 uppercase tracking-wide">
              {clinicInfo.doctorRole} · A1 Dental Care, Belagavi
            </p>

            {/* Doctor Bio (editable via Admin without fabricated claims) */}
            <div className="space-y-4 text-base text-slate-600 leading-relaxed">
              <p>
                {clinicInfo.doctorBio}
              </p>
              <p>
                At A1 Dental Care, patients receive direct, unhurried care from Dr. Akshata.
                Every consultation begins with listening to your dental needs, performing a meticulous
                examination, and explaining your treatment choices in simple, clear language.
              </p>
            </div>

            {/* 4 Pillars of Doctor-Led Care */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50/80 border border-slate-200/70">
                <CheckCircle2 className="w-4 h-4 text-teal-700 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Doctor-Led Care</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Direct examination and treatment overseen by Dr. Akshata herself.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50/80 border border-slate-200/70">
                <CheckCircle2 className="w-4 h-4 text-teal-700 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Personal Attention</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Dedicated appointment slots allowing calm, unhurried treatment.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50/80 border border-slate-200/70">
                <CheckCircle2 className="w-4 h-4 text-teal-700 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Patient Comfort</h4>
                  <p className="text-xs text-slate-600 mt-0.5">A clean, reassuring clinical environment designed to ease dental anxiety.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50/80 border border-slate-200/70">
                <CheckCircle2 className="w-4 h-4 text-teal-700 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Clear Communication</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Transparent advice and honest recommendations for every case.</p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <button
                onClick={() => openBookingWithPrefill()}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-md transition-colors shadow-2xs"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Consultation with Dr. Akshata</span>
              </button>

              <a
                href={`tel:${clinicInfo.phone}`}
                className="inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-md transition-colors"
              >
                <Phone className="w-4 h-4 text-teal-700" />
                <span>Direct Clinic Line</span>
              </a>

              {/* Admin Note / Edit Trigger */}
              <button
                onClick={() => setIsAdminOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                title="Edit doctor biography in staff admin"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            </div>

            {/* Verified Clinical Notice */}
            <div className="p-3 bg-slate-50 rounded-md border border-slate-200/80 text-xs text-slate-500 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-teal-700" />
                Doctor profile maintained in accordance with verified clinic information.
              </span>
              <button
                onClick={() => setShowAdminNote(!showAdminNote)}
                className="text-teal-800 font-medium hover:underline text-[11px]"
              >
                {showAdminNote ? 'Hide note' : 'Clinic note'}
              </button>
            </div>

            {showAdminNote && (
              <div className="p-3 bg-teal-50/70 border border-teal-200 text-teal-900 text-xs rounded-md">
                <strong>Notice for Clinic Administration:</strong> This section strictly displays verified information.
                You can expand Dr. Akshata's biography, qualifications, or credentials anytime via the{' '}
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="font-bold underline text-teal-900"
                >
                  Admin Portal
                </button>
                .
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
