"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { useEvents, useEvent, incrementEventViews } from "@/lib/useEvents";
import { addRegistration, useEventRegistrations } from "@/lib/useRegistrations";
import { isValidImageSrc } from "@/lib/utils";

function isUnoptimizedImg(src?: string): boolean {
  if (!src) return false;
  return (
    src.startsWith("blob:") ||
    src.startsWith("data:") ||
    src.endsWith(".svg")
  );
}

function EventDetailSkeleton() {
  return (
    <section className="w-full bg-[#FAFAFA] text-[#0c0c0c] pt-32 sm:pt-40 px-6 sm:px-10 lg:px-12 pb-24 min-h-screen animate-pulse">
      <div className="max-w-[1280px] mx-auto w-full flex flex-col">
        <div className="flex justify-between items-center mb-12">
          <div className="h-10 w-36 bg-gray-200 rounded-full" />
          <div className="flex gap-2">
            <div className="h-7 w-24 bg-gray-200 rounded-full" />
            <div className="h-7 w-28 bg-gray-200 rounded-full" />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row justify-between gap-12 mb-16">
          <div className="w-full lg:w-2/3 space-y-4">
            <div className="h-14 bg-gray-200 rounded w-4/5" />
            <div className="h-6 bg-gray-200 rounded w-3/5" />
          </div>
          <div className="w-full lg:w-1/3 h-48 bg-gray-200 rounded-2xl" />
        </div>
        <div className="w-full h-[450px] bg-gray-200 rounded-2xl mb-16" />
      </div>
    </section>
  );
}

