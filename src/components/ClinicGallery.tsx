import React, { useState } from 'react';
import { Camera, X, ZoomIn, Info, ShieldCheck, Edit3 } from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

export const ClinicGallery: React.FC = () => {
  const { gallery, setIsAdminOpen } = useClinic();
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  // Additional tasteful placeholders labeled as required by prompt
  const allDisplayItems = [
    ...gallery,
    {
      id: 'gal-placeholder-1',
      title: 'Clinic Photo — 2nd Floor Entrance & Signage',
      category: 'Exterior & Entrance',
      url: '',
      isVerifiedClinicPhoto: false,
    },
    {
      id: 'gal-placeholder-2',
      title: 'Clinic Photo — Instrument Sterilization Station',
      category: 'Sterilization & Hygiene',
      url: '',
      isVerifiedClinicPhoto: false,
    },
  ];

  const activePhoto = activePhotoIndex !== null ? allDisplayItems[activePhotoIndex] : null;

  return (
    <section id="gallery" className="py-16 md:py-24 bg-white border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-teal-800 uppercase mb-2">
              <span>Clinic Environment</span>
              <span className="text-slate-400">·</span>
              <span>Piranwadi, Belagavi</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight [text-wrap:balance]">
              Inside A1 Dental Care
            </h2>
            <p className="text-base text-slate-600 mt-2">
              Explore our clean, peaceful, and hygienic clinic facility located on the 2nd Floor, Jamboti Road.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAdminOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-md shadow-2xs hover:bg-slate-50 transition-colors"
              title="Manage gallery in clinic admin"
            >
              <Edit3 className="w-3.5 h-3.5 text-teal-700" />
              <span>Manage Gallery (Admin)</span>
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allDisplayItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => item.url && setActivePhotoIndex(idx)}
              className={`group relative rounded-xl overflow-hidden border border-slate-200/80 bg-slate-50 ${
                item.url ? 'cursor-pointer hover:shadow-md' : 'opacity-90'
              } transition-all`}
            >
              {item.url ? (
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={item.url}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Subtle hover overlay */}
                  <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="p-2.5 rounded-full bg-white/90 text-slate-900 shadow-md">
                      <ZoomIn className="w-5 h-5 text-teal-900" />
                    </span>
                  </div>
                </div>
              ) : (
                /* Tasteful placeholder container labeled "Clinic photo" */
                <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200/80 p-6 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-300">
                  <Camera className="w-8 h-8 text-slate-400 mb-2" />
                  <p className="text-xs font-bold text-slate-700">{item.title}</p>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-[200px]">
                    Tasteful placeholder · Ready to be updated by clinic staff
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsAdminOpen(true);
                    }}
                    className="mt-3 px-2.5 py-1 text-[11px] font-semibold text-teal-800 bg-white border border-teal-200 rounded shadow-2xs hover:bg-teal-50"
                  >
                    Upload Actual Photo
                  </button>
                </div>
              )}

              {/* Caption */}
              <div className="p-3.5 bg-white border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{item.title}</h3>
                  <p className="text-[11px] text-slate-500">{item.category}</p>
                </div>
                {item.isVerifiedClinicPhoto && (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-teal-800" title="Verified clinic photograph">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                    Verified
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Gallery Disclaimer */}
        <div className="mt-8 p-3 bg-slate-50 rounded-md border border-slate-200/80 text-xs text-slate-500 flex items-center gap-2">
          <Info className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span>
            Photos strictly reflect the actual facility and clinical care at A1 Dental Care, Piranwadi, Belagavi.
          </span>
        </div>

      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in"
          onClick={() => setActivePhotoIndex(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-800"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setActivePhotoIndex(null)}
              className="absolute top-4 right-4 z-10 p-2 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 rounded-full transition-colors"
              aria-label="Close photo view"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="max-h-[75vh] flex items-center justify-center bg-black">
              <img
                src={activePhoto.url}
                alt={activePhoto.title}
                referrerPolicy="no-referrer"
                className="max-h-[75vh] w-auto object-contain mx-auto"
              />
            </div>

            <div className="p-4 bg-slate-900 border-t border-slate-800 text-white flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold">{activePhoto.title}</h4>
                <p className="text-xs text-slate-400">{activePhoto.category} · A1 Dental Care, Belagavi</p>
              </div>
              <span className="text-xs text-teal-400 font-mono">
                {activePhotoIndex! + 1} of {allDisplayItems.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
