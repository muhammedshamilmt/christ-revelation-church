"use client";

import { useState } from "react";

export default function PrayerRequestForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Your prayer request has been submitted securely.");
    }, 1500);
  };

  return (
    <section className="w-full bg-[#FAFAFA] text-[#0c0c0c] py-24 sm:py-32 px-6 sm:px-10 lg:px-12 flex justify-center">
      <div className="w-full max-w-[800px] bg-white p-8 sm:p-16 rounded-[2rem] border border-[#0c0c0c]/10">
        
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-open-sauce text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight mb-4">
            Submit a Request
          </h2>
          <p className="font-open-sauce text-[#0c0c0c]/60 text-sm sm:text-base font-light max-w-lg mx-auto">
            Share your burdens with us. Our pastoral team and prayer warriors are ready to stand with you in faith and intercession.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          
          {/* Category */}
          <div className="flex flex-col gap-2">
            <label htmlFor="category" className="font-open-sauce text-xs font-bold uppercase tracking-widest text-[#0c0c0c]/80 ml-1">
              Select a Category *
            </label>
            <select
              id="category"
              required
              defaultValue=""
              className="w-full bg-[#FAFAFA] border border-[#0c0c0c]/10 rounded-2xl px-6 py-4 font-open-sauce text-sm font-medium outline-none focus:border-[#0048FF] focus:bg-white transition-all text-[#0c0c0c]"
            >
              <option value="" disabled>Select an option</option>
              <option value="healing">Healing</option>
              <option value="guidance">Guidance</option>
              <option value="thanksgiving">Thanksgiving</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Title & Name */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="flex flex-col gap-2 md:col-span-3">
              <label htmlFor="title" className="font-open-sauce text-xs font-bold uppercase tracking-widest text-[#0c0c0c]/80 ml-1">
                Title
              </label>
              <select
                id="title"
                defaultValue=""
                className="w-full bg-[#FAFAFA] border border-[#0c0c0c]/10 rounded-2xl px-6 py-4 font-open-sauce text-sm font-medium outline-none focus:border-[#0048FF] focus:bg-white transition-all text-[#0c0c0c]"
              >
                <option value="" disabled>Select</option>
                <option value="mr">Mr.</option>
                <option value="mrs">Mrs.</option>
                <option value="ms">Ms.</option>
                <option value="dr">Dr.</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-2 md:col-span-4">
              <label htmlFor="firstName" className="font-open-sauce text-xs font-bold uppercase tracking-widest text-[#0c0c0c]/80 ml-1">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                required
                placeholder="John"
                className="w-full bg-[#FAFAFA] border border-[#0c0c0c]/10 rounded-2xl px-6 py-4 font-open-sauce text-sm font-medium outline-none focus:border-[#0048FF] focus:bg-white transition-all placeholder:text-[#0c0c0c]/30"
              />
            </div>

            <div className="flex flex-col gap-2 md:col-span-5">
              <label htmlFor="lastName" className="font-open-sauce text-xs font-bold uppercase tracking-widest text-[#0c0c0c]/80 ml-1">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                required
                placeholder="Doe"
                className="w-full bg-[#FAFAFA] border border-[#0c0c0c]/10 rounded-2xl px-6 py-4 font-open-sauce text-sm font-medium outline-none focus:border-[#0048FF] focus:bg-white transition-all placeholder:text-[#0c0c0c]/30"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-open-sauce text-xs font-bold uppercase tracking-widest text-[#0c0c0c]/80 ml-1">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              required
              placeholder="john.doe@gmail.com"
              className="w-full bg-[#FAFAFA] border border-[#0c0c0c]/10 rounded-2xl px-6 py-4 font-open-sauce text-sm font-medium outline-none focus:border-[#0048FF] focus:bg-white transition-all placeholder:text-[#0c0c0c]/30"
            />
          </div>

          {/* Address Details */}
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="street" className="font-open-sauce text-xs font-bold uppercase tracking-widest text-[#0c0c0c]/80 ml-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  id="street"
                  required
                  placeholder="123 Main St"
                  className="w-full bg-[#FAFAFA] border border-[#0c0c0c]/10 rounded-2xl px-6 py-4 font-open-sauce text-sm font-medium outline-none focus:border-[#0048FF] focus:bg-white transition-all placeholder:text-[#0c0c0c]/30"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="apt" className="font-open-sauce text-xs font-bold uppercase tracking-widest text-[#0c0c0c]/80 ml-1">
                  Apt/Suite/Others
                </label>
                <input
                  type="text"
                  id="apt"
                  placeholder="Apt 4B"
                  className="w-full bg-[#FAFAFA] border border-[#0c0c0c]/10 rounded-2xl px-6 py-4 font-open-sauce text-sm font-medium outline-none focus:border-[#0048FF] focus:bg-white transition-all placeholder:text-[#0c0c0c]/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="city" className="font-open-sauce text-xs font-bold uppercase tracking-widest text-[#0c0c0c]/80 ml-1">
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  required
                  placeholder="San Francisco"
                  className="w-full bg-[#FAFAFA] border border-[#0c0c0c]/10 rounded-2xl px-6 py-4 font-open-sauce text-sm font-medium outline-none focus:border-[#0048FF] focus:bg-white transition-all placeholder:text-[#0c0c0c]/30"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="state" className="font-open-sauce text-xs font-bold uppercase tracking-widest text-[#0c0c0c]/80 ml-1">
                  State *
                </label>
                <input
                  type="text"
                  id="state"
                  required
                  placeholder="CA"
                  className="w-full bg-[#FAFAFA] border border-[#0c0c0c]/10 rounded-2xl px-6 py-4 font-open-sauce text-sm font-medium outline-none focus:border-[#0048FF] focus:bg-white transition-all placeholder:text-[#0c0c0c]/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="zip" className="font-open-sauce text-xs font-bold uppercase tracking-widest text-[#0c0c0c]/80 ml-1">
                  Zip Code *
                </label>
                <input
                  type="text"
                  id="zip"
                  required
                  placeholder="94105"
                  className="w-full bg-[#FAFAFA] border border-[#0c0c0c]/10 rounded-2xl px-6 py-4 font-open-sauce text-sm font-medium outline-none focus:border-[#0048FF] focus:bg-white transition-all placeholder:text-[#0c0c0c]/30"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="country" className="font-open-sauce text-xs font-bold uppercase tracking-widest text-[#0c0c0c]/80 ml-1">
                  Country *
                </label>
                <input
                  type="text"
                  id="country"
                  required
                  placeholder="United States"
                  className="w-full bg-[#FAFAFA] border border-[#0c0c0c]/10 rounded-2xl px-6 py-4 font-open-sauce text-sm font-medium outline-none focus:border-[#0048FF] focus:bg-white transition-all placeholder:text-[#0c0c0c]/30"
                />
              </div>
            </div>
          </div>

          {/* Prayer Request details */}
          <div className="flex flex-col gap-2">
            <label htmlFor="request" className="font-open-sauce text-xs font-bold uppercase tracking-widest text-[#0c0c0c]/80 ml-1">
              Prayer Request(s) *
            </label>
            <textarea
              id="request"
              required
              rows={6}
              placeholder="Please share what you would like us to pray for..."
              className="w-full bg-[#FAFAFA] border border-[#0c0c0c]/10 rounded-2xl px-6 py-4 font-open-sauce text-sm font-medium outline-none focus:border-[#0048FF] focus:bg-white transition-all placeholder:text-[#0c0c0c]/30 resize-none"
            ></textarea>
          </div>

          {/* Contact Preference */}
          <div className="flex flex-col gap-3">
            <label className="font-open-sauce text-xs font-bold uppercase tracking-widest text-[#0c0c0c]/80 ml-1">
              Would you like someone to contact you?
            </label>
            <div className="flex items-center gap-6 ml-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="radio" name="contact_preference" value="yes" className="w-4 h-4 accent-[#0048FF]" />
                <span className="font-open-sauce text-sm font-medium group-hover:text-[#0048FF] transition-colors">Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="radio" name="contact_preference" value="no" defaultChecked className="w-4 h-4 accent-[#0048FF]" />
                <span className="font-open-sauce text-sm font-medium group-hover:text-[#0048FF] transition-colors">No</span>
              </label>
            </div>
          </div>

          {/* Confidentiality */}
          <div className="flex flex-col gap-2">
            <label className="font-open-sauce text-xs font-bold uppercase tracking-widest text-[#0c0c0c]/80 ml-1">
              Confidentiality
            </label>
            <label className="flex items-center gap-3 cursor-pointer group ml-1">
              <input type="checkbox" className="w-4 h-4 accent-[#0048FF] rounded" />
              <span className="font-open-sauce text-sm font-medium group-hover:text-[#0048FF] transition-colors">Please keep my request confidential</span>
            </label>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-6 pt-6 border-t border-[#0c0c0c]/10">
            <p className="font-open-sauce text-xs text-[#0c0c0c]/40 max-w-[280px]">
              * Our pastoral team is ready to intercede on your behalf.
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-10 py-4 bg-[#0c0c0c] text-white font-open-sauce text-sm font-bold tracking-widest uppercase rounded-full hover:bg-[#0048FF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </button>
          </div>

        </form>
      </div>
    </section>
  );
}
