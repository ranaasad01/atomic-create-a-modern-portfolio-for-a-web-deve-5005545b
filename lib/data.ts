export interface NavLink {
  label: string;
  href: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}

export interface Skill {
  name: string;
  level: number;
  category: string;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
  tech: string[];
}

// Single source of truth for navigation
export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const BRAND = {
  name: "Alex Chen",
  tagline: "Full-Stack Developer",
  email: "hello@alexchen.dev",
  github: "https://github.com/alexchen",
  linkedin: "https://linkedin.com/in/alexchen",
  twitter: "https://twitter.com/alexchen",
  location: "San Francisco, CA",
  available: true,
} as const;

export const ACCENT_COLOR = "#6c63ff";
export const ACCENT_CYAN = "#00d4ff";