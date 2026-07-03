"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useTransform, useSpring, type Variants } from "framer-motion";
import { Code2 as Github, Eye, ArrowRight, Star, GitFork, Sparkles, ExternalLink } from 'lucide-react';
import { BRAND } from "@/lib/data";
import {
  fadeInUp,
  fadeIn,
  staggerContainer,
  scaleIn,
  slideInFromBottom,
} from "@/lib/motion";
import { useTranslations } from "next-intl";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ProjectData {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  category: "Frontend" | "Backend" | "Full-Stack" | "OSS";
  image: string;
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  stars?: number;
  forks?: number;
  color: string;
  glowColor: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const projects: ProjectData[] = [
  {
    id: "aurora-ui",
    title: "Aurora UI",
    description: "A next-generation component library with glassmorphism, fluid animations, and dark-first design tokens.",
    longDescription: "Built with Radix UI primitives and Framer Motion, Aurora UI ships 60+ accessible components with zero-config theming.",
    tags: ["React", "TypeScript", "Radix UI", "Framer Motion", "Storybook"],
    category: "OSS",
    image: "https://static.shuffle.dev/files/1691490198/aurora-icon.svg",
    liveUrl: "https://aurora-ui.dev",
    githubUrl: "https://github.com/alexchen/aurora-ui",
    featured: true,
    stars: 2400,
    forks: 187,
    color: "from-violet-600 to-indigo-600",
    glowColor: "rgba(108,99,255,0.45)",
  },
  {
    id: "nexus-commerce",
    title: "Nexus Commerce",
    description: "Full-stack e-commerce platform with real-time inventory, AI-powered recommendations, and sub-100ms checkout.",
    longDescription: "Handles 50k+ daily transactions with edge-cached product pages, Stripe integration, and a custom headless CMS.",
    tags: ["Next.js", "PostgreSQL", "Stripe", "Redis", "Tailwind CSS"],
    category: "Full-Stack",
    image: "https://www.omniconvert.com/_astro/logo-nexus-black.Ci_0QKmZ_19DKCs.svg",
    liveUrl: "https://nexus-commerce.io",
    githubUrl: "https://github.com/alexchen/nexus-commerce",
    featured: true,
    stars: 890,
    forks: 64,
    color: "from-cyan-500 to-blue-600",
    glowColor: "rgba(0,212,255,0.4)",
  },
  {
    id: "prism-analytics",
    title: "Prism Analytics",
    description: "Real-time analytics dashboard with WebSocket data streams, interactive D3 charts, and custom alerting rules.",
    longDescription: "Processes 2M+ events/day with a Go backend, ClickHouse for OLAP queries, and a React frontend with live updates.",
    tags: ["React", "Go", "ClickHouse", "WebSockets", "D3.js"],
    category: "Full-Stack",
    image: "https://workday.scene7.com/is/image/workday/screenshot-prism-analytics-discoveryboards-laptop-1?fmt=webp-alpha&wid=1000",
    liveUrl: "https://prism-analytics.app",
    githubUrl: "https://github.com/alexchen/prism-analytics",
    featured: true,
    stars: 1200,
    forks: 98,
    color: "from-emerald-500 to-teal-600",
    glowColor: "rgba(16,185,129,0.4)",
  },
  {
    id: "vector-api",
    title: "Vector API",
    description: "High-performance vector search API built on pgvector, supporting semantic search across millions of embeddings.",
    longDescription: "REST + GraphQL API with OpenAI embedding support, rate limiting, and a developer-friendly SDK for Node and Python.",
    tags: ["Node.js", "PostgreSQL", "pgvector", "GraphQL", "OpenAI"],
    category: "Backend",
    image: "https://www.motioncraft-furniture.com/sites/motioncraft-furniture.com/files/styles/header_slideshow/public/three-way.jpg?itok=1WKZjrRm",
    githubUrl: "https://github.com/alexchen/vector-api",
    stars: 640,
    forks: 41,
    color: "from-orange-500 to-rose-600",
    glowColor: "rgba(249,115,22,0.4)",
  },
  {
    id: "motion-craft",
    title: "Motion Craft",
    description: "Visual animation editor for React — drag-and-drop keyframes, easing curves, and one-click Framer Motion export.",
    longDescription: "A browser-based tool that generates production-ready Framer Motion code from a timeline-based visual editor.",
    tags: ["React", "TypeScript", "Canvas API", "Framer Motion", "Zustand"],
    category: "Frontend",
    image: "https://www.awn.com/sites/default/files/styles/large_featured/public/image/featured/1016397-craft-animations-introduces-craft-camerafx-motionbuilder.png?itok=FN3EwRiZ",
    liveUrl: "https://motioncraft.dev",
    githubUrl: "https://github.com/alexchen/motion-craft",
    stars: 1750,
    forks: 132,
    color: "from-pink-500 to-purple-600",
    glowColor: "rgba(236,72,153,0.4)",
  },
  {
    id: "edge-auth",
    title: "Edge Auth",
    description: "Zero-latency authentication middleware for Next.js — JWT, OAuth2, and magic links running at the edge.",
    longDescription: "Deployed to 300+ Cloudflare edge nodes, Edge Auth adds <1ms auth overhead with full session management.",
    tags: ["Next.js", "Cloudflare Workers", "JWT", "OAuth2", "TypeScript"],
    category: "Backend",
    image: "https://s3.us-west-2.amazonaws.com/public.notion-static.com/template/fdb6ec27-1940-49bf-a267-9e2e6d8a6980/desktop.png",
    githubUrl: "https://github.com/alexchen/edge-auth",
    stars: 980,
    forks: 77,
    color: "from-yellow-500 to-orange-500",
    glowColor: "rgba(234,179,8,0.4)",
  },
  {
    id: "portfolio-os",
    title: "Portfolio OS",
    description: "An interactive macOS-style portfolio experience with a working file system, terminal, and draggable windows.",
    longDescription: "Built entirely in React with custom drag-and-drop, a virtual file system, and a fully functional terminal emulator.",
    tags: ["React", "TypeScript", "CSS Grid", "Web Workers"],
    category: "Frontend",
    image: "https://miro.medium.com/1*qYwgta7YMv0CCfrnjmaLFw.png",
    liveUrl: "https://portfolio-os.vercel.app",
    githubUrl: "https://github.com/alexchen/portfolio-os",
    stars: 3100,
    forks: 245,
    color: "from-sky-400 to-cyan-500",
    glowColor: "rgba(56,189,248,0.4)",
  },
  {
    id: "graph-db-explorer",
    title: "Graph DB Explorer",
    description: "Visual query builder and explorer for Neo4j — write Cypher queries with autocomplete and see results as force graphs.",
    longDescription: "Connects to any Neo4j instance, renders live graph visualizations with D3-force, and exports queries as reusable snippets.",
    tags: ["React", "Neo4j", "D3.js", "Cypher", "Node.js"],
    category: "OSS",
    image: "https://dist.neo4j.com/wp-content/uploads/20191015113001/bloom-viz.png",
    githubUrl: "https://github.com/alexchen/graph-db-explorer",
    stars: 520,
    forks: 38,
    color: "from-lime-500 to-green-600",
    glowColor: "rgba(132,204,22,0.4)",
  },
];

const CATEGORIES = ["All", "Frontend", "Backend", "Full-Stack", "OSS"] as const;
type Category = (typeof CATEGORIES)[number];

// ─── 3D Tilt Card ─────────────────────────────────────────────────────────────

function TiltCard({ project, index }: { project: ProjectData; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 300,
    damping: 30,
  });
  const glowX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const glowY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const cardVariant: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.55,
        ease: "easeOut",
        delay: (index % 4) * 0.08,
      },
    },
  };

  return (
    <motion.div
      variants={cardVariant}
      style={{ perspective: 1000 }}
      className="group"
    >
      <motion.div
        ref={cardRef}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative rounded-2xl border border-white/8 bg-[#111]/80 backdrop-blur-sm overflow-hidden cursor-pointer transition-all duration-300 group-hover:border-white/20 group-hover:shadow-[0_0_40px_var(--glow)]"
        // @ts-ignore css variable
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          "--glow": project.glowColor,
        }}
      >
        {/* Neon glow border on hover */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at ${glowX} ${glowY}, ${project.glowColor} 0%, transparent 70%)`,
            zIndex: 0,
          }}
        />

        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = "none";
            }}
          />
          {/* Gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-30 group-hover:opacity-50 transition-opacity duration-300`} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />

          {/* Featured badge */}
          {project.featured && (
            <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-[#6c63ff]/20 border border-[#6c63ff]/40 backdrop-blur-sm">
              <Sparkles className="w-3 h-3 text-[#6c63ff]" />
              <span className="text-[10px] font-semibold text-[#6c63ff] uppercase tracking-wider">Featured</span>
            </div>
          )}

          {/* Category badge */}
          <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-black/40 border border-white/10 backdrop-blur-sm">
            <span className="text-[10px] font-medium text-white/70 uppercase tracking-wider">{project.category}</span>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 p-5 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-space-grotesk font-bold text-white text-lg leading-tight group-hover:text-white transition-colors">
              {project.title}
            </h3>
            {(project.stars !== undefined) && (
              <div className="flex items-center gap-1 shrink-0 mt-0.5">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span className="text-xs text-white/50 font-medium">
                  {(project.stars ?? 0) >= 1000
                    ? `${((project.stars ?? 0) / 1000).toFixed(1)}k`
                    : String(project.stars ?? 0)}
                </span>
              </div>
            )}
          </div>

          <p className="text-white/55 text-sm leading-relaxed line-clamp-2">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {(project.tags ?? []).slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-colors duration-200"
              >
                {tag}
              </span>
            ))}
            {(project.tags ?? []).length > 4 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-white/5 border border-white/10 text-white/40">
                +{project.tags.length - 4}
              </span>
            )}
          </div>

          {/* Links */}
          <div className="flex items-center gap-2 pt-2 border-t border-white/5">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200 text-xs font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                <Github className="w-3.5 h-3.5" />
                Code
                {project.forks !== undefined && (
                  <span className="flex items-center gap-0.5 text-white/30 ml-1">
                    <GitFork className="w-3 h-3" />
                    {project.forks}
                  </span>
                )}
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#6c63ff]/10 border border-[#6c63ff]/30 text-[#6c63ff] hover:bg-[#6c63ff]/20 hover:border-[#6c63ff]/50 transition-all duration-200 text-xs font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                <Eye className="w-3.5 h-3.5" />
                Live Demo
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Animated Counter ─────────────────────────────────────────────────────────

