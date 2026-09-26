"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  HelpCircle,
  MessageSquare,
  Mail,
  Globe,
  Code2,
  Layers,
  Shield,
  Zap,
  ChevronDown,
  ExternalLink,
  Copy,
  Check,
  Terminal,
  Package,
  GitBranch,
  Clock,
  User,
  Phone,
  MapPin,
  Heart,
} from "lucide-react";
import Image from "next/image";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, type: "tween" },
} as const);

// ── FAQ DATA ─────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "How do I add a new subadmin?",
    a: "Navigate to Settings → Subadmins from the sidebar. Click 'Add New Subadmin' at the top right, fill in their details, assign appropriate permissions, and save.",
  },
  {
    q: "Can I customize the notification preferences?",
    a: "Yes, you can manage your notifications by clicking on the Profile icon in the top right, selecting Settings, and navigating to the Notifications tab.",
  },
  {
    q: "What happens when my target time runs low?",
    a: "You will receive an automated warning when your target time drops below a critical threshold. You can instantly request more time from the profile dropdown.",
  },
  {
    q: "How can I export the analytics report?",
    a: "On the Analytics dashboard, there is an 'Export' button on the top right. You can choose to export the data in CSV or PDF formats.",
  },
];

// ── TECH STACK DATA ───────────────────────────────────────────────────────────
const STACK = [
  { icon: Globe, label: "Next.js 16", desc: "App Router, RSC, Server Actions", color: "text-gray-900" },
  { icon: Code2, label: "TypeScript 5", desc: "Strict mode, full type coverage", color: "text-blue-500" },
  { icon: Layers, label: "Tailwind CSS v4", desc: "Utility-first styling", color: "text-cyan-500" },
  { icon: Zap, label: "Framer Motion", desc: "Page & component animations", color: "text-purple-500" },
  { icon: Package, label: "Lucide React", desc: "Clean, consistent iconography", color: "text-emerald-500" },
  { icon: Shield, label: "Supabase (planned)", desc: "Auth, DB, Storage", color: "text-green-500" },
  { icon: Terminal, label: "Modern React", desc: "Hooks & clean components", color: "text-amber-500" },
  { icon: GitBranch, label: "Vercel", desc: "Edge deployments", color: "text-gray-900" },
];

// ── CONTACT CHANNELS ─────────────────────────────────────────────────────────
const CONTACTS = [
  {
    icon: Mail,
    label: "Email Support",
    value: "support@theglobalpeacemakers.org",
    sub: "Response within 24 hours",
    color: "bg-gray-100 text-black",
  },
  {
    icon: GitBranch,
    label: "GitHub Repository",
    value: "github.com/theglobalpeacemakers",
    sub: "Issues & PRs",
    color: "bg-gray-100 text-gray-700",
  },
  {
    icon: Phone,
    label: "Emergency Line",
    value: "+1 (555) 000-PEACE",
    sub: "Critical issues only",
    color: "bg-emerald-50 text-emerald-500",
  },
];

// ── DEVELOPER CARD ────────────────────────────────────────────────────────────
const DEVELOPER = {
  name: "Shamil",
  role: "Lead Developer & System Architect",
  org: "The Global Peacemakers",
  location: "Global Operations",
  email: "shamil@theglobalpeacemakers.org",
  github: "github.com/shamil-dev",
  since: "2024",
  stack: ["Next.js", "TypeScript", "Tailwind", "Supabase", "Framer Motion"],
  bio: "Designed and built The Global Peacemakers platform from the ground up — public site, admin panel, donation infrastructure, and internal tooling. Focused on performance, aesthetics, and clean architecture.",
};

// ── VERSION INFO ──────────────────────────────────────────────────────────────
const VERSION = {
  panel: "v2.4.1",
  build: "2026.09.12",
  node: "20.x LTS",
  next: "16.3.4",
};

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full text-left rounded-2xl bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all duration-200 overflow-hidden"
    >
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <span className="text-sm font-bold text-gray-900 leading-snug">{q}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-gray-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </div>
      {open && (
        <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
          <p className="pt-3">{a}</p>
        </div>
      )}
    </button>
  );
}

function CopyBadge({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 text-[10px] font-mono text-gray-600 hover:text-gray-900 transition-all"
    >
      {copied ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} />}
      {text}
    </button>
  );
}

