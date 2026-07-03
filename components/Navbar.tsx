"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Menu, X } from 'lucide-react';
import { navLinks, BRAND } from "@/lib/data";
import { navItemVariant, staggerContainer } from "@/lib/motion";
import { useTranslations } from "next-intl";

const logoVariant: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const mobileMenuVariant: Variants = {
  hidden: { opacity: 0, y: -20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.97,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

export default function Navbar() {
  const t = useTranslations();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

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

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "py-3 bg-[#0f0f0f]/80 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_32px_rgba(0,0,0,0.4)]"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <motion.div variants={logoVariant}>
          <Link
            href="/"
            className="group flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c63ff] rounded-lg"
          >
            <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#6c63ff] to-[#00d4ff] shadow-[0_0_16px_rgba(108,99,255,0.5)]">
              <span className="font-space-grotesk font-bold text-sm text-white">
                AC
              </span>
            </span>
            <span className="font-space-grotesk font-semibold text-white tracking-tight text-lg group-hover:text-[#6c63ff] transition-colors duration-300">
              {BRAND.name}
            </span>
          </Link>
        </motion.div>

        {/* Desktop Nav */}
        <motion.nav
          variants={staggerContainer}
          className="hidden md:flex items-center gap-1"
        >
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <motion.div key={link.href} variants={navItemVariant}>
                <Link
                  href={getHref(link.href)}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c63ff] group ${
                    isActive
                      ? "text-white"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-lg bg-white/8 border border-white/10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{t(`nav.${link.label.toLowerCase()}`)}</span>
                  {!isActive && (
                    <span className="absolute inset-0 rounded-lg bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
                  )}
                </Link>
              </motion.div>
            );
          })}

          <motion.div variants={navItemVariant} className="ml-4">
            <Link
              href="/contact"
              className="relative px-5 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[#6c63ff] to-[#00d4ff] shadow-[0_0_20px_rgba(108,99,255,0.35)] hover:shadow-[0_0_28px_rgba(108,99,255,0.55)] transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c63ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f0f0f]"
            >
              {t("nav.hire")}
            </Link>
          </motion.div>
        </motion.nav>

        {/* Mobile Toggle */}
        <motion.button
          variants={navItemVariant}
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/8 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c63ff]"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            variants={mobileMenuVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden absolute top-full left-4 right-4 mt-2 rounded-2xl bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            <nav className="flex flex-col p-4 gap-1">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.href}
                    href={getHref(link.href)}
                    onClick={(e) => {
                      handleNavClick(e, link.href);
                      setMobileOpen(false);
                    }}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-[#6c63ff]/20 text-[#6c63ff] border border-[#6c63ff]/30"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {t(`nav.${link.label.toLowerCase()}`)}
                  </Link>
                );
              })}
              <div className="mt-2 pt-2 border-t border-white/8">
                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#6c63ff] to-[#00d4ff] shadow-[0_0_16px_rgba(108,99,255,0.3)]"
                >
                  {t("nav.hire")}
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}