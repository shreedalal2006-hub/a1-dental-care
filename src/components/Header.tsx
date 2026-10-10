import React, { useState } from 'react';
import { Phone, Calendar, Menu, X, Shield, Clock } from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

export const Header: React.FC = () => {
  const { clinicInfo, openBookingWithPrefill, setIsAdminOpen } = useClinic();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Why Us', href: '#why-us' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Timings & Location', href: '#location' },
    { label: 'FAQs', href: '#faqs' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAFAF8]/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Zone 1: Clean Brand Wordmark */}
          <a
            href="#"
            className="group flex flex-col justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 rounded-sm"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 group-hover:text-teal-900 transition-colors">
                A1 DENTAL CARE
              </span>
              <span className="text-base text-teal-700" title="A1 Dental Care">🦷</span>
            </div>
            <span className="text-[11px] font-medium tracking-wide uppercase text-slate-600">
              Dr. Akshata · Dental Surgeon
            </span>
          </a>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
            {navLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                onClick={e => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="hover:text-teal-900 transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-teal-700 hover:after:w-full after:transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Direct Phone Call CTA */}
            <a
              href={`tel:${clinicInfo.phone}`}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:text-teal-900 hover:bg-slate-100/80 rounded-md transition-colors"
              title="Call A1 Dental Care Clinic"
            >
              <Phone className="w-3.5 h-3.5 text-teal-700" />
              <span className="font-semibold">{clinicInfo.phoneDisplay}</span>
            </a>

            {/* Primary Appointment Button */}
            <button
              onClick={() => openBookingWithPrefill()}
              className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-teal-800 hover:bg-teal-900 active:bg-teal-950 rounded-md shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 whitespace-nowrap"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>

            {/* Admin Portal Button */}
            <button
              onClick={() => setIsAdminOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-teal-950 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 rounded-md transition-colors"
              title="Open Clinic Admin Panel & Database Bookings"
              aria-label="Admin Portal"
            >
              <Shield className="w-3.5 h-3.5 text-teal-800" />
              <span className="hidden sm:inline">Admin Portal</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-[#FAFAF8] px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="flex flex-col space-y-2">
            {navLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                onClick={e => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-teal-900 hover:bg-slate-100 rounded-md transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200/60 flex flex-col gap-2">
            <a
              href={`tel:${clinicInfo.phone}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-sm font-semibold text-teal-950 bg-teal-50 border border-teal-200/70 rounded-md"
            >
              <Phone className="w-4 h-4 text-teal-700" />
              Call {clinicInfo.phoneDisplay}
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsAdminOpen(true);
              }}
              className="flex items-center justify-center gap-2 w-full py-2 px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300/80 rounded-md transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-teal-800" />
              <span>Admin Portal (Database Bookings)</span>
            </button>
            <div className="flex items-center justify-between text-xs text-slate-500 px-1 pt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                10 AM–2 PM & 4 PM–9 PM
              </span>
              <span>Piranwadi, Belagavi</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