export default function AdminHelpPage() {
  return (
    <div className="flex flex-col gap-8 w-full pb-16 max-w-7xl mx-auto px-8 pt-8">

      {/* ── PAGE HEADER ── */}
      <motion.div {...fadeUp(0)} className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Help & Support</h1>
        <p className="text-sm text-gray-500">Documentation, developer info, and contact channels for the Admin Panel.</p>
      </motion.div>

      {/* ── TOP ROW: Version banner + quick links ── */}
      <motion.div {...fadeUp(0.05)} className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Version card */}
        <div className="lg:col-span-2 rounded-3xl bg-white border border-gray-200 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center shrink-0">
            <span className="text-white font-black text-xl">CRC</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-lg font-black text-gray-900">Admin Panel</span>
              <span className="px-2 py-0.5 rounded-full bg-gray-100 border border-black/20 text-[10px] font-bold text-black uppercase tracking-widest">
                {VERSION.panel}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-3">Internal administration interface for operations.</p>
            <div className="flex flex-wrap gap-2">
              <CopyBadge text={`Build ${VERSION.build}`} />
              <CopyBadge text={`Next.js ${VERSION.next}`} />
              <CopyBadge text={`Node ${VERSION.node}`} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-emerald-600">All Systems Operational</span>
          </div>
        </div>

        {/* Quick nav */}
        <div className="rounded-3xl bg-white border border-gray-200 p-6 flex flex-col gap-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Quick Links</p>
          {[
            { label: "FAQ", href: "#faq", icon: HelpCircle },
            { label: "Tech Stack", href: "#stack", icon: Layers },
            { label: "Developer", href: "#developer", icon: User },
            { label: "Contact", href: "#contact", icon: MessageSquare },
          ].map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-100 hover:border-gray-200 transition-all group"
            >
              <Icon size={14} className="text-gray-400 group-hover:text-black transition-colors" />
              <span className="text-xs font-bold text-gray-600 group-hover:text-gray-900 transition-colors">{label}</span>
              <ExternalLink size={10} className="ml-auto text-gray-300 group-hover:text-gray-500 transition-colors" />
            </a>
          ))}
        </div>
      </motion.div>

      {/* ── DEVELOPER PROFILE ── */}
      <motion.div {...fadeUp(0.08)} id="developer">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Developer</p>
        <div className="rounded-3xl bg-white border border-gray-200 p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8">

            {/* Avatar + identity */}
            <div className="flex flex-col items-center md:items-start gap-4 shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-black/10 to-gray-200 border border-gray-100 flex items-center justify-center text-3xl font-black text-black">
                S
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-xl font-black text-gray-900 tracking-tight">{DEVELOPER.name}</h2>
                <p className="text-xs text-black font-bold mt-0.5">{DEVELOPER.role}</p>
                <p className="text-xs text-gray-500 mt-0.5">{DEVELOPER.org}</p>
              </div>
              <div className="flex flex-col gap-2 w-full mt-2">
                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                  <MapPin size={13} className="text-gray-400 shrink-0" />
                  {DEVELOPER.location}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                  <Clock size={13} className="text-gray-400 shrink-0" />
                  Contributing since {DEVELOPER.since}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                  <Mail size={13} className="text-gray-400 shrink-0" />
                  {DEVELOPER.email}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                  <GitBranch size={13} className="text-gray-400 shrink-0" />
                  {DEVELOPER.github}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px bg-gray-100" />

            {/* Bio + stack */}
            <div className="flex-1 flex flex-col gap-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">About</p>
                <p className="text-sm text-gray-600 leading-relaxed">{DEVELOPER.bio}</p>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Primary Stack</p>
                <div className="flex flex-wrap gap-2">
                  {DEVELOPER.stack.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-gray-100 grid grid-cols-3 gap-4">
                {[
                  { label: "Admin Pages Built", value: "16+" },
                  { label: "Components", value: "40+" },
                  { label: "Build Year", value: "2024–26" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="text-xl font-black text-gray-900">{value}</div>
                    <div className="text-[10px] text-gray-500 font-bold mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── TECH STACK ── */}
      <motion.div {...fadeUp(0.1)} id="stack">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Technology Stack</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {STACK.map(({ icon: Icon, label, desc, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 + i * 0.04, ease: "easeOut" }}
              className="rounded-2xl bg-white border border-gray-200 hover:border-gray-300 p-4 flex items-start gap-3 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 group-hover:bg-gray-100 transition-colors">
                <Icon size={16} className={color} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">{label}</p>
                <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed font-medium">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── FAQ ── */}
      <motion.div {...fadeUp(0.12)} id="faq">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Frequently Asked Questions</p>
        <div className="flex flex-col gap-2">
          {FAQS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.12 + i * 0.04 }}
            >
              <FAQItem q={item.q} a={item.a} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── CONTACT CHANNELS ── */}
      <motion.div {...fadeUp(0.14)} id="contact">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Contact & Support Channels</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CONTACTS.map(({ icon: Icon, label, value, sub, color }) => (
            <div
              key={label}
              className="rounded-2xl bg-white border border-gray-200 hover:border-gray-300 p-5 flex items-start gap-4 transition-all group cursor-pointer"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                <Icon size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-900 mb-1">{label}</p>
                <p className="text-xs font-mono text-gray-600 truncate group-hover:text-gray-900 transition-colors">{value}</p>
                <p className="text-[10px] text-gray-500 mt-1 font-medium">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── FOOTER NOTE ── */}
      <motion.div {...fadeUp(0.16)}>
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 flex items-center gap-3">
          <Heart size={14} className="text-black shrink-0" />
          <p className="text-xs text-gray-600 leading-relaxed font-medium">
            Built with purpose for Christ Revelation Church.
            For urgent production issues outside business hours, use the emergency contact line.
          </p>
        </div>
      </motion.div>

    </div>
  );
}
