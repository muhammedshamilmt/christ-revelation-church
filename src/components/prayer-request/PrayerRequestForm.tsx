"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Heart, Lock, ArrowRight, RotateCcw, Home, Calendar } from "lucide-react";
import { toast } from "react-hot-toast";
import { addPrayerRequest } from "@/lib/usePrayerRequests";

const CATEGORY_MAP: Record<string, string> = {
  healing: "Healing",
  guidance: "Guidance",
  thanksgiving: "Thanksgiving",
  other: "Other",
};

const TITLE_MAP: Record<string, string> = {
  mr: "Mr.",
  mrs: "Mrs.",
  ms: "Ms.",
  dr: "Dr.",
};

export default function PrayerRequestForm() {
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [apt, setApt] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [requestText, setRequestText] = useState("");
  const [contactPreference, setContactPreference] = useState<"yes" | "no">("no");
  const [isConfidential, setIsConfidential] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [submissionSummary, setSubmissionSummary] = useState<{
    fullName: string;
    category: string;
    isConfidential: boolean;
    contactPreference: "yes" | "no";
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!category) {
      setFormError("Please select a prayer request category.");
      return;
    }
    if (!firstName.trim() || !lastName.trim()) {
      setFormError("Please enter both your first and last name.");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFormError("Please enter a valid email address.");
      return;
    }
    if (
      !street.trim() ||
      !city.trim() ||
      !state.trim() ||
      !zip.trim() ||
      !country.trim()
    ) {
      setFormError("Please complete all required address fields.");
      return;
    }
    if (!requestText.trim() || requestText.trim().length < 10) {
      setFormError(
        "Please share your prayer request details (at least 10 characters)."
      );
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    const resolvedCategory = CATEGORY_MAP[category] || category;
    const resolvedTitle = TITLE_MAP[title] || title;
    const fullName = `${resolvedTitle} ${firstName.trim()} ${lastName.trim()}`.trim();

    try {
      await addPrayerRequest({
        category: resolvedCategory,
        title: resolvedTitle,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        street: street.trim(),
        apt: apt.trim(),
        city: city.trim(),
        state: state.trim(),
        zip: zip.trim(),
        country: country.trim(),
        request: requestText.trim(),
        contactPreference,
        isConfidential,
      });

      setSubmissionSummary({
        fullName,
        category: resolvedCategory,
        isConfidential,
        contactPreference,
      });

      setSubmittedSuccess(true);
      toast.success("Prayer request submitted securely");

      // Reset fields
      setCategory("");
      setTitle("");
      setFirstName("");
      setLastName("");
      setEmail("");
      setStreet("");
      setApt("");
      setCity("");
      setState("");
      setZip("");
      setCountry("");
      setRequestText("");
      setContactPreference("no");
      setIsConfidential(false);
    } catch {
      setFormError("Failed to submit your prayer request. Please try again.");
      toast.error("Failed to submit prayer request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSubmittedSuccess(false);
    setSubmissionSummary(null);
    setFormError(null);
  };

  return (
    <section className="w-full bg-[#FAFAFA] text-[#0c0c0c] py-24 sm:py-32 px-6 sm:px-10 lg:px-12 flex justify-center">
      <div className="w-full max-w-[800px] bg-white p-8 sm:p-16 rounded-[2rem] border border-[#0c0c0c]/10 shadow-sm transition-all">
        <AnimatePresence mode="wait">
          {submittedSuccess ? (
            /* ─── DEDICATED SUCCESS SCREEN ──────────────────────────────── */
            <motion.div
              key="success-view"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col items-center text-center py-4"
            >
              {/* Radiating Success Icon */}
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full bg-emerald-50 border-8 border-emerald-100 flex items-center justify-center text-emerald-600 shadow-lg shadow-emerald-600/10">
                  <CheckCircle2 size={40} strokeWidth={2.5} />
                </div>
              </div>

              <span className="inline-block px-3.5 py-1.5 rounded-full text-xs font-open-sauce font-bold uppercase tracking-widest bg-emerald-100/70 text-emerald-800 mb-4">
                Request Received
              </span>

              <h2 className="font-open-sauce text-3xl sm:text-4xl font-bold tracking-tight text-[#0c0c0c] mb-3">
                We Are Standing With You in Prayer
              </h2>

              <p className="font-open-sauce text-[#0c0c0c]/70 text-base sm:text-lg font-light max-w-lg mb-8 leading-relaxed">
                Thank you, <strong className="font-semibold text-[#0c0c0c]">{submissionSummary?.fullName}</strong>. Your request has been securely delivered to our pastoral team and dedicated intercessors.
              </p>

              {/* Request Metadata Card */}
              {submissionSummary && (
                <div className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-6 mb-8 text-left grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                      Category
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-semibold text-gray-800 text-sm">
                      <Heart size={14} className="text-rose-500" />
                      {submissionSummary.category}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                      Privacy
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-semibold text-gray-800 text-sm">
                      {submissionSummary.isConfidential ? (
                        <>
                          <Lock size={14} className="text-amber-500" />
                          Confidential
                        </>
                      ) : (
                        "Open for Ministry"
                      )}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                      Pastoral Contact
                    </span>
                    <span className="font-semibold text-gray-800 text-sm">
                      {submissionSummary.contactPreference === "yes" ? "Requested" : "Standard Intercession"}
                    </span>
                  </div>
                </div>
              )}

              {/* Scripture Card */}
              <div className="w-full border-l-4 border-[#0048FF] bg-[#0048FF]/5 rounded-r-2xl p-6 mb-10 text-left">
                <p className="font-open-sauce italic text-sm sm:text-base text-[#0c0c0c]/85 leading-relaxed mb-2">
                  &ldquo;Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.&rdquo;
                </p>
                <span className="font-open-sauce text-xs font-bold uppercase tracking-wider text-[#0048FF]">
                  — Philippians 4:6-7
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#0c0c0c] text-white font-open-sauce text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[#0048FF] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <RotateCcw size={14} /> Submit Another Request
                </button>

                <Link
                  href="/"
                  className="w-full sm:w-auto px-6 py-3.5 border border-gray-200 text-[#0c0c0c] font-open-sauce text-xs font-bold uppercase tracking-widest rounded-full hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Home size={14} /> Return to Home
                </Link>

                <Link
                  href="/events"
                  className="w-full sm:w-auto px-6 py-3.5 border border-gray-200 text-[#0c0c0c] font-open-sauce text-xs font-bold uppercase tracking-widest rounded-full hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Calendar size={14} /> View Events
                </Link>
              </div>
            </motion.div>
          ) : (
            /* ─── FORM VIEW ────────────────────────────────────────────── */
            <motion.div
              key="form-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-12 sm:mb-16">
                <h2 className="font-open-sauce text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight mb-4">
                  Submit a Request
                </h2>
                <p className="font-open-sauce text-[#0c0c0c]/60 text-sm sm:text-base font-light max-w-lg mx-auto">
                  Share your burdens with us. Our pastoral team and prayer warriors
                  are ready to stand with you in faith and intercession.
                </p>
              </div>

              {formError && (
                <div
                  role="alert"
                  className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 font-open-sauce text-sm flex items-start gap-3"
                >
                  <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
                {/* Category */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="category"
                    className="font-open-sauce text-xs font-bold uppercase tracking-widest text-[#0c0c0c]/80 ml-1"
                  >
                    Select a Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#FAFAFA] border border-[#0c0c0c]/10 rounded-2xl px-6 py-4 font-open-sauce text-sm font-medium outline-none focus:border-[#0048FF] focus:bg-white transition-all text-[#0c0c0c]"
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    <option value="healing">Healing &amp; Wholeness</option>
                    <option value="guidance">Wisdom &amp; Guidance</option>
                    <option value="thanksgiving">Thanksgiving &amp; Praise</option>
                    <option value="other">Other Needs</option>
                  </select>
                </div>

                {/* Name Group */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex flex-col gap-2 md:col-span-1">
                    <label
                      htmlFor="title"
                      className="font-open-sauce text-xs font-bold uppercase tracking-widest text-[#0c0c0c]/80 ml-1"
                    >
                      Title
                    </label>
                    <select
                      id="title"
                      name="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-[#FAFAFA] border border-[#0c0c0c]/10 rounded-2xl px-6 py-4 font-open-sauce text-sm font-medium outline-none focus:border-[#0048FF] focus:bg-white transition-all text-[#0c0c0c]"
                    >
                      <option value="">Title</option>
                      <option value="mr">Mr.</option>
                      <option value="mrs">Mrs.</option>
                      <option value="ms">Ms.</option>
                      <option value="dr">Dr.</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-1.5">
                    <label
                      htmlFor="firstName"
                      className="font-open-sauce text-xs font-bold uppercase tracking-widest text-[#0c0c0c]/80 ml-1"
                    >
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Jane"
                      className="w-full bg-[#FAFAFA] border border-[#0c0c0c]/10 rounded-2xl px-6 py-4 font-open-sauce text-sm font-medium outline-none focus:border-[#0048FF] focus:bg-white transition-all text-[#0c0c0c] placeholder:text-[#0c0c0c]/30"
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-1.5">
                    <label
                      htmlFor="lastName"
                      className="font-open-sauce text-xs font-bold uppercase tracking-widest text-[#0c0c0c]/80 ml-1"
                    >
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      className="w-full bg-[#FAFAFA] border border-[#0c0c0c]/10 rounded-2xl px-6 py-4 font-open-sauce text-sm font-medium outline-none focus:border-[#0048FF] focus:bg-white transition-all text-[#0c0c0c] placeholder:text-[#0c0c0c]/30"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="email"
                    className="font-open-sauce text-xs font-bold uppercase tracking-widest text-[#0c0c0c]/80 ml-1"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane.doe@example.com"
                    className="w-full bg-[#FAFAFA] border border-[#0c0c0c]/10 rounded-2xl px-6 py-4 font-open-sauce text-sm font-medium outline-none focus:border-[#0048FF] focus:bg-white transition-all text-[#0c0c0c] placeholder:text-[#0c0c0c]/30"
                  />
                </div>

                {/* Address lines */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label
                      htmlFor="street"
                      className="font-open-sauce text-xs font-bold uppercase tracking-widest text-[#0c0c0c]/80 ml-1"
                    >
                      Street Address *
                    </label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="123 Faith Way"
                      className="w-full bg-[#FAFAFA] border border-[#0c0c0c]/10 rounded-2xl px-6 py-4 font-open-sauce text-sm font-medium outline-none focus:border-[#0048FF] focus:bg-white transition-all text-[#0c0c0c] placeholder:text-[#0c0c0c]/30"
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-1">
                    <label
                      htmlFor="apt"
                      className="font-open-sauce text-xs font-bold uppercase tracking-widest text-[#0c0c0c]/80 ml-1"
                    >
                      Apt / Suite
                    </label>
                    <input
                      type="text"
                      id="apt"
                      name="apt"
                      value={apt}
                      onChange={(e) => setApt(e.target.value)}
                      placeholder="Apt 4B"
                      className="w-full bg-[#FAFAFA] border border-[#0c0c0c]/10 rounded-2xl px-6 py-4 font-open-sauce text-sm font-medium outline-none focus:border-[#0048FF] focus:bg-white transition-all text-[#0c0c0c] placeholder:text-[#0c0c0c]/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="city"
                      className="font-open-sauce text-xs font-bold uppercase tracking-widest text-[#0c0c0c]/80 ml-1"
                    >
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="London"
                      className="w-full bg-[#FAFAFA] border border-[#0c0c0c]/10 rounded-2xl px-6 py-4 font-open-sauce text-sm font-medium outline-none focus:border-[#0048FF] focus:bg-white transition-all text-[#0c0c0c] placeholder:text-[#0c0c0c]/30"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="state"
                      className="font-open-sauce text-xs font-bold uppercase tracking-widest text-[#0c0c0c]/80 ml-1"
                    >
                      State / County *
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="Greater London"
                      className="w-full bg-[#FAFAFA] border border-[#0c0c0c]/10 rounded-2xl px-6 py-4 font-open-sauce text-sm font-medium outline-none focus:border-[#0048FF] focus:bg-white transition-all text-[#0c0c0c] placeholder:text-[#0c0c0c]/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="zip"
                      className="font-open-sauce text-xs font-bold uppercase tracking-widest text-[#0c0c0c]/80 ml-1"
                    >
                      ZIP / Postal Code *
                    </label>
                    <input
                      type="text"
                      id="zip"
                      name="zip"
                      required
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      placeholder="SW1A 1AA"
                      className="w-full bg-[#FAFAFA] border border-[#0c0c0c]/10 rounded-2xl px-6 py-4 font-open-sauce text-sm font-medium outline-none focus:border-[#0048FF] focus:bg-white transition-all text-[#0c0c0c] placeholder:text-[#0c0c0c]/30"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="country"
                      className="font-open-sauce text-xs font-bold uppercase tracking-widest text-[#0c0c0c]/80 ml-1"
                    >
                      Country *
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="United Kingdom"
                      className="w-full bg-[#FAFAFA] border border-[#0c0c0c]/10 rounded-2xl px-6 py-4 font-open-sauce text-sm font-medium outline-none focus:border-[#0048FF] focus:bg-white transition-all text-[#0c0c0c] placeholder:text-[#0c0c0c]/30"
                    />
                  </div>
                </div>

                {/* Prayer Request details */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="request"
                    className="font-open-sauce text-xs font-bold uppercase tracking-widest text-[#0c0c0c]/80 ml-1"
                  >
                    Prayer Request(s) *
                  </label>
                  <textarea
                    id="request"
                    name="request"
                    required
                    rows={6}
                    value={requestText}
                    onChange={(e) => setRequestText(e.target.value)}
                    placeholder="Please share what you would like us to pray for..."
                    className="w-full bg-[#FAFAFA] border border-[#0c0c0c]/10 rounded-2xl px-6 py-4 font-open-sauce text-sm font-medium outline-none focus:border-[#0048FF] focus:bg-white transition-all placeholder:text-[#0c0c0c]/30 resize-none text-[#0c0c0c]"
                  />
                </div>

                {/* Contact Preference */}
                <div className="flex flex-col gap-3">
                  <label className="font-open-sauce text-xs font-bold uppercase tracking-widest text-[#0c0c0c]/80 ml-1">
                    Would you like someone to contact you?
                  </label>
                  <div className="flex items-center gap-6 ml-1">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="contact_preference"
                        value="yes"
                        checked={contactPreference === "yes"}
                        onChange={() => setContactPreference("yes")}
                        className="w-4 h-4 accent-[#0048FF]"
                      />
                      <span className="font-open-sauce text-sm font-medium group-hover:text-[#0048FF] transition-colors">
                        Yes
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="contact_preference"
                        value="no"
                        checked={contactPreference === "no"}
                        onChange={() => setContactPreference("no")}
                        className="w-4 h-4 accent-[#0048FF]"
                      />
                      <span className="font-open-sauce text-sm font-medium group-hover:text-[#0048FF] transition-colors">
                        No
                      </span>
                    </label>
                  </div>
                </div>

                {/* Confidentiality */}
                <div className="flex flex-col gap-2">
                  <label className="font-open-sauce text-xs font-bold uppercase tracking-widest text-[#0c0c0c]/80 ml-1">
                    Confidentiality
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group ml-1">
                    <input
                      type="checkbox"
                      checked={isConfidential}
                      onChange={(e) => setIsConfidential(e.target.checked)}
                      className="w-4 h-4 accent-[#0048FF] rounded"
                    />
                    <span className="font-open-sauce text-sm font-medium group-hover:text-[#0048FF] transition-colors">
                      Please keep my request confidential (Pastoral Team Only)
                    </span>
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-6 pt-6 border-t border-[#0c0c0c]/10">
                  <p className="font-open-sauce text-xs text-[#0c0c0c]/40 max-w-[280px]">
                    * Our pastoral team is ready to intercede on your behalf.
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-10 py-4 bg-[#0c0c0c] text-white font-open-sauce text-sm font-bold tracking-widest uppercase rounded-full hover:bg-[#0048FF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
