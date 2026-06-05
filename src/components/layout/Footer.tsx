import Link from "next/link";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-navy border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="text-2xl font-display font-bold text-white tracking-tight mb-4 inline-block">
            Celestine<span className="text-electricBlue">.</span>
          </Link>
          <p className="text-gray-400 max-w-sm mt-4">
            Building intelligent systems, educational platforms, and digital experiences for the future.
          </p>
          <div className="flex gap-4 mt-6">
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-electricBlue transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-electricBlue transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-electricBlue transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="mailto:hello@example.com" className="text-gray-400 hover:text-electricBlue transition-colors">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Navigation</h3>
          <ul className="flex flex-col gap-2">
            <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
            <li><Link href="/projects" className="text-gray-400 hover:text-white transition-colors">Projects</Link></li>
            <li><Link href="/services" className="text-gray-400 hover:text-white transition-colors">Services</Link></li>
            <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors">Insights</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Services</h3>
          <ul className="flex flex-col gap-2">
            <li className="text-gray-400">AI Consulting</li>
            <li className="text-gray-400">Web Development</li>
            <li className="text-gray-400">Product Strategy</li>
            <li className="text-gray-400">EdTech Solutions</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Celestine Oche. All rights reserved.
        </p>
        <div className="flex gap-6 text-sm text-gray-500">
          <Link href="/privacy" className="hover:text-gray-300">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-gray-300">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