function StatBadge({ label, value }: { label: string; value: string }) {
  return (
    <motion.div
      variants={scaleIn}
      className="flex flex-col items-center gap-1 px-6 py-4 rounded-2xl bg-white/3 border border-white/8"
    >
      <span className="font-space-grotesk font-bold text-2xl text-white">{value}</span>
      <span className="text-white/40 text-xs uppercase tracking-widest">{label}</span>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProjectsPage() {
  const t = useTranslations();
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const filtered = activeCategory === "All"
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  const totalStars = projects.reduce((sum, p) => sum + (p.stars ?? 0), 0);
  const totalForks = projects.reduce((sum, p) => sum + (p.forks ?? 0), 0);

  const headerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1, delayChildren: 0.05 },
    },
  };

  const wordVariant: Variants = {
    hidden: { opacity: 0, y: 60, skewY: 4 },
    visible: {
      opacity: 1,
      y: 0,
      skewY: 0,
      transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  const tabVariant: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut", delay: i * 0.06 },
    }),
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* ── Background mesh ── */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-[#6c63ff]/6 blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-[#00d4ff]/5 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24">
        {/* ── Editorial Header ── */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="mb-20"
        >
          {/* Eyebrow */}
          <motion.div variants={fadeIn} className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-[#6c63ff] to-transparent" />
            <span className="text-[#6c63ff] text-xs font-semibold uppercase tracking-[0.2em]">
              Selected Work
            </span>
          </motion.div>

          {/* Headline — word-by-word reveal */}
          <div className="overflow-hidden mb-4">
            <motion.h1
              variants={wordVariant}
              className="font-space-grotesk font-bold text-5xl md:text-7xl lg:text-8xl text-white tracking-tight text-balance leading-[0.95]"
            >
              Things I&apos;ve
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-6">
            <motion.span
              variants={wordVariant}
              className="block font-space-grotesk font-bold text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95]"
              style={{
                background: "linear-gradient(135deg, #6c63ff 0%, #00d4ff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Built
            </motion.span>
          </div>

          <motion.p
            variants={fadeInUp}
            className="text-white/50 text-lg md:text-xl max-w-xl leading-relaxed text-pretty"
          >
            A curated collection of projects spanning frontend craft, backend systems, and open-source tools — each one solving a real problem.
          </motion.p>

          {/* Stats row */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap gap-3 mt-10"
          >
            <StatBadge label="Projects" value={String(projects.length)} />
            <StatBadge
              label="GitHub Stars"
              value={`${(totalStars / 1000).toFixed(1)}k`}
            />
            <StatBadge label="Forks" value={String(totalForks)} />
            <StatBadge label="OSS Contributions" value="40+" />
          </motion.div>
        </motion.div>

        {/* ── Filter Tabs ── */}
        <motion.div
          initial="hidden"
          animate="visible"
          className="flex flex-wrap gap-2 mb-12"
        >
          {CATEGORIES.map((cat, i) => {
            const count =
              cat === "All"
                ? projects.length
                : projects.filter((p) => p.category === cat).length;
            const isActive = activeCategory === cat;

            return (
              <motion.button
                key={cat}
                custom={i}
                variants={tabVariant}
                onClick={() => setActiveCategory(cat)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c63ff] ${
                  isActive
                    ? "text-white"
                    : "text-white/50 hover:text-white/80 bg-white/3 border border-white/8 hover:border-white/15"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#6c63ff] to-[#00d4ff] shadow-[0_0_20px_rgba(108,99,255,0.5)]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
                <span
                  className={`relative z-10 flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                    isActive ? "bg-white/20 text-white" : "bg-white/8 text-white/40"
                  }`}
                >
                  {count}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* ── Project Grid ── */}
        <motion.div
          key={activeCategory}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filtered.map((project, index) => (
            <TiltCard key={project.id} project={project} index={index} />
          ))}
        </motion.div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="text-center py-24 text-white/30"
          >
            <p className="text-lg">No projects in this category yet.</p>
          </motion.div>
        )}

        {/* ── CTA Banner ── */}
        <motion.div
          variants={slideInFromBottom}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-24 relative rounded-3xl overflow-hidden border border-white/8 bg-gradient-to-br from-[#6c63ff]/10 via-[#0a0a0a] to-[#00d4ff]/8 p-12 text-center"
        >
          {/* Glow orbs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-[#6c63ff]/60 to-transparent" />
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-[#6c63ff]/8 blur-[80px] pointer-events-none" />

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.p variants={fadeIn} className="text-[#6c63ff] text-xs font-semibold uppercase tracking-[0.2em] mb-4">
              Open to Collaboration
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="font-space-grotesk font-bold text-3xl md:text-4xl text-white tracking-tight mb-4 text-balance"
            >
              Have a project in mind?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-white/50 text-base max-w-md mx-auto mb-8 leading-relaxed">
              I&apos;m always interested in ambitious projects and open-source collaborations. Let&apos;s build something great together.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#6c63ff] to-[#00d4ff] text-white font-semibold text-sm shadow-[0_0_24px_rgba(108,99,255,0.5)] hover:shadow-[0_0_36px_rgba(108,99,255,0.7)] transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Get in Touch
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <a
                href={BRAND.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 font-semibold text-sm transition-all duration-300"
              >
                <Github className="w-4 h-4" />
                View GitHub
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}