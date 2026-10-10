import React from 'react';
import { Star, ShieldCheck, MapPin, ExternalLink, Calendar } from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

export const GoogleRatingSection: React.FC = () => {
  const { clinicInfo, openBookingWithPrefill } = useClinic();

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-[#FAFAF8] to-white border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-10 md:p-12 relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Big 5.0 Rating Statement */}
            <div className="lg:col-span-6 space-y-4">
              
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-teal-800 uppercase">
                <ShieldCheck className="w-4 h-4 text-teal-700" />
                <span>Verified Patient Trust</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight [text-wrap:balance]">
                Rated 5.0 on Google
              </h2>

              <p className="text-base text-slate-600 leading-relaxed">
                A1 Dental Care is proud to maintain an unblemished 5.0-star rating from patient reviews in Belagavi.
                Our commitment remains focused on gentle care, honest clinical opinions, and attentive treatment.
              </p>

              {/* Strict Content Rule: No fabricated reviews */}
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-lg text-xs text-slate-500">
                <span className="font-semibold text-slate-700">Notice of Authenticity:</span> We adhere strictly to ethical healthcare practices.
                All 32 patient reviews are logged independently on our verified Google Business profile.
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=A1+DENTAL+CARE+331+Jamboti+Road+Piranwadi+Belagavi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                >
                  <span>View Google Business Profile</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>

                <button
                  onClick={() => openBookingWithPrefill()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-md transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Experience A1 Care</span>
                </button>
              </div>

            </div>

            {/* Right Column: Visual Rating Showcase */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 sm:p-8 bg-slate-50/80 rounded-xl border border-slate-200/80 text-center">
              
              <div className="w-16 h-16 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center mb-3">
                <span className="text-2xl font-black text-teal-900">A1</span>
              </div>

              <div className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight font-mono">
                {clinicInfo.googleRating.toFixed(1)}
              </div>

              <div className="flex items-center gap-1.5 text-amber-500 my-3" aria-label="5 out of 5 stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-base font-bold text-slate-800">
                5.0 ★ Google Rating
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Based on <span className="font-semibold text-slate-700">{clinicInfo.reviewCount} verified reviews</span>
              </p>

              <div className="mt-6 pt-5 border-t border-slate-200/70 w-full flex items-center justify-around text-xs text-slate-600">
                <div>
                  <p className="font-bold text-slate-900">100%</p>
                  <p className="text-[11px] text-slate-500">Doctor-Led</p>
                </div>
                <div className="h-6 w-[1px] bg-slate-200" />
                <div>
                  <p className="font-bold text-slate-900">7 Days</p>
                  <p className="text-[11px] text-slate-500">Weekly Service</p>
                </div>
                <div className="h-6 w-[1px] bg-slate-200" />
                <div>
                  <p className="font-bold text-slate-900">Piranwadi</p>
                  <p className="text-[11px] text-slate-500">Belagavi, KA</p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
