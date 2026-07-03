"use client";

import { motion, useMotionValue, useTransform, useSpring, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { Download, MapPin, Mail, Code2 as Github, Briefcase as Linkedin, MessageCircle as Twitter, Calendar, Briefcase, Code2, Star, Zap, Globe, Database, Layers, Terminal, Cpu } from 'lucide-react';
import { BRAND, ACCENT_COLOR, ACCENT_CYAN } from "@/lib/data";
import {
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  fadeIn,
  staggerContainer,
  scaleIn,
  slideInFromBottom,
} from "@/lib/motion";
import { useRef, useState, useEffect } from "react";

// ─── Inline data ────────────────────────────────────────────────────────────

const experiences = [
  {
    id: "1",
    role: "Senior Full-Stack Engineer",
    company: "Vercel",
    period: "2022 – Present",
    description:
      "Lead development of Next.js-based SaaS products serving 50k+ users. Architected a real-time collaboration layer using WebSockets and Redis, reducing latency by 40%. Mentored a team of 4 junior engineers and drove adoption of TypeScript across the org.",
    tech: ["Next.js", "TypeScript", "Redis", "PostgreSQL", "Tailwind CSS"],
    color: "#6c63ff",
  },
  {
    id: "2",
    role: "Full-Stack Developer",
    company: "Stripe",
    period: "2020 – 2022",
    description:
      "Built and maintained payment dashboard features used by millions of merchants globally. Improved checkout conversion by 12% through A/B-tested UI redesigns. Integrated third-party APIs and wrote extensive test suites with Jest and Playwright.",
    tech: ["React", "Node.js", "GraphQL", "AWS", "Jest"],
    color: "#00d4ff",
  },
  {
    id: "3",
    role: "Frontend Engineer",
    company: "Figma",
    period: "2018 – 2020",
    description:
      "Contributed to the core canvas rendering engine and plugin API. Optimized SVG rendering pipelines, achieving a 30% performance improvement on complex documents. Collaborated closely with design systems team to ship a cohesive component library.",
    tech: ["TypeScript", "WebGL", "Canvas API", "React", "Rust (WASM)"],
    color: "#a78bfa",
  },
  {
    id: "4",
    role: "Junior Web Developer",
    company: "Shopify",
    period: "2016 – 2018",
    description:
      "Developed merchant-facing storefront themes and Liquid templates. Built custom Shopify apps using the REST and GraphQL Admin APIs. Gained deep experience in e-commerce UX patterns and accessibility standards.",
    tech: ["JavaScript", "Liquid", "Ruby on Rails", "GraphQL", "SCSS"],
    color: "#34d399",
  },
];

const skills = [
  { name: "React / Next.js", level: 96, icon: Layers, category: "Frontend" },
  { name: "TypeScript", level: 93, icon: Code2, category: "Language" },
  { name: "Node.js", level: 88, icon: Terminal, category: "Backend" },
  { name: "PostgreSQL", level: 82, icon: Database, category: "Database" },
  { name: "WebGL / Three.js", level: 74, icon: Cpu, category: "3D / Graphics" },
  { name: "AWS / Cloud", level: 79, icon: Globe, category: "DevOps" },
  { name: "GraphQL", level: 85, icon: Zap, category: "API" },
  { name: "UI / Design Systems", level: 90, icon: Star, category: "Design" },
];

const stats = [
  { label: "Years Experience", value: "8+" },
  { label: "Projects Shipped", value: "60+" },
  { label: "Open Source Stars", value: "2.4k" },
  { label: "Cups of Coffee", value: "∞" },
];

// ─── Skill Ring Component ────────────────────────────────────────────────────

function SkillRing({
  skill,
  index,
}: {
  skill: (typeof skills)[0];
  index: number;
}) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const [animated, setAnimated] = useState(false);

  const ringVariant: Variants = {
    hidden: { opacity: 0, scale: 0.7 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, delay: index * 0.08, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      variants={ringVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      onViewportEnter={() => setAnimated(true)}
      whileHover={{ y: -6, scale: 1.04 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center gap-3 group cursor-default"
    >
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 88 88">
          {/* Track */}
          <circle
            cx="44"
            cy="44"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="6"
          />
          {/* Progress */}
          <motion.circle
            cx="44"
            cy="44"
            r={radius}
            fill="none"
            stroke="url(#skillGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={
              animated
                ? {
                    strokeDashoffset:
                      circumference - (skill.level / 100) * circumference,
                  }
                : { strokeDashoffset: circumference }
            }
            transition={{ duration: 1.2, ease: "easeOut", delay: index * 0.08 }}
          />
          <defs>
            <linearGradient id="skillGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={ACCENT_COLOR} />
              <stop offset="100%" stopColor={ACCENT_CYAN} />
            </linearGradient>
          </defs>
        </svg>
        {/* Icon + percent */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <skill.icon
            size={16}
            className="text-white/60 group-hover:text-white transition-colors duration-300"
          />
          <span className="text-xs font-bold text-white mt-0.5">
            {skill.level}%
          </span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-white text-xs font-semibold leading-tight">
          {skill.name}
        </p>
        <p className="text-white/40 text-[10px] mt-0.5">{skill.category}</p>
      </div>
    </motion.div>
  );
}

// ─── 3D Tilt Card ────────────────────────────────────────────────────────────

function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-8, 8]);
  const springRotateX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX: springRotateX, rotateY: springRotateY, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Timeline Entry ──────────────────────────────────────────────────────────

function TimelineEntry({
  exp,
  index,
}: {
  exp: (typeof experiences)[0];
  index: number;
}) {
  const isEven = index % 2 === 0;

  const entryVariant: Variants = {
    hidden: { opacity: 0, x: isEven ? -50 : 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut", delay: index * 0.1 },
    },
  };

  return (
    <motion.div
      variants={entryVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className={`relative flex items-start gap-6 md:gap-0 ${
        isEven ? "md:flex-row" : "md:flex-row-reverse"
      }`}
    >
      {/* Card */}
      <div className={`w-full md:w-[calc(50%-2rem)] ${isEven ? "md:pr-8" : "md:pl-8"}`}>
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
          className="relative rounded-2xl border border-white/8 bg-white/[0.03] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.1),0_8px_32px_-8px_rgba(0,0,0,0.4)] backdrop-blur-sm overflow-hidden group"
        >
          {/* Accent glow */}
          <div
            className="absolute top-0 left-0 w-full h-px opacity-60"
            style={{
              background: `linear-gradient(90deg, transparent, ${exp.color}, transparent)`,
            }}
          />
          <div
            className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-2xl"
            style={{ background: exp.color }}
          />

          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <h3 className="text-white font-semibold text-base leading-tight">
                {exp.role}
              </h3>
              <p className="text-sm mt-0.5" style={{ color: exp.color }}>
                {exp.company}
              </p>
            </div>
            <span className="flex items-center gap-1.5 text-white/40 text-xs whitespace-nowrap shrink-0 mt-0.5">
              <Calendar size={11} />
              {exp.period}
            </span>
          </div>

          <p className="text-white/60 text-sm leading-relaxed mb-4">
            {exp.description}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {exp.tech.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded-full text-[10px] font-medium border border-white/10 text-white/50"
              >
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Center dot — hidden on mobile, shown on md+ */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-6 flex-col items-center z-10">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.1 + 0.2, type: "spring", stiffness: 300 }}
          className="w-4 h-4 rounded-full border-2 border-white/20 shadow-[0_0_12px_rgba(108,99,255,0.6)]"
          style={{ background: exp.color }}
        />
      </div>
    </motion.div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  const t = useTranslations();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* ── Hero Split ─────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 px-6">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-10 blur-[120px]"
            style={{ background: `radial-gradient(circle, ${ACCENT_COLOR}, transparent 70%)` }}
          />
          <div
            className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-8 blur-[100px]"
            style={{ background: `radial-gradient(circle, ${ACCENT_CYAN}, transparent 70%)` }}
          />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Bio text */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={fadeInUp}>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-white/60 font-medium mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Available for new projects
              </span>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.05]">
                Hi, I&apos;m{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${ACCENT_COLOR}, ${ACCENT_CYAN})`,
                  }}
                >
                  {BRAND.name}
                </span>
              </h1>
            </motion.div>

            <motion.p
              variants={fadeInUp}
              className="text-lg text-white/60 leading-relaxed max-w-lg"
            >
              A full-stack developer with 8 years of experience building
              high-performance web applications. I specialize in React
              ecosystems, distributed systems, and crafting interfaces that feel
              as good as they look.
            </motion.p>

            <motion.p
              variants={fadeInUp}
              className="text-base text-white/50 leading-relaxed max-w-lg"
            >
              Previously at Vercel, Stripe, and Figma. I care deeply about
              developer experience, accessibility, and shipping products that
              users genuinely love. When I&apos;m not coding, you&apos;ll find me
              contributing to open source or exploring generative art with
              WebGL.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <MapPin size={14} className="text-white/30" />
                {BRAND.location}
              </div>
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <Mail size={14} className="text-white/30" />
                {BRAND.email}
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex items-center gap-3 pt-2">
              {[
                { icon: Github, href: BRAND.github, label: "GitHub" },
                { icon: Linkedin, href: BRAND.linkedin, label: "LinkedIn" },
                { icon: Twitter, href: BRAND.twitter, label: "Twitter" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center justify-center w-10 h-10 rounded-xl border border-white/10 bg-white/5 text-white/50 hover:text-white hover:border-white/20 hover:bg-white/10 transition-all duration-300"
                >
                  <Icon size={16} />
                </a>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Portrait + floating badges */}
          <motion.div
            variants={fadeInRight}
            initial="hidden"
            animate="visible"
            className="relative flex justify-center lg:justify-end"
          >
            <TiltCard className="relative">
              {/* Portrait frame */}
              <div className="relative w-72 h-80 md:w-80 md:h-96 rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_32px_80px_-16px_rgba(0,0,0,0.8)]">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
                  alt="Alex Chen — Full-Stack Developer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      parent.style.background =
                        "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)";
                      const initials = document.createElement("div");
                      initials.className =
                        "absolute inset-0 flex items-center justify-center text-6xl font-bold text-white/20";
                      initials.textContent = "AC";
                      parent.appendChild(initials);
                    }
                  }}
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 via-transparent to-transparent" />
              </div>

              {/* Floating badge: Role */}
              <motion.div
                initial={{ opacity: 0, x: 30, y: -10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
                className="absolute -top-4 -right-6 flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-[#111]/90 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
                style={{ transform: "translateZ(40px)" }}
              >
                <Briefcase size={13} className="text-[#6c63ff]" />
                <span className="text-white text-xs font-semibold">
                  {BRAND.tagline}
                </span>
              </motion.div>

              {/* Floating badge: Experience */}
              <motion.div
                initial={{ opacity: 0, x: -30, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 1.0, duration: 0.6, ease: "easeOut" }}
                className="absolute -bottom-4 -left-6 flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-[#111]/90 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
                style={{ transform: "translateZ(40px)" }}
              >
                <Star size={13} className="text-[#00d4ff]" />
                <span className="text-white text-xs font-semibold">
                  8 Years Experience
                </span>
              </motion.div>

              {/* Floating badge: Open to work */}
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.5, type: "spring", stiffness: 200 }}
                className="absolute top-1/2 -right-10 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md"
                style={{ transform: "translateZ(50px)" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 text-[10px] font-semibold">
                  Open to work
                </span>
              </motion.div>
            </TiltCard>
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="max-w-7xl mx-auto mt-20 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={scaleIn}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative rounded-2xl border border-white/8 bg-white/[0.03] p-6 text-center overflow-hidden group"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle at center, ${ACCENT_COLOR}08, transparent 70%)`,
                }}
              />
              <p
                className="text-3xl font-bold bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${ACCENT_COLOR}, ${ACCENT_CYAN})`,
                }}
              >
                {stat.value}
              </p>
              <p className="text-white/50 text-sm mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Work Experience Timeline ────────────────────────────────────── */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-white/50 font-medium mb-4">
              <Briefcase size={11} />
              Work History
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              Where I&apos;ve{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${ACCENT_COLOR}, ${ACCENT_CYAN})`,
                }}
              >
                Worked
              </span>
            </h2>
            <p className="text-white/50 mt-4 max-w-md mx-auto text-base leading-relaxed">
              Eight years across high-growth startups and industry leaders,
              shipping products at scale.
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Center line — desktop only */}
            <div className="hidden md:block absolute left-1/2 -translate-x-px top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

            <div className="flex flex-col gap-12">
              {experiences.map((exp, i) => (
                <TimelineEntry key={exp.id} exp={exp} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Skills Rings ────────────────────────────────────────────────── */}
      <section className="relative py-24 px-6 bg-white/[0.015]">
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="max-w-7xl mx-auto relative">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-white/50 font-medium mb-4">
              <Code2 size={11} />
              Technical Skills
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              My{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${ACCENT_COLOR}, ${ACCENT_CYAN})`,
                }}
              >
                Toolkit
              </span>
            </h2>
            <p className="text-white/50 mt-4 max-w-md mx-auto text-base leading-relaxed">
              Technologies I reach for daily, measured by depth of experience
              and production usage.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-8 justify-items-center">
            {skills.map((skill, i) => (
              <SkillRing key={skill.name} skill={skill} index={i} />
            ))}
          </div>

          {/* Additional tech pills */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="mt-16 flex flex-wrap justify-center gap-2"
          >
            {[
              "Docker",
              "Kubernetes",
              "Prisma",
              "tRPC",
              "Zustand",
              "Framer Motion",
              "Storybook",
              "Vitest",
              "Playwright",
              "Turborepo",
              "Vercel",
              "Cloudflare Workers",
              "Redis",
              "Supabase",
              "Stripe API",
            ].map((tech, i) => (
              <motion.span
                key={tech}
                variants={fadeIn}
                whileHover={{ scale: 1.08, y: -2 }}
                className="px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/60 text-xs font-medium hover:text-white hover:border-white/20 transition-all duration-200 cursor-default"
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Resume CTA Strip ────────────────────────────────────────────── */}
      <section className="relative py-24 px-6 overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 50%, ${ACCENT_COLOR}, transparent)`,
          }}
        />
        {/* Hairline top border */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${ACCENT_COLOR}60, transparent)`,
          }}
        />

        <div className="max-w-4xl mx-auto relative">
          <motion.div
            variants={slideInFromBottom}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-10 md:p-14 text-center shadow-[0_1px_2px_rgba(0,0,0,0.1),0_32px_80px_-16px_rgba(0,0,0,0.6)] overflow-hidden"
          >
            {/* Inner glow */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px"
              style={{
                background: `linear-gradient(90deg, transparent, ${ACCENT_COLOR}80, transparent)`,
              }}
            />

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6 shadow-[0_0_24px_rgba(108,99,255,0.4)]"
              style={{
                background: `linear-gradient(135deg, ${ACCENT_COLOR}, ${ACCENT_CYAN})`,
              }}
            >
              <Download size={22} className="text-white" />
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
              Want the full picture?
            </h2>
            <p className="text-white/55 text-base leading-relaxed max-w-lg mx-auto mb-8">
              Download my resume for a complete overview of my experience,
              education, and the projects I&apos;m most proud of. PDF, two pages,
              no fluff.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a
                href="/alex-chen-resume.pdf"
                download
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-white text-sm shadow-[0_0_24px_rgba(108,99,255,0.35)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c63ff]"
                style={{
                  background: `linear-gradient(135deg, ${ACCENT_COLOR}, ${ACCENT_CYAN})`,
                }}
              >
                <Download size={16} />
                Download Resume
              </motion.a>

              <motion.a
                href={`mailto:${BRAND.email}`}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-white/80 text-sm border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                <Mail size={16} />
                Get in Touch
              </motion.a>
            </div>

            {/* Decorative corner dots */}
            <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-white/10" />
            <div className="absolute bottom-4 left-4 w-2 h-2 rounded-full bg-white/10" />
            <div className="absolute top-4 left-4 w-1 h-1 rounded-full bg-white/5" />
            <div className="absolute bottom-4 right-4 w-1 h-1 rounded-full bg-white/5" />
          </motion.div>
        </div>
      </section>
    </main>
  );
}