export default function EventDetail({ id }: { id: string }) {
  const { event, isLoading } = useEvent(id);
  const { events } = useEvents();
  const { registrations } = useEventRegistrations(id);

  // Registration form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState("1");
  const [dietary, setDietary] = useState("None");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState(false);

  useEffect(() => {
    if (event?.id) {
      incrementEventViews(event.id);
    }
  }, [event?.id]);

  if (isLoading) {
    return <EventDetailSkeleton />;
  }

  if (!event) {
    notFound();
  }

  const validImages = (event.images || []).filter(
    (img) => isValidImageSrc(img) || isUnoptimizedImg(img)
  );
  const heroImage = validImages[0] || "/images/hero-bg.png";
  const otherEvents = events.filter((e) => e.id !== event.id).slice(0, 3);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!firstName.trim()) {
      setRegError("Please enter your first name.");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setRegError("Please enter a valid email address.");
      return;
    }

    setRegError(null);
    setSubmitting(true);

    try {
      await addRegistration(event.id, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        dietary,
        guests,
        notes: notes.trim(),
      });
      setRegSuccess(true);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setGuests("1");
      setDietary("None");
      setNotes("");
    } catch {
      setRegError("Could not complete registration. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="w-full bg-[#FAFAFA] text-[#0c0c0c] pt-32 sm:pt-40 px-6 sm:px-10 lg:px-12 pb-24 min-h-screen">
      <div className="max-w-[1280px] mx-auto w-full flex flex-col">
        {/* Back Button & Status */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-12">
          <Link
            href="/events"
            className="font-open-sauce text-xs font-bold uppercase tracking-widest text-[#0c0c0c]/50 hover:text-[#0c0c0c] transition-colors inline-block border border-[#0c0c0c]/20 rounded-full px-5 py-2.5 w-max"
          >
            ← Back to Events
          </Link>

          <div className="flex items-center gap-2.5">
            <span className="px-4 py-1.5 rounded-full text-[11px] font-open-sauce font-bold uppercase tracking-widest border border-[#0c0c0c]/15 text-[#0c0c0c]/70">
              {event.type}
            </span>
            <span
              className={`px-4 py-1.5 rounded-full text-[11px] font-open-sauce font-bold uppercase tracking-widest text-white ${
                event.status === "Open" || event.status === "Upcoming"
                  ? "bg-[#0048ff]"
                  : "bg-[#0c0c0c]"
              }`}
            >
              {event.status === "Open" ? "Registration Open" : event.status}
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-20 mb-16">
          <div className="w-full lg:w-2/3">
            <h1 className="font-open-sauce text-4xl sm:text-6xl md:text-7xl font-medium tracking-tight leading-[1.05] mb-6">
              {event.title}
            </h1>
            <p className="font-open-sauce text-[#0c0c0c]/60 text-lg sm:text-xl font-light leading-relaxed max-w-2xl mb-8">
              {event.subtitle || event.description?.[0]}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#register"
                className="px-8 py-4 bg-[#0048ff] text-white font-open-sauce text-sm font-semibold tracking-wide hover:bg-[#003bd0] transition-colors inline-flex items-center gap-2"
              >
                Reserve Your Spot ({event.price || "Free"})
                <ArrowRight size={16} />
              </a>
              {event.agenda && event.agenda.length > 0 && (
                <a
                  href="#agenda"
                  className="px-7 py-4 bg-white border border-[#0c0c0c]/15 text-[#0c0c0c] font-open-sauce text-sm font-semibold tracking-wide hover:bg-gray-100 transition-colors"
                >
                  View Event Schedule
                </a>
              )}
            </div>
          </div>

          {/* Right Key Logistics Column */}
          <div className="w-full lg:w-1/3 grid grid-cols-2 lg:grid-cols-1 gap-5 lg:pl-10 lg:border-l border-[#0c0c0c]/10">
            <div className="flex flex-col gap-1">
              <span className="font-open-sauce text-[10px] font-bold tracking-[0.2em] uppercase text-[#0c0c0c]/40">
                Date
              </span>
              <span className="font-open-sauce text-sm sm:text-base font-bold text-[#0048ff]">
                {event.date}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-open-sauce text-[10px] font-bold tracking-[0.2em] uppercase text-[#0c0c0c]/40">
                Time
              </span>
              <span className="font-open-sauce text-sm sm:text-base font-medium">
                {event.time || "10:00 AM"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-open-sauce text-[10px] font-bold tracking-[0.2em] uppercase text-[#0c0c0c]/40">
                Venue / Location
              </span>
              <span className="font-open-sauce text-sm sm:text-base font-medium">
                {event.location}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-open-sauce text-[10px] font-bold tracking-[0.2em] uppercase text-[#0c0c0c]/40">
                Capacity &amp; Admission
              </span>
              <span className="font-open-sauce text-sm sm:text-base font-medium">
                {event.capacity || "Open"} • {event.price || "Free"}
              </span>
            </div>
          </div>
        </div>

        {/* Hero / Gallery Images */}
        {validImages.length >= 3 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 gap-4 h-[420px] sm:h-[540px] mb-16 sm:mb-24">
            <div className="relative lg:col-span-2 lg:row-span-2 rounded-3xl overflow-hidden bg-[#0c0c0c]/5">
              {isUnoptimizedImg(validImages[0]) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={validImages[0]}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={validImages[0]}
                  alt={event.title}
                  fill
                  className="object-cover"
                  priority
                />
              )}
            </div>
            <div className="hidden lg:block relative rounded-3xl overflow-hidden bg-[#0c0c0c]/5">
              {isUnoptimizedImg(validImages[1]) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={validImages[1]}
                  alt={`${event.title} gallery 2`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={validImages[1]}
                  alt={`${event.title} gallery 2`}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div className="hidden lg:block relative rounded-3xl overflow-hidden bg-[#0c0c0c]/5">
              {isUnoptimizedImg(validImages[2]) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={validImages[2]}
                  alt={`${event.title} gallery 3`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={validImages[2]}
                  alt={`${event.title} gallery 3`}
                  fill
                  className="object-cover"
                />
              )}
            </div>
          </div>
        ) : (
          <div className="w-full h-[45vh] sm:h-[58vh] md:h-[65vh] relative rounded-3xl overflow-hidden bg-[#0c0c0c]/5 mb-16 sm:mb-24">
            {isUnoptimizedImg(heroImage) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={heroImage}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={heroImage}
                alt={event.title}
                fill
                className="object-cover"
                priority
              />
            )}
          </div>
        )}

        {/* Main Content (2/3) & Registration Sidebar (1/3) */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 relative">
          {/* Left Column */}
          <div className="w-full lg:w-7/12 flex flex-col gap-14">
            {/* About the Event */}
            <div>
              <h2 className="font-open-sauce text-3xl sm:text-4xl font-medium tracking-tight mb-6">
                About the Gathering
              </h2>
              <div className="flex flex-col gap-5">
                {event.description.map((para, idx) => (
                  <p
                    key={idx}
                    className="font-open-sauce text-base sm:text-lg text-[#0c0c0c]/70 font-light leading-relaxed whitespace-pre-line"
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* Highlights & Perfect For */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t border-[#0c0c0c]/10">
              {event.highlights?.filter(Boolean).length > 0 && (
                <div>
                  <h3 className="font-open-sauce text-xs font-bold uppercase tracking-[0.2em] text-[#0c0c0c]/40 mb-5">
                    Event Highlights
                  </h3>
                  <ul className="space-y-3.5">
                    {event.highlights.filter(Boolean).map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 font-open-sauce text-sm sm:text-base font-medium text-[#0c0c0c]"
                      >
                        <CheckCircle2
                          size={18}
                          className="text-[#0048ff] shrink-0 mt-0.5"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {event.perfectFor?.filter(Boolean).length > 0 && (
                <div>
                  <h3 className="font-open-sauce text-xs font-bold uppercase tracking-[0.2em] text-[#0c0c0c]/40 mb-5">
                    Who Should Attend
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {event.perfectFor.filter(Boolean).map((item, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-white border border-[#0c0c0c]/15 rounded-full font-open-sauce text-xs font-bold text-[#0c0c0c]/80"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Accessibility & Venue Note */}
            {event.accessibility && (
              <div className="p-6 rounded-2xl bg-white border border-[#0c0c0c]/10 flex items-start gap-4">
                <ShieldCheck
                  size={22}
                  className="text-[#0048ff] shrink-0 mt-0.5"
                />
                <div>
                  <h4 className="font-open-sauce text-sm font-bold text-[#0c0c0c] mb-1">
                    Accessibility &amp; Hospitality
                  </h4>
                  <p className="font-open-sauce text-sm text-[#0c0c0c]/60 leading-relaxed">
                    {event.accessibility}
                  </p>
                </div>
              </div>
            )}

            {/* Agenda / Event Schedule */}
            {event.agenda?.filter((a) => a.title).length > 0 && (
              <div id="agenda" className="pt-8 border-t border-[#0c0c0c]/10 scroll-mt-32">
                <span className="font-open-sauce text-[10px] font-bold uppercase tracking-[0.25em] text-[#0048ff] block mb-2">
                  Order of Service &amp; Sessions
                </span>
                <h2 className="font-open-sauce text-3xl sm:text-4xl font-medium tracking-tight mb-10">
                  Event Schedule
                </h2>

                <div className="flex flex-col">
                  {event.agenda
                    .filter((a) => a.title)
                    .map((item, idx, arr) => (
                      <div key={idx} className="flex gap-6 sm:gap-10 group">
                        <div className="w-24 sm:w-28 shrink-0 pt-1">
                          <span className="font-open-sauce text-xs sm:text-sm font-bold text-[#0048ff] uppercase tracking-wider">
                            {item.time}
                          </span>
                        </div>
                        <div className="relative flex flex-col items-center">
                          <span className="w-3.5 h-3.5 rounded-full bg-[#0c0c0c] group-hover:bg-[#0048ff] transition-colors z-10 mt-1.5" />
                          {idx !== arr.length - 1 && (
                            <div className="w-px flex-1 bg-[#0c0c0c]/15 my-1" />
                          )}
                        </div>
                        <div className="pb-10 flex-1">
                          <h3 className="font-open-sauce text-lg sm:text-xl font-bold text-[#0c0c0c] mb-1.5">
                            {item.title}
                          </h3>
                          {item.desc && (
                            <p className="font-open-sauce text-sm sm:text-base text-[#0c0c0c]/60 font-light leading-relaxed">
                              {item.desc}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Host & Registration Form */}
          <div className="w-full lg:w-5/12 flex flex-col gap-8">
            {/* Host Card */}
            {event.host?.name && (
              <div className="bg-white border border-[#0c0c0c]/10 rounded-3xl p-7 flex items-center gap-4">
                {(isValidImageSrc(event.host.image) ||
                  isUnoptimizedImg(event.host.image)) && (
                  <div className="w-16 h-16 rounded-full overflow-hidden relative shrink-0 bg-[#0c0c0c]/5">
                    {isUnoptimizedImg(event.host.image) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={event.host.image}
                        alt={event.host.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image
                        src={event.host.image}
                        alt={event.host.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                )}
                <div>
                  <span className="font-open-sauce text-[10px] font-bold uppercase tracking-[0.2em] text-[#0048ff] block mb-1">
                    Hosted By
                  </span>
                  <h3 className="font-open-sauce text-lg font-bold text-[#0c0c0c]">
                    {event.host.name}
                  </h3>
                  {event.host.role && (
                    <p className="font-open-sauce text-xs text-[#0c0c0c]/60 font-medium">
                      {event.host.role}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Registration Form Card */}
            <div
              id="register"
              className="bg-white border border-[#0c0c0c]/15 rounded-3xl p-8 sm:p-10 shadow-sm lg:sticky lg:top-32 scroll-mt-32"
            >
              <div className="mb-6 pb-6 border-b border-[#0c0c0c]/10">
                <span className="font-open-sauce text-[10px] font-bold uppercase tracking-[0.25em] text-[#0048ff] block mb-2">
                  RSVP &amp; Registration
                </span>
                <h3 className="font-open-sauce text-2xl sm:text-3xl font-bold tracking-tight text-[#0c0c0c]">
                  Reserve Your Spot
                </h3>
                <p className="font-open-sauce text-xs sm:text-sm text-[#0c0c0c]/60 mt-1">
                  {event.date} • {event.location}
                </p>
              </div>

              {/* Dynamic Status / Error Announcements */}
              <div aria-live="polite">
                {regError && (
                  <div
                    role="alert"
                    className="mb-5 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-start gap-2.5"
                  >
                    <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-500" />
                    <span>{regError}</span>
                  </div>
                )}

                {regSuccess && (
                  <div className="mb-6 p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
                    <div className="flex items-center gap-2 font-open-sauce font-bold text-sm text-emerald-800">
                      <CheckCircle2 size={18} className="text-emerald-600" />
                      <span>Registration Confirmed!</span>
                    </div>
                    <p className="font-open-sauce text-xs text-emerald-700 leading-relaxed">
                      Thank you for registering for{" "}
                      <strong>{event.title}</strong>. Your RSVP has been recorded
                      and our hospitality team looks forward to welcoming you.
                    </p>
                    <button
                      type="button"
                      onClick={() => setRegSuccess(false)}
                      className="text-xs font-bold text-emerald-800 underline pt-1"
                    >
                      Register another guest
                    </button>
                  </div>
                )}
              </div>

              {!regSuccess && (
                <form
                  onSubmit={handleRegisterSubmit}
                  noValidate
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="reg-first-name"
                        className="block font-open-sauce text-[11px] font-bold uppercase tracking-wider text-[#0c0c0c]/60 mb-1.5"
                      >
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="reg-first-name"
                        name="firstName"
                        type="text"
                        required
                        autoComplete="given-name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        className="w-full px-4 py-3 rounded-xl border border-[#0c0c0c]/15 bg-[#FAFAFA] text-sm font-open-sauce focus:outline-none focus:bg-white focus:border-[#0048ff] transition-colors"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="reg-last-name"
                        className="block font-open-sauce text-[11px] font-bold uppercase tracking-wider text-[#0c0c0c]/60 mb-1.5"
                      >
                        Last Name
                      </label>
                      <input
                        id="reg-last-name"
                        name="lastName"
                        type="text"
                        autoComplete="family-name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        className="w-full px-4 py-3 rounded-xl border border-[#0c0c0c]/15 bg-[#FAFAFA] text-sm font-open-sauce focus:outline-none focus:bg-white focus:border-[#0048ff] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="reg-email"
                      className="block font-open-sauce text-[11px] font-bold uppercase tracking-wider text-[#0c0c0c]/60 mb-1.5"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="reg-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john.doe@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-[#0c0c0c]/15 bg-[#FAFAFA] text-sm font-open-sauce focus:outline-none focus:bg-white focus:border-[#0048ff] transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="reg-phone"
                        className="block font-open-sauce text-[11px] font-bold uppercase tracking-wider text-[#0c0c0c]/60 mb-1.5"
                      >
                        Phone Number
                      </label>
                      <input
                        id="reg-phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+44 7700 900000"
                        className="w-full px-4 py-3 rounded-xl border border-[#0c0c0c]/15 bg-[#FAFAFA] text-sm font-open-sauce focus:outline-none focus:bg-white focus:border-[#0048ff] transition-colors"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="reg-guests"
                        className="block font-open-sauce text-[11px] font-bold uppercase tracking-wider text-[#0c0c0c]/60 mb-1.5"
                      >
                        Total Attendees
                      </label>
                      <select
                        id="reg-guests"
                        name="guests"
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[#0c0c0c]/15 bg-[#FAFAFA] text-sm font-open-sauce focus:outline-none focus:bg-white focus:border-[#0048ff] transition-colors"
                      >
                        {["1", "2", "3", "4", "5", "6+"].map((n) => (
                          <option key={n} value={n}>
                            {n} {n === "1" ? "Attendee" : "Attendees"}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="reg-dietary"
                      className="block font-open-sauce text-[11px] font-bold uppercase tracking-wider text-[#0c0c0c]/60 mb-1.5"
                    >
                      Dietary Requirements
                    </label>
                    <select
                      id="reg-dietary"
                      name="dietary"
                      value={dietary}
                      onChange={(e) => setDietary(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#0c0c0c]/15 bg-[#FAFAFA] text-sm font-open-sauce focus:outline-none focus:bg-white focus:border-[#0048ff] transition-colors"
                    >
                      {[
                        "None",
                        "Vegetarian",
                        "Vegan",
                        "Gluten-Free",
                        "Nut Allergy",
                      ].map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="reg-notes"
                      className="block font-open-sauce text-[11px] font-bold uppercase tracking-wider text-[#0c0c0c]/60 mb-1.5"
                    >
                      Notes or Prayer Request (Optional)
                    </label>
                    <textarea
                      id="reg-notes"
                      name="notes"
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any accessibility needs or questions..."
                      className="w-full px-4 py-3 rounded-xl border border-[#0c0c0c]/15 bg-[#FAFAFA] text-sm font-open-sauce focus:outline-none focus:bg-white focus:border-[#0048ff] resize-none transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || event.status === "Past"}
                    className="w-full py-4 bg-[#0048ff] hover:bg-[#003bd0] disabled:opacity-50 text-white font-open-sauce text-sm font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                  >
                    {submitting
                      ? "Submitting Registration..."
                      : event.status === "Past"
                      ? "Event Has Concluded"
                      : "Complete Registration"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[#0c0c0c]/10 my-24" />

        {/* Other Upcoming Events */}
        {otherEvents.length > 0 && (
          <div className="flex flex-col w-full">
            <div className="flex items-center justify-between mb-12">
              <h3 className="font-open-sauce text-3xl sm:text-4xl font-medium tracking-tight uppercase">
                More Upcoming Events
              </h3>
              <Link
                href="/events"
                className="font-open-sauce text-[10px] font-bold tracking-[0.2em] uppercase text-[#0c0c0c]/50 hover:text-[#0c0c0c] border border-[#0c0c0c]/20 rounded-full px-4 py-2 transition-colors"
              >
                See All Events
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {otherEvents.map((other) => {
                const otherImg =
                  isValidImageSrc(other.images?.[0]) ||
                  isUnoptimizedImg(other.images?.[0])
                    ? other.images[0]
                    : "/images/hero-bg.png";
                return (
                  <Link
                    href={`/events/${other.id}`}
                    key={other.id}
                    className="flex flex-col group"
                  >
                    <div className="w-full aspect-[4/3] relative overflow-hidden bg-[#0c0c0c]/5 mb-5">
                      {isUnoptimizedImg(otherImg) ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={otherImg}
                          alt={other.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <Image
                          src={otherImg}
                          alt={other.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      )}
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#0c0c0c]/80 text-white font-open-sauce text-[10px] font-bold uppercase tracking-widest">
                        {other.date}
                      </span>
                    </div>
                    <h4 className="font-open-sauce text-xl font-bold tracking-tight mb-2 group-hover:text-[#0048ff] transition-colors line-clamp-2">
                      {other.title}
                    </h4>
                    <p className="font-open-sauce text-sm text-[#0c0c0c]/55 line-clamp-2">
                      {other.subtitle || other.description?.[0]}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

