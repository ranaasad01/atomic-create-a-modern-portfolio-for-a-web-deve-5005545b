"use client";

import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Code2 as Github, Briefcase as Linkedin, Mail, Star, Code, Layout, Terminal, Activity, Sparkles, Check, Eye, FileCode, GitBranch } from 'lucide-react';
import { BRAND, ACCENT_COLOR, ACCENT_CYAN } from "@/lib/data";
import {
  fadeInUp,
  fadeIn,
  fadeInLeft,
  fadeInRight,
  staggerContainer,
  scaleIn,
  glowPulse,
  slideInFromBottom,
} from "@/lib/motion";
import { useTranslations } from "next-intl";

// ─── Inline data ────────────────────────────────────────────────────────────

const featuredProjects = [
  {
    id: "1",
    title: "Orbit Design System",
    description:
      "A comprehensive component library powering 12 products at scale. Built with React, TypeScript, and Storybook. Includes 80+ accessible components, dark mode, and full theming support.",
    tags: ["React", "TypeScript", "Storybook", "Radix UI"],
    image: "https://res.cloudinary.com/pulsedatatools/image/upload/v1566588102/pulse-analytics-marketing/product-screens/toolscreen-home-1_2x.png",
    liveUrl: "https://orbit.alexchen.dev",
    githubUrl: "https://github.com/alexchen/orbit",
    color: "#6c63ff",
  },
  {
    id: "2",
    title: "Pulse Analytics",
    description:
      "Real-time data visualization dashboard for SaaS metrics. Processes 2M+ events per day with sub-100ms query latency using ClickHouse and WebSockets.",
    tags: ["Next.js", "ClickHouse", "WebSockets", "Recharts"],
    image: "https://res.cloudinary.com/pulsedatatools/image/upload/v1566588102/pulse-analytics-marketing/product-screens/toolscreen-home-1_2x.png",
    liveUrl: "https://pulse.alexchen.dev",
    githubUrl: "https://github.com/alexchen/pulse",
    color: "#00d4ff",
  },
  {
    id: "3",
    title: "Forge CMS",
    description:
      "Headless CMS with a visual block editor, multi-tenant architecture, and a GraphQL API. Used by 300+ content teams to publish faster without engineering bottlenecks.",
    tags: ["Node.js", "GraphQL", "PostgreSQL", "React"],
    image: "https://www.framer.com/creators-assets/_next/image/?url=https%3A%2F%2Fy4pdgnepgswqffpt.public.blob.vercel-storage.com%2Fplugins%2F1180-y7YKgJlPH1oHkKagKMxR1DFH4gz6Zk&w=3840&q=100",
    liveUrl: "https://forgecms.io",
    githubUrl: "https://github.com/alexchen/forge",
    color: "#f59e0b",
  },
];

const skills = [
  { name: "React / Next.js", level: 97, category: "Frontend" },
  { name: "TypeScript", level: 94, category: "Frontend" },
  { name: "Node.js / Bun", level: 90, category: "Backend" },
  { name: "PostgreSQL", level: 85, category: "Backend" },
  { name: "Tailwind CSS", level: 96, category: "Frontend" },
  { name: "GraphQL", level: 82, category: "Backend" },
];

const techStack = [
  { icon: FileCode, label: "TypeScript", color: "#3178c6" },
  { icon: Layout, label: "Next.js", color: "#ffffff" },
  { icon: Terminal, label: "Node.js", color: "#68a063" },
  { icon: GitBranch, label: "Git", color: "#f05032" },
  { icon: Activity, label: "Postgres", color: "#336791" },
  { icon: Code, label: "GraphQL", color: "#e10098" },
];

