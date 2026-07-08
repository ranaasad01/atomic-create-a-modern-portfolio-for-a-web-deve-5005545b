"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Code2 as Github, MessageCircle as Twitter, Briefcase as Linkedin, Mail, ArrowUp } from 'lucide-react';
import { navLinks, BRAND } from "@/lib/data";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations();
  const pathname = usePathname();

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("#") && pathname === "/") {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getHref = (href: string) => {
    if (href.startsWith("#")) {
      return pathname === "/" ? href : `/${href}`;
    }
    return href;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socials = [
    { icon: Github, href: BRAND.github, label: "GitHub" },
    { icon: Twitter, href: BRAND.twitter, label: "Twitter" },
    { icon: Linkedin, href: BRAND.linkedin, label: "LinkedIn" },
    { icon: Mail, href: `mailto:${BRAND.email}`, label: "Email" },
  ];

  return (
    <footer className="relative border-t border-white/8 bg-[#0a0a0a]">
      {/* Glow accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-[#6c63ff]/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12"
        >
          {/* Brand column */}
          <motion.div variants={fadeInUp} className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#6c63ff] to-[#00d4ff] shadow-[0_0_16px_rgba(108,99,255,0.4)]">
                <span className="font-bold text-sm text-white">AC</span>
              </span>
              <span className="font-space-grotesk font-semibold text-white text-lg group-hover:text-[#6c63ff] transition-colors duration-300">
                {BRAND.name}
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              {t("footer.tagline")}
            </p>
            <div className="flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
              <span className="text-cyan-400 text-xs font-medium ml-1">
                {t("footer.available")}
              </span>
            </div>
          </motion.div>

          {/* Nav links */}
          <motion.div variants={fadeInUp} className="space-y-4">
            <h3 className="text-white/40 text-xs font-semibold uppercase tracking-widest">
              {t("footer.navigation")}
            </h3>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={getHref(link.href)}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-white/60 hover:text-white text-sm transition-colors duration-200 w-fit hover:translate-x-1 inline-block transition-transform"
                >
                  {t(`nav.${link.label.toLowerCase()}`)}
                </Link>
              ))}
            </nav>
          </motion.div>

          {/* Contact + socials */}
          <motion.div variants={fadeInUp} className="space-y-4">
            <h3 className="text-white/40 text-xs font-semibold uppercase tracking-widest">
              {t("footer.connect")}
            </h3>
            <a
              href={`mailto:${BRAND.email}`}
              className="block text-white/60 hover:text-[#6c63ff] text-sm transition-colors duration-200"
            >
              {BRAND.email}
            </a>
            <p className="text-white/40 text-sm">{BRAND.location}</p>
            <div className="flex items-center gap-3 pt-1">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 border border-white/8 text-white/50 hover:text-white hover:bg-[#6c63ff]/20 hover:border-[#6c63ff]/40 hover:shadow-[0_0_12px_rgba(108,99,255,0.3)] transition-all duration-300"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/6">
          <p className="text-white/30 text-xs">
            {t("footer.copyright", { year: "2024", name: BRAND.name })}
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-white/40 hover:text-white text-xs transition-all duration-300 group"
            aria-label="Scroll to top"
          >
            <span>{t("footer.backToTop")}</span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/8 group-hover:bg-[#6c63ff]/30 group-hover:shadow-[0_0_8px_rgba(108,99,255,0.4)] transition-all duration-300">
              <ArrowUp size={12} />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}