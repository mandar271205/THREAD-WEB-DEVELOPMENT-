"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Features", href: "/#features" },
  { name: "How It Works", href: "/#workflow" },
  { name: "Pricing", href: "/#pricing" },
  { name: "FAQ", href: "/#faq" },
  { name: "Contact", href: "/#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0A0F1E]/90 backdrop-blur-md border-b border-[#374151] shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-indigo-500/10 p-2 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
            <Layers className="text-indigo-400 w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">
            Thread<span className="text-indigo-400">County</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 relative">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                  isActive
                    ? "text-white"
                    : "text-[#9CA3AF] hover:text-white hover:bg-[#1F2937]"
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-indigo-500 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="ghost"
            className="text-[#9CA3AF] hover:text-white hover:bg-[#1F2937]"
            asChild
          >
            <Link href="/auth/login">Sign In</Link>
          </Button>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg font-medium transition-all shadow-lg shadow-indigo-500/20"
              asChild
            >
              <Link href="/auth/register">Get Started Free</Link>
            </Button>
          </motion.div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-[#9CA3AF] hover:text-white hover:bg-[#1F2937]">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-[#0A0F1E] border-[#374151] w-[280px] flex flex-col"
            >
              <SheetTitle className="text-left">
                <Link
                  href="/"
                  className="flex items-center gap-2 mb-2"
                  onClick={() => setMobileOpen(false)}
                >
                  <div className="bg-indigo-500/10 p-1.5 rounded-lg">
                    <Layers className="text-indigo-400 w-4 h-4" />
                  </div>
                  <span className="font-bold text-lg text-white">
                    Thread<span className="text-indigo-400">County</span>
                  </span>
                </Link>
              </SheetTitle>

              <div className="flex flex-col gap-1 mt-6 flex-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-[#9CA3AF] hover:text-white hover:bg-[#1F2937] px-4 py-3 rounded-lg font-medium transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="flex flex-col gap-3 pt-6 border-t border-[#374151] mt-auto">
                <Button
                  variant="outline"
                  className="w-full border-[#374151] text-[#9CA3AF] hover:text-white hover:bg-[#1F2937] hover:border-[#6366F1]"
                  asChild
                >
                  <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                    Sign In
                  </Link>
                </Button>
                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white"
                  asChild
                >
                  <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
                    Get Started Free
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