const testimonials = [
  {
    id: "t1",
    name: "Sarah Kim",
    role: "CTO at Luminary",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Git-logo.svg",
    quote:
      "Alex rebuilt our entire frontend in 6 weeks. The performance gains were immediate — our Lighthouse score went from 54 to 98. Exceptional engineer.",
  },
  {
    id: "t2",
    name: "Marcus Webb",
    role: "Founder at Stackr",
    avatar: "https://static.www.nfl.com/image/private/t_headshot_desktop/league/aewahyauhdstskbbuq43",
    quote:
      "Working with Alex felt like having a senior architect and a fast executor in one person. The design system he built is still the backbone of our product.",
  },
  {
    id: "t3",
    name: "Priya Nair",
    role: "Engineering Lead at Vanta",
    avatar: "https://media.licdn.com/dms/image/v2/D5622AQE3NpM1FP01Yg/feedshare-shrink_800/B56Zf4pvKcGUAg-/0/1752223383746?e=2147483647&v=beta&t=C11dC6M36dpAKpcbBRMtusPrnkgE-cNJfHc93ZNpFoQ",
    quote:
      "Alex has a rare ability to translate complex product requirements into clean, maintainable code. He shipped our analytics module two sprints ahead of schedule.",
  },
];

const stats = [
  { value: "8+", label: "Years building" },
  { value: "40+", label: "Projects shipped" },
  { value: "12M+", label: "Users reached" },
  { value: "98", label: "Avg Lighthouse score" },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

const cardHover: Variants = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.025,
    y: -6,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

const tiltCard: Variants = {
  rest: { rotateX: 0, rotateY: 0 },
  hover: {
    rotateX: 4,
    rotateY: -4,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

function ProjectCard({
  project,
  index,
}: {
  project: (typeof featuredProjects)[0];
  index: number;
}) {
  const t = useTranslations();
  return (
    <motion.div
      variants={index % 2 === 0 ? fadeInLeft : fadeInRight}
      className="group relative"
    >
      <motion.div
        variants={cardHover}
        initial="rest"
        whileHover="hover"
        className="relative rounded-2xl overflow-hidden border border-white/8 bg-[#111]/80 backdrop-blur-sm shadow-[0_2px_4px_rgba(0,0,0,0.1),0_16px_48px_-12px_rgba(0,0,0,0.5)] transition-shadow duration-300 group-hover:shadow-[0_4px_8px_rgba(0,0,0,0.15),0_24px_64px_-12px_rgba(108,99,255,0.2)]"
        style={{ perspective: 800 }}
      >
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div
            className="absolute inset-0 opacity-60"
            style={{
              background: `linear-gradient(to bottom, transparent 40%, #111 100%)`,
            }}
          />
          {/* Color accent top bar */}
          <div
            className="absolute top-0 left-0 right-0 h-0.5"
            style={{ background: project.color }}
          />
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <h3 className="font-space-grotesk text-xl font-bold text-white tracking-tight">
            {project.title}
          </h3>
          <p className="text-white/60 text-sm leading-relaxed">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-white/70"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex items-center gap-3 pt-1">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white transition-colors duration-200 group/link"
              >
                <Eye className="w-4 h-4" />
                <span>{t("projects.live")}</span>
                <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-200" />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm font-medium text-white/50 hover:text-white/80 transition-colors duration-200"
              >
                <Github className="w-4 h-4" />
                <span>{t("projects.source")}</span>
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SkillBar({ skill, i }: { skill: (typeof skills)[0]; i: number }) {
  return (
    <motion.div
      variants={fadeInUp}
      className="space-y-2"
      custom={i}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white/80">{skill.name}</span>
        <span className="text-xs text-white/40 font-mono">{skill.level}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${ACCENT_COLOR}, ${ACCENT_CYAN})`,
          }}
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 1, delay: i * 0.08, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}

// ─── Hero Section ────────────────────────────────────────────────────────────

function HeroSection() {
  const t = useTranslations();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16"
    >
      {/* Background mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-20"
          style={{
            background: `radial-gradient(circle, ${ACCENT_COLOR}55 0%, transparent 70%)`,
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-10"
          style={{
            background: `radial-gradient(circle, ${ACCENT_CYAN}55 0%, transparent 70%)`,
            filter: "blur(60px)",
          }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <motion.div style={{ y, opacity }} className="relative z-10 w-full max-w-7xl mx-auto px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center"
        >
          {/* Badge */}
          <motion.div variants={scaleIn} className="mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-sm text-white/70">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
              </span>
              {t("hero.badge")}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeInUp}
            className="font-space-grotesk text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-balance leading-[1.05] mb-6"
          >
            <span className="text-white">{t("hero.headline1")}</span>
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${ACCENT_COLOR}, ${ACCENT_CYAN})`,
              }}
            >
              {t("hero.headline2")}
            </span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            variants={fadeInUp}
            className="text-white/55 text-lg md:text-xl leading-relaxed max-w-2xl mb-10 text-pretty"
          >
            {t("hero.sub")}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center gap-4 mb-16"
          >
            <Link
              href="/projects"
              className="group relative inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white text-sm overflow-hidden transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c63ff]"
              style={{
                background: `linear-gradient(135deg, ${ACCENT_COLOR}, ${ACCENT_CYAN})`,
                boxShadow: `0 0 32px rgba(108,99,255,0.4)`,
              }}
            >
              <span className="relative z-10">{t("hero.cta_primary")}</span>
              <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white/80 text-sm border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c63ff]"
            >
              <Mail className="w-4 h-4" />
              {t("hero.cta_secondary")}
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-12"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={scaleIn}
                className="text-center"
              >
                <div
                  className="font-space-grotesk text-3xl md:text-4xl font-bold bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(135deg, #fff 40%, ${ACCENT_CYAN})`,
                  }}
                >
                  {stat.value}
                </div>
                <div className="text-white/40 text-xs mt-1 font-medium uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/30 text-xs tracking-widest uppercase">
          {t("hero.scroll")}
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent"
        />
      </motion.div>
    </section>
  );
}

