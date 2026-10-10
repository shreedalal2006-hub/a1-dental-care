/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ClinicProvider } from './context/ClinicContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { QuickAppointmentBar } from './components/QuickAppointmentBar';
import { AboutDoctor } from './components/AboutDoctor';
import { ServicesSection } from './components/ServicesSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { PatientJourney } from './components/PatientJourney';
import { ClinicGallery } from './components/ClinicGallery';
import { GoogleRatingSection } from './components/GoogleRatingSection';
import { LocationSection } from './components/LocationSection';
import { FAQSection } from './components/FAQSection';
import { BookingModal } from './components/BookingModal';
import { AdminDashboard } from './components/AdminDashboard';
import { MobileStickyBar } from './components/MobileStickyBar';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <ClinicProvider>
      <div className="min-h-screen bg-[#FAFAF8] text-slate-800 flex flex-col font-sans selection:bg-teal-800 selection:text-white">
        
        {/* Sticky Header with 3-Zone Contract */}
        <Header />

        {/* Main Content Sections */}
        <main className="flex-1">
          {/* 1. Hero Section */}
          <Hero />

          {/* 2. Quick Appointment Bar */}
          <QuickAppointmentBar />

          {/* 3. About Dr. Akshata */}
          <AboutDoctor />

          {/* 4. Services Grid (Editable Placeholders) */}
          <ServicesSection />

          {/* 5. Why Choose A1 Dental Care */}
          <WhyChooseUs />

          {/* 6. Patient Journey (01 Book, 02 Visit, 03 Care) */}
          <PatientJourney />

          {/* 7. Inside A1 Dental Care - Gallery */}
          <ClinicGallery />

          {/* 8. Google Review / Trust Section (5.0 Google Rating) */}
          <GoogleRatingSection />

          {/* 9. Clinic Hours & Location (Live IST Status + Interactive Map) */}
          <LocationSection />

          {/* 10. Frequently Asked Questions */}
          <FAQSection />
        </main>

        {/* Footer */}
        <Footer />

        {/* Core Modals & Overlays */}
        <BookingModal />
        <AdminDashboard />

        {/* Mobile Sticky Action Bar */}
        <MobileStickyBar />

      </div>
    </ClinicProvider>
  );
}
