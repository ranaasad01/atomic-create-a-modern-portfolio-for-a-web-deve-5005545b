"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Mail, Code2 as Github, MessageCircle as Twitter, Briefcase as Linkedin, MapPin, Clock, Send, CheckCircle, AlertCircle, User, MessageSquare, FileText, ChevronRight } from 'lucide-react';
import { BRAND } from "@/lib/data";
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer, scaleIn } from "@/lib/motion";
import { useTranslations } from "next-intl";

// ── Shake variant for validation errors ──────────────────────────────────────
const shakeVariant: Variants = {
  idle: { x: 0 },
  shake: {
    x: [0, -10, 10, -8, 8, -4, 4, 0],
    transition: { duration: 0.5, ease: "easeInOut" },
  },
};

const successVariant: Variants = {
  hidden: { opacity: 0, scale: 0.7, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 18 },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: -20,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

const floatingLabelVariant: Variants = {
  rest: { y: 0, scale: 1, color: "rgba(255,255,255,0.4)" },
  float: { y: -22, scale: 0.78, color: "#6c63ff" },
};

// ── Canvas particle field ────────────────────────────────────────────────────
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let W = 0;
    let H = 0;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      alpha: number;
    }

    const particles: Particle[] = [];
    const COUNT = 80;

    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
    };

    const init = () => {
      particles.length = 0;
      for (let i = 0; i < COUNT; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.5 + 0.4,
          alpha: Math.random() * 0.5 + 0.15,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(108,99,255,${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(108,99,255,${p.alpha})`;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
      }

      animId = requestAnimationFrame(draw);
    };

    resize();
    init();
    draw();

    const ro = new ResizeObserver(() => {
      resize();
      init();
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}

// ── Floating label input ─────────────────────────────────────────────────────
interface FloatingInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  icon: React.ReactNode;
  multiline?: boolean;
  rows?: number;
}

function FloatingInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  icon,
  multiline = false,
  rows = 4,
}: FloatingInputProps) {
  const [focused, setFocused] = useState(false);
  const isFloated = focused || value.length > 0;

  const baseClass =
    "w-full bg-white/5 border rounded-xl px-4 pt-6 pb-2 text-white text-sm outline-none transition-all duration-300 resize-none placeholder-transparent " +
    (error
      ? "border-cyan-500/60 focus:border-cyan-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]"
      : focused
      ? "border-[#6c63ff]/70 shadow-[0_0_0_3px_rgba(108,99,255,0.18)]"
      : "border-white/10 hover:border-white/20");

  return (
    <div className="relative">
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none z-10 flex items-center">
          {icon}
        </span>
        <motion.label
          htmlFor={id}
          variants={floatingLabelVariant}
          animate={isFloated ? "float" : "rest"}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute left-11 top-4 text-sm font-medium pointer-events-none origin-left z-10"
          style={{ transformOrigin: "left center" }}
        >
          {label}
        </motion.label>
        {multiline ? (
          <textarea
            id={id}
            rows={rows}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={baseClass + " pl-11 min-h-[120px]"}
            placeholder={label}
          />
        ) : (
          <input
            id={id}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={baseClass + " pl-11 h-14"}
            placeholder={label}
          />
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="mt-1.5 text-xs text-cyan-400 flex items-center gap-1"
          >
            <AlertCircle size={11} />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Social link card ─────────────────────────────────────────────────────────
interface SocialCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  color: string;
}

function SocialCard({ icon, label, value, href, color }: SocialCardProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      variants={fadeInUp}
      whileHover={{ x: 4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/8 hover:border-white/20 hover:bg-white/8 transition-all duration-300 group"
    >
      <span
        className="flex h-9 w-9 items-center justify-center rounded-lg flex-shrink-0"
        style={{ backgroundColor: `${color}22`, color }}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-white/40 text-xs">{label}</p>
        <p className="text-white text-sm font-medium truncate group-hover:text-[#6c63ff] transition-colors duration-200">
          {value}
        </p>
      </div>
      <ChevronRight size={14} className="ml-auto text-white/20 group-hover:text-[#6c63ff] transition-colors duration-200 flex-shrink-0" />
    </motion.a>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function ContactPage() {
  const t = useTranslations();

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shakeKey, setShakeKey] = useState(0);
  const [shakeActive, setShakeActive] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Your name is required.";
    if (!email.trim()) errs.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Please enter a valid email.";
    if (!subject.trim()) errs.subject = "A subject helps me prioritize.";
    if (!message.trim()) errs.message = "Don't forget to write your message!";
    else if (message.trim().length < 20)
      errs.message = "Please write at least 20 characters.";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setShakeKey((k) => k + 1);
      setShakeActive(true);
      setTimeout(() => setShakeActive(false), 600);
      return;
    }
    setErrors({});
    setStatus("sending");
    // Simulate async send
    setTimeout(() => {
      setStatus("success");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }, 1800);
  };

  const socials: SocialCardProps[] = [
    {
      icon: <Mail size={16} />,
      label: "Email",
      value: BRAND.email,
      href: `mailto:${BRAND.email}`,
      color: "#6c63ff",
    },
    {
      icon: <Github size={16} />,
      label: "GitHub",
      value: "@alexchen",
      href: BRAND.github,
      color: "#e2e8f0",
    },
    {
      icon: <Linkedin size={16} />,
      label: "LinkedIn",
      value: "in/alexchen",
      href: BRAND.linkedin,
      color: "#0a66c2",
    },
    {
      icon: <Twitter size={16} />,
      label: "Twitter / X",
      value: "@alexchen",
      href: BRAND.twitter,
      color: "#1d9bf0",
    },
  ];

  const infoItems = [
    {
      icon: <MapPin size={15} />,
      label: "Based in",
      value: BRAND.location,
    },
    {
      icon: <Clock size={15} />,
      label: "Timezone",
      value: "PST (UTC-8)",
    },
  ];

  return (
    <main className="relative min-h-screen bg-[#0a0a0a] overflow-hidden">
      {/* Particle background */}
      <div className="absolute inset-0 z-0">
        <ParticleField />
      </div>

      {/* Radial glow accents */}
      <div
        className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle, rgba(108,99,255,0.08) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24">
        {/* Page header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="text-center mb-16"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6c63ff]/10 border border-[#6c63ff]/20 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            <span className="text-[#6c63ff] text-xs font-semibold tracking-widest uppercase">
              Available for work
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight text-balance mb-5"
          >
            Let&apos;s{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #6c63ff 0%, #00d4ff 100%)",
              }}
            >
              Work Together
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-white/50 text-lg leading-relaxed max-w-xl mx-auto text-pretty"
          >
            Have a project in mind or just want to say hello? I&apos;d love to hear from you. I typically respond within 24 hours.
          </motion.p>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* ── Left: Contact form ── */}
          <motion.div
            variants={fadeInLeft}
            initial="hidden"
            animate="visible"
            className="lg:col-span-3"
          >
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
              {/* Glass shimmer top edge */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              <div className="p-8 md:p-10">
                <h2 className="text-xl font-semibold text-white mb-1">Send a message</h2>
                <p className="text-white/40 text-sm mb-8">
                  Fill out the form below and I&apos;ll get back to you as soon as possible.
                </p>

                <AnimatePresence mode="wait">
                  {status === "success" ? (
                    <motion.div
                      key="success"
                      variants={successVariant}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="flex flex-col items-center justify-center py-16 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                        className="flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500/15 border border-cyan-500/30 mb-6"
                      >
                        <CheckCircle size={36} className="text-cyan-400" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-white mb-2">Message sent!</h3>
                      <p className="text-white/50 text-sm max-w-xs leading-relaxed mb-8">
                        Thanks for reaching out. I&apos;ll review your message and reply within 24 hours.
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setStatus("idle")}
                        className="px-6 py-2.5 rounded-xl text-sm font-medium text-white border border-white/15 hover:border-[#6c63ff]/50 hover:bg-[#6c63ff]/10 transition-all duration-300"
                      >
                        Send another message
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      noValidate
                    >
                      <motion.div
                        key={shakeKey}
                        variants={shakeVariant}
                        animate={shakeActive ? "shake" : "idle"}
                        className="space-y-5"
                      >
                        {/* Name + Email row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <FloatingInput
                            id="name"
                            label="Your name"
                            value={name}
                            onChange={(v) => {
                              setName(v);
                              if (errors.name) setErrors((e) => ({ ...e, name: "" }));
                            }}
                            error={errors.name}
                            icon={<User size={15} />}
                          />
                          <FloatingInput
                            id="email"
                            label="Email address"
                            type="email"
                            value={email}
                            onChange={(v) => {
                              setEmail(v);
                              if (errors.email) setErrors((e) => ({ ...e, email: "" }));
                            }}
                            error={errors.email}
                            icon={<Mail size={15} />}
                          />
                        </div>

                        {/* Subject */}
                        <FloatingInput
                          id="subject"
                          label="Subject"
                          value={subject}
                          onChange={(v) => {
                            setSubject(v);
                            if (errors.subject) setErrors((e) => ({ ...e, subject: "" }));
                          }}
                          error={errors.subject}
                          icon={<FileText size={15} />}
                        />

                        {/* Message */}
                        <FloatingInput
                          id="message"
                          label="Your message"
                          value={message}
                          onChange={(v) => {
                            setMessage(v);
                            if (errors.message) setErrors((e) => ({ ...e, message: "" }));
                          }}
                          error={errors.message}
                          icon={<MessageSquare size={15} />}
                          multiline
                          rows={5}
                        />

                        {/* Submit */}
                        <motion.button
                          type="submit"
                          disabled={status === "sending"}
                          whileHover={{ scale: status === "sending" ? 1 : 1.02 }}
                          whileTap={{ scale: status === "sending" ? 1 : 0.97 }}
                          className="w-full relative flex items-center justify-center gap-2.5 h-13 rounded-xl font-semibold text-sm text-white overflow-hidden transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                          style={{
                            background: "linear-gradient(135deg, #6c63ff 0%, #00d4ff 100%)",
                            boxShadow: "0 0 24px rgba(108,99,255,0.35), 0 4px 16px rgba(0,0,0,0.3)",
                          }}
                        >
                          {/* Shimmer overlay */}
                          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
                          {status === "sending" ? (
                            <>
                              <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full"
                              />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send size={15} />
                              Send Message
                            </>
                          )}
                        </motion.button>
                      </motion.div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* ── Right: Info panel ── */}
          <motion.div
            variants={fadeInRight}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 space-y-5"
          >
            {/* Availability card */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent rounded-t-2xl" />
              <div className="flex items-start gap-4">
                <div
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl"
                  style={{ background: "rgba(108,99,255,0.15)" }}
                >
                  <span className="text-xl">👋</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-semibold text-sm">Open to opportunities</h3>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/25 text-cyan-400 text-[10px] font-semibold uppercase tracking-wider">
                      Active
                    </span>
                  </div>
                  <p className="text-white/45 text-xs leading-relaxed">
                    Currently accepting freelance projects and full-time roles. Let&apos;s build something great together.
                  </p>
                </div>
              </div>
            </div>

            {/* Location + timezone */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
              <h3 className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-4">
                Location
              </h3>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-3"
              >
                {infoItems.map((item) => (
                  <motion.div
                    key={item.label}
                    variants={fadeInUp}
                    className="flex items-center gap-3"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/40 flex-shrink-0">
                      {item.icon}
                    </span>
                    <div>
                      <p className="text-white/35 text-xs">{item.label}</p>
                      <p className="text-white text-sm font-medium">{item.value}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Social links */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
              <h3 className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-4">
                Connect
              </h3>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-2.5"
              >
                {socials.map((s) => (
                  <SocialCard key={s.label} {...s} />
                ))}
              </motion.div>
            </div>

            {/* Response time badge */}
            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              className="rounded-2xl border border-[#6c63ff]/20 bg-[#6c63ff]/5 backdrop-blur-xl p-5 text-center"
            >
              <p className="text-[#6c63ff] text-xs font-semibold uppercase tracking-widest mb-1">
                Avg. Response Time
              </p>
              <p className="text-white text-3xl font-bold tracking-tight">&lt; 24h</p>
              <p className="text-white/35 text-xs mt-1">Usually much faster on weekdays</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom FAQ strip */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {[
            {
              q: "What types of projects do you take on?",
              a: "Full-stack web apps, SaaS products, API integrations, and design-to-code conversions. I love technically challenging work.",
            },
            {
              q: "Do you work with international clients?",
              a: "Absolutely. I collaborate with teams across North America, Europe, and Asia. Async-friendly and comfortable with any timezone.",
            },
            {
              q: "What does your process look like?",
              a: "Discovery call, scoped proposal, iterative sprints with weekly check-ins, and a polished handoff with full documentation.",
            },
          ].map((item) => (
            <motion.div
              key={item.q}
              variants={fadeInUp}
              className="rounded-2xl border border-white/8 bg-white/[0.02] backdrop-blur-sm p-6 hover:border-[#6c63ff]/30 hover:bg-[#6c63ff]/5 transition-all duration-300"
            >
              <h4 className="text-white font-semibold text-sm mb-2 leading-snug">{item.q}</h4>
              <p className="text-white/45 text-xs leading-relaxed">{item.a}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}