// ─── Projects Section ────────────────────────────────────────────────────────

function ProjectsSection() {
  const t = useTranslations();
  return (
    <section id="projects" className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-16"
        >
          <motion.p
            variants={fadeIn}
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: ACCENT_COLOR }}
          >
            {t("projects.label")}
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            className="font-space-grotesk text-4xl md:text-5xl font-bold text-white tracking-tight text-balance mb-4"
          >
            {t("projects.heading")}
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-white/50 text-lg max-w-xl leading-relaxed"
          >
            {t("projects.sub")}
          </motion.p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {featuredProjects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors duration-200 group"
          >
            {t("projects.view_all")}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Skills Section ──────────────────────────────────────────────────────────

function SkillsSection() {
  const t = useTranslations();
  return (
    <section
      id="about"
      className="py-24 md:py-32 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, transparent, #0d0d14 50%, transparent)" }}
    >
      {/* Accent glow */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${ACCENT_CYAN}88 0%, transparent 70%)`,
          filter: "blur(80px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: copy */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="space-y-6"
          >
            <motion.p
              variants={fadeIn}
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: ACCENT_CYAN }}
            >
              {t("skills.label")}
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="font-space-grotesk text-4xl md:text-5xl font-bold text-white tracking-tight text-balance"
            >
              {t("skills.heading")}
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-white/55 text-lg leading-relaxed"
            >
              {t("skills.sub")}
            </motion.p>

            {/* Value props */}
            <motion.ul variants={staggerContainer} className="space-y-3 pt-2">
              {[
                t("skills.point1"),
                t("skills.point2"),
                t("skills.point3"),
              ].map((point) => (
                <motion.li
                  key={point}
                  variants={fadeInLeft}
                  className="flex items-start gap-3 text-white/70 text-sm"
                >
                  <span
                    className="mt-0.5 flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full"
                    style={{ background: `${ACCENT_COLOR}22`, border: `1px solid ${ACCENT_COLOR}44` }}
                  >
                    <Check className="w-3 h-3" style={{ color: ACCENT_COLOR }} />
                  </span>
                  {point}
                </motion.li>
              ))}
            </motion.ul>

            {/* Tech stack pills */}
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-3 pt-2">
              {techStack.map(({ icon: Icon, label, color }) => (
                <motion.span
                  key={label}
                  whileHover={{ scale: 1.08, y: -2 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/8 bg-white/5 text-xs font-medium text-white/70 cursor-default"
                >
                  <Icon className="w-3.5 h-3.5" style={{ color }} />
                  {label}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: skill bars */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="space-y-5 bg-white/[0.03] border border-white/8 rounded-2xl p-8 shadow-[0_2px_4px_rgba(0,0,0,0.1),0_16px_48px_-12px_rgba(0,0,0,0.4)]"
          >
            <motion.h3
              variants={fadeIn}
              className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-6"
            >
              {t("skills.proficiency")}
            </motion.h3>
            {skills.map((skill, i) => (
              <SkillBar key={skill.name} skill={skill} i={i} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials Section ────────────────────────────────────────────────────

function TestimonialsSection() {
  const t = useTranslations();
  return (
    <section className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="text-center mb-16"
        >
          <motion.p
            variants={fadeIn}
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: ACCENT_COLOR }}
          >
            {t("testimonials.label")}
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            className="font-space-grotesk text-4xl md:text-5xl font-bold text-white tracking-tight text-balance"
          >
            {t("testimonials.heading")}
          </motion.h2>
        </motion.div>

        {/* Cards — asymmetric bento */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {testimonials.map((item, i) => (
            <motion.div
              key={item.id}
              variants={slideInFromBottom}
              whileHover={{ y: -6, transition: { duration: 0.3, ease: "easeOut" } }}
              className={`relative rounded-2xl border border-white/8 bg-[#111]/80 p-7 shadow-[0_2px_4px_rgba(0,0,0,0.08),0_12px_40px_-12px_rgba(0,0,0,0.4)] ${
                i === 1 ? "md:mt-8" : ""
              }`}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, si) => (
                  <Star
                    key={si}
                    className="w-4 h-4 fill-current"
                    style={{ color: "#f59e0b" }}
                  />
                ))}
              </div>

              <blockquote className="text-white/70 text-sm leading-relaxed mb-6">
                &ldquo;{item.quote}&rdquo;
              </blockquote>

              <div className="flex items-center gap-3">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-white/10"
                />
                <div>
                  <div className="text-white text-sm font-semibold">{item.name}</div>
                  <div className="text-white/40 text-xs">{item.role}</div>
                </div>
              </div>

              {/* Subtle accent corner */}
              <div
                className="absolute top-0 right-6 w-12 h-0.5 rounded-b-full"
                style={{ background: `linear-gradient(90deg, ${ACCENT_COLOR}, ${ACCENT_CYAN})` }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── CTA Section ─────────────────────────────────────────────────────────────

function CTASection() {
  const t = useTranslations();
  return (
    <section id="contact" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background glow */}
      <motion.div
        variants={glowPulse}
        initial="hidden"
        animate="visible"
        className="absolute inset-0 pointer-events-none"
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${ACCENT_COLOR}30 0%, transparent 70%)`,
            filter: "blur(60px)",
          }}
        />
      </motion.div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="text-center space-y-8"
        >
          <motion.div variants={scaleIn}>
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium"
              style={{
                borderColor: `${ACCENT_COLOR}44`,
                background: `${ACCENT_COLOR}11`,
                color: ACCENT_COLOR,
              }}
            >
              <Sparkles className="w-4 h-4" />
              {t("cta.badge")}
            </span>
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="font-space-grotesk text-4xl md:text-6xl font-bold text-white tracking-tight text-balance leading-tight"
          >
            {t("cta.heading")}
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="text-white/55 text-lg leading-relaxed max-w-xl mx-auto"
          >
            {t("cta.sub")}
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/contact"
              className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white text-sm overflow-hidden transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c63ff]"
              style={{
                background: `linear-gradient(135deg, ${ACCENT_COLOR}, ${ACCENT_CYAN})`,
                boxShadow: `0 0 40px rgba(108,99,255,0.45)`,
              }}
            >
              <Mail className="w-4 h-4" />
              <span>{t("cta.button_primary")}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>

            <div className="flex items-center gap-3">
              {[
                { icon: Github, href: BRAND.github, label: "GitHub" },
                { icon: Linkedin, href: BRAND.linkedin, label: "LinkedIn" },
              ].map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors duration-200"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.p variants={fadeIn} className="text-white/30 text-sm">
            {t("cta.footnote")}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <main className="bg-[#0a0a0f] min-h-screen">
      <HeroSection />
      <ProjectsSection />
      <SkillsSection />
      <TestimonialsSection />
      <CTASection />
    </main>
  );
}