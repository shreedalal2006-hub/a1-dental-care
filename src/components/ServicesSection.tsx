import React, { useState } from 'react';
import {
  Calendar,
  Sparkles,
  ShieldCheck,
  Stethoscope,
  Smile,
  Heart,
  Activity,
  Layers,
  Baby,
  ArrowRight,
  Info,
  Clock,
  X,
  Edit3,
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';
import { ServiceItem } from '../types';

export const ServicesSection: React.FC = () => {
  const { services, openBookingWithPrefill, setIsAdminOpen } = useClinic();
  const [selectedServiceForModal, setSelectedServiceForModal] = useState<ServiceItem | null>(null);

  // Map service names to minimal clinical icons
  const getServiceIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('general') || lower.includes('consultation')) {
      return <Stethoscope className="w-5 h-5 text-teal-700" />;
    }
    if (lower.includes('preventive')) {
      return <ShieldCheck className="w-5 h-5 text-teal-700" />;
    }
    if (lower.includes('restorative') || lower.includes('filling')) {
      return <Layers className="w-5 h-5 text-teal-700" />;
    }
    if (lower.includes('cosmetic') || lower.includes('smile')) {
      return <Sparkles className="w-5 h-5 text-teal-700" />;
    }
    if (lower.includes('gum') || lower.includes('periodont')) {
      return <Heart className="w-5 h-5 text-teal-700" />;
    }
    if (lower.includes('root canal') || lower.includes('endodontic')) {
      return <Activity className="w-5 h-5 text-teal-700" />;
    }
    if (lower.includes('cleaning') || lower.includes('scaling')) {
      return <Smile className="w-5 h-5 text-teal-700" />;
    }
    if (lower.includes('replacement') || lower.includes('denture') || lower.includes('bridge')) {
      return <Layers className="w-5 h-5 text-teal-700" />;
    }
    if (lower.includes('child') || lower.includes('pediatric')) {
      return <Baby className="w-5 h-5 text-teal-700" />;
    }
    return <Stethoscope className="w-5 h-5 text-teal-700" />;
  };

  return (
    <section id="services" className="py-16 md:py-24 bg-[#FAFAF8] border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-teal-800 uppercase mb-2">
              <span>Clinical Services</span>
              <span className="text-slate-400">·</span>
              <span>Doctor-Led Care</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight [text-wrap:balance]">
              Comprehensive Dental Treatments
            </h2>
            <p className="text-base text-slate-600 mt-2">
              Personalized oral healthcare solutions for individuals and families in Belagavi.
              All procedures are conducted with gentle, patient-first care.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAdminOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-md shadow-2xs hover:bg-slate-50 transition-colors"
              title="Edit service list in clinic admin"
            >
              <Edit3 className="w-3.5 h-3.5 text-teal-700" />
              <span>Customize Services (Admin)</span>
            </button>
          </div>
        </div>

        {/* Note on editable placeholders */}
        <div className="mb-8 p-3.5 bg-slate-100/80 border border-slate-200/90 rounded-lg text-xs text-slate-600 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-teal-700 flex-shrink-0" />
            <span>
              <strong>Clinic Notice:</strong> These clinical categories represent standard dental services provided at A1 Dental Care.
              Specific treatment plans and options are confirmed after your initial clinical consultation with Dr. Akshata.
            </span>
          </div>
        </div>

        {/* Services Grid (3 columns on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(service => (
            <div
              key={service.id}
              className="bg-white rounded-xl border border-slate-200/80 p-6 flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all group"
            >
              <div>
                {/* Header line with minimal icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center border border-teal-100/80 group-hover:bg-teal-100/60 transition-colors">
                    {getServiceIcon(service.name)}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>~{service.durationMinutes} mins</span>
                  </div>
                </div>

                {/* Service Name */}
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-teal-900 transition-colors">
                  {service.name}
                </h3>

                {/* 1–2 sentence description */}
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  {service.description}
                </p>
              </div>

              {/* Action Links */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedServiceForModal(service)}
                  className="text-xs font-semibold text-slate-600 hover:text-teal-900 inline-flex items-center gap-1 transition-colors"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => openBookingWithPrefill({ serviceId: service.id, serviceName: service.name })}
                  className="px-3 py-1.5 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100/80 border border-teal-200/60 rounded-md transition-colors"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Sub-CTA banner */}
        <div className="mt-12 bg-white rounded-xl border border-slate-200 p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Not sure which dental treatment is right for you?
            </h3>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              Schedule a general consultation with Dr. Akshata. We will perform an unhurried clinical examination and discuss the best approach for your comfort.
            </p>
          </div>
          <button
            onClick={() => openBookingWithPrefill()}
            className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-md transition-colors whitespace-nowrap shadow-2xs cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Consultation</span>
          </button>
        </div>

      </div>

      {/* Service Details Modal */}
      {selectedServiceForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-6 relative animate-in fade-in zoom-in-95 duration-150">
            
            <button
              onClick={() => setSelectedServiceForModal(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center border border-teal-100">
                {getServiceIcon(selectedServiceForModal.name)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{selectedServiceForModal.name}</h3>
                <p className="text-xs text-teal-800 font-medium">{selectedServiceForModal.category}</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              {selectedServiceForModal.description}
            </p>

            <div className="space-y-3 py-3 border-y border-slate-100 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">Estimated Duration:</span>
                <span>Approximately {selectedServiceForModal.durationMinutes} minutes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">Attending Surgeon:</span>
                <span>Dr. Akshata (Dental Surgeon)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">Clinical Protocol:</span>
                <span>Gentle, patient-first care with clear explanation</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedServiceForModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const s = selectedServiceForModal;
                  setSelectedServiceForModal(null);
                  openBookingWithPrefill({ serviceId: s.id, serviceName: s.name });
                }}
                className="px-5 py-2 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-md transition-colors flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book This Service</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
