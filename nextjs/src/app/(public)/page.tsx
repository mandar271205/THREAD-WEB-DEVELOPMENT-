"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { motion, useInView, useMotionValue, animate } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Microscope,
  Layers,
  FileText,
  History,
  Users,
  Shield,
  Star,
  Upload,
  BarChart3,
  Lock,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// Animated number counter
function AnimatedStat({ value, label, prefix = "", suffix = "" }: { value: number | string; label: string; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const motionVal = useMotionValue(0);
  const displayRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isInView && typeof value === "number") {
      const controls = animate(motionVal, value, {
        duration: 2,
        ease: "easeOut",
        onUpdate(v) {
          if (displayRef.current) {
            displayRef.current.textContent = prefix + Math.round(v).toLocaleString() + suffix;
          }
        },
      });
      return () => controls.stop();
    }
  }, [isInView, value, motionVal, prefix, suffix]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-bold gradient-text font-mono-data mb-2">
        {typeof value === "number" ? (
          <span ref={displayRef}>{prefix}0{suffix}</span>
        ) : (
          <span>{value}</span>
        )}
      </div>
      <div className="text-sm text-[#9CA3AF]">{label}</div>
    </div>
  );
}

const featureVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const containerVariants = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function LandingPage() {
  return (
    <PageWrapper className="pt-16">
      {/* ─── HERO ─── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <div className="gradient-mesh" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center py-20">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              {/* Eyebrow badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-sm font-medium mb-6"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                AI-Powered Textile Analysis
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 tracking-tight">
                <span className="text-white">Analyse Any Fabric</span>
                <br />
                <span className="gradient-text">in Seconds</span>
              </h1>

              <p className="text-lg text-[#9CA3AF] mb-8 max-w-xl leading-relaxed">
                Upload a fabric image and receive instant AI-powered thread density analysis,
                weave classification, and downloadable quality reports.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    size="lg"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-8 py-4 font-semibold shadow-xl shadow-indigo-500/20 text-base w-full sm:w-auto"
                    asChild
                  >
                    <Link href="/auth/register">
                      Upload Your First Image — Free
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="lg"
                    variant="ghost"
                    className="border border-[#374151] hover:border-indigo-500/50 hover:bg-[#111827] rounded-xl px-8 py-4 text-[#9CA3AF] hover:text-white text-base w-full sm:w-auto"
                    asChild
                  >
                    <Link href="#workflow">See How It Works</Link>
                  </Button>
                </motion.div>
              </div>

              {/* Trust line */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {["RM", "PN", "AS"].map((initials, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-[#0A0F1E] flex items-center justify-center text-xs font-bold text-white"
                      style={{
                        background: i === 0 ? "#6366F1" : i === 1 ? "#10B981" : "#F59E0B",
                      }}
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-[#9CA3AF] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                  Joined by <span className="text-white font-medium">500+</span> textile professionals
                </p>
              </div>
            </motion.div>

            {/* Right — Glassmorphism mock card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="relative hidden lg:block"
            >
              <div className="glass rounded-2xl p-6 w-full max-w-sm mx-auto shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                  <div>
                    <h3 className="font-semibold text-white">Analysis Complete</h3>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">fabric_sample_003.jpg</p>
                  </div>
                  <span className="bg-green-500/20 text-green-400 px-2.5 py-1 rounded-full text-xs font-bold border border-green-500/30">
                    Grade A
                  </span>
                </div>

                <div className="space-y-4">
                  {[
                    { label: "Warp Count", value: "120", unit: "/cm" },
                    { label: "Weft Count", value: "84", unit: "/cm" },
                    { label: "Thread Density", value: "204", unit: "threads/cm²" },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-[#9CA3AF] text-sm">{item.label}</span>
                      <span className="font-mono-data font-bold text-white">
                        {item.value}
                        <span className="text-xs text-[#6B7280] ml-1 font-normal font-sans">{item.unit}</span>
                      </span>
                    </div>
                  ))}

                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-[#9CA3AF] mb-1.5">
                      <span>AI Confidence</span>
                      <span className="text-indigo-400 font-medium">92%</span>
                    </div>
                    <div className="h-1.5 bg-[#1F2937] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "92%" }}
                        transition={{ delay: 0.8, duration: 1.2 }}
                        className="h-full bg-indigo-500 rounded-full"
                      />
                    </div>
                  </div>

                  <div className="mt-2 p-3 bg-indigo-500/5 border border-indigo-500/20 rounded-lg">
                    <p className="text-xs text-indigo-300 font-medium mb-1">AI Suggestion</p>
                    <p className="text-xs text-[#D1D5DB] italic">
                      High-quality plain weave. Suitable for premium apparel applications.
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative glow */}
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="bg-[#111827] border-y border-[#374151] py-14">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:divide-x divide-[#374151]">
            <AnimatedStat value={10000} suffix="+" label="Fabrics Analysed" />
            <AnimatedStat value="99.2%" label="Analysis Accuracy" />
            <AnimatedStat value={500} suffix="+" label="Active Users" />
            <AnimatedStat value="< 3s" label="Average Analysis Time" />
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-indigo-400 text-sm font-medium uppercase tracking-wider mb-3">Features</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything You Need for Fabric QC
            </h2>
            <p className="text-[#9CA3AF] text-lg">
              Powerful tools built specifically for the modern textile industry.
            </p>
          </div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {[
              { icon: Microscope, title: "Thread Density Analysis", desc: "Warp & weft count per cm with precision confidence scoring and statistical validation." },
              { icon: Layers, title: "Weave Classification", desc: "Auto-identifies plain, twill, satin, rib, and jacquard patterns with high accuracy." },
              { icon: FileText, title: "Detailed PDF Reports", desc: "Professional PDF reports with full analysis breakdown, downloadable at any time." },
              { icon: History, title: "Analysis History", desc: "Access all past uploads, filter by date, fabric type, or quality grade." },
              { icon: Users, title: "Team Dashboard", desc: "Multi-user access with role-based permissions for QC teams and administrators." },
              { icon: Lock, title: "Secure Storage", desc: "All fabric images encrypted and stored with enterprise-grade access controls." },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={featureVariants}
                className="bg-[#111827] border border-[#374151] rounded-xl p-6 card-lift group"
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-5 group-hover:bg-indigo-500/20 transition-colors">
                  <feature.icon className="text-indigo-400 w-5 h-5" />
                </div>
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-[#9CA3AF] leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── WORKFLOW ─── */}
      <section id="workflow" className="py-24 bg-[#111827]/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-indigo-400 text-sm font-medium uppercase tracking-wider mb-3">Process</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-[#9CA3AF] text-lg">
              A simple 3-step process to transform your QC workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Connecting dashed lines */}
            <div className="hidden md:flex absolute top-14 left-1/3 right-1/3 items-center justify-between pointer-events-none z-0">
              <div className="flex-1 border-t-2 border-dashed border-[#374151]" />
            </div>

            {[
              { num: 1, title: "Upload Fabric Image", desc: "Drag & drop JPG or PNG up to 10MB. No registration required for your first analysis.", icon: Upload },
              { num: 2, title: "AI Analyses Instantly", desc: "Thread count, weave type, and quality grade determined in under 3 seconds.", icon: Microscope },
              { num: 3, title: "Download Report", desc: "PDF report with full metrics, confidence scores, and AI quality suggestions.", icon: FileText },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-[#0A0F1E] border border-[#374151] rounded-2xl p-8 text-center relative z-10 card-lift"
              >
                <div className="w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xl mx-auto mb-6 shadow-lg shadow-indigo-500/30">
                  {step.num}
                </div>
                <h3 className="font-semibold text-white text-lg mb-3">{step.title}</h3>
                <p className="text-[#9CA3AF] text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-indigo-400 text-sm font-medium uppercase tracking-wider mb-3">Testimonials</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Trusted by the Industry
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "ThreadCounty cut our manual inspection time by 60%. The accuracy is remarkable — results our lab confirms with physical tests.",
                name: "Ravi Mehta",
                role: "QC Manager",
                company: "Bharat Textiles",
                initials: "RM",
                color: "#6366F1",
              },
              {
                quote: "Finally, accurate thread counts without expensive lab equipment. This has democratized fabric analysis for our students.",
                name: "Dr. Priya Nair",
                role: "Researcher",
                company: "NIT Surat",
                initials: "PN",
                color: "#10B981",
              },
              {
                quote: "The admin dashboard gives our entire team real-time QC visibility across all production lines. Game changer.",
                name: "Arjun Shah",
                role: "Production Head",
                company: "Patel Fabrics",
                initials: "AS",
                color: "#F59E0B",
              },
            ].map((test, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-[#111827] border border-[#374151] rounded-xl p-6 card-lift"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, si) => (
                    <Star key={si} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-[#D1D5DB] italic leading-relaxed mb-5">
                  &ldquo;{test.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: test.color }}
                  >
                    {test.initials}
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">{test.name}</p>
                    <p className="text-xs text-[#9CA3AF]">
                      {test.role} · {test.company}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" className="py-24 bg-[#111827]/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-indigo-400 text-sm font-medium uppercase tracking-wider mb-3">Pricing</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
            <p className="text-[#9CA3AF]">Choose the plan that fits your workflow.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { name: "Free", price: "₹0", desc: "Perfect for trying out ThreadCounty", features: ["5 uploads/month", "Basic analysis", "PNG/JPG support", "7-day history"], featured: false },
              { name: "Student", price: "₹499", desc: "For academic research and learning", features: ["50 uploads/month", "Full analysis", "PDF reports", "30-day history", "Email support"], featured: false },
              { name: "Professional", price: "₹1,999", desc: "For QC teams and manufacturers", features: ["500 uploads/month", "Priority AI analysis", "PDF + CSV reports", "1-year history", "Priority support", "API access"], featured: true },
              { name: "Enterprise", price: "Custom", desc: "For large-scale operations", features: ["Unlimited uploads", "Dedicated AI model", "Custom reports", "Unlimited history", "24/7 support", "On-premise option"], featured: false },
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className={cn(
                  "bg-[#111827] border rounded-2xl p-8 card-lift relative",
                  plan.featured
                    ? "border-indigo-500 scale-105 shadow-xl shadow-indigo-500/10"
                    : "border-[#374151]"
                )}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <p className="text-xs font-medium uppercase tracking-wider text-[#9CA3AF] mb-2">{plan.name}</p>
                <p className="text-4xl font-bold text-white mb-1">
                  {plan.price}
                  {plan.price !== "Custom" && <span className="text-base text-[#6B7280] font-normal">/mo</span>}
                </p>
                <p className="text-xs text-[#9CA3AF] mb-6">{plan.desc}</p>
                <div className="border-t border-[#374151] my-4" />
                <ul className="space-y-2.5 mb-8">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-center gap-2 text-sm text-[#D1D5DB]">
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className={cn(
                    "w-full rounded-lg",
                    plan.featured
                      ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                      : "border border-[#374151] bg-transparent text-[#9CA3AF] hover:text-white hover:border-indigo-500 hover:bg-[#1F2937]"
                  )}
                  asChild
                >
                  <Link href="/auth/register">
                    {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <p className="text-indigo-400 text-sm font-medium uppercase tracking-wider mb-3">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Frequently Asked Questions</h2>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-2">
            {[
              {
                q: "What fabric types can ThreadCounty analyse?",
                a: "We support a wide range of fabrics including cotton, silk, polyester, and blends. Our AI identifies Plain, Twill, Satin, Rib, and Jacquard weaves with over 99% accuracy on standard patterns.",
              },
              {
                q: "How accurate is the AI analysis?",
                a: "Our proprietary model achieves 99.2% accuracy for standard weaves and densities. For complex jacquards and specialty fabrics, accuracy remains above 95%. Results are validated against industry-standard lab testing.",
              },
              {
                q: "What image formats and sizes are supported?",
                a: "You can upload JPG, JPEG, or PNG images up to 10MB. For best results, use well-lit macro-level photos with at least 300 DPI resolution. Ensure the fabric surface is flat and the weave structure is clearly visible.",
              },
              {
                q: "Can I download my analysis reports?",
                a: "Yes. PDF reports containing full metrics, AI suggestions, confidence scores, and the original image are available immediately after analysis. Professional and Enterprise plans also include CSV bulk exports.",
              },
              {
                q: "Is my fabric data secure and private?",
                a: "Absolutely. All images are stored in private cloud buckets with AES-256 encryption at rest. We never share your proprietary fabric patterns with any third parties, and images are deleted on request.",
              },
              {
                q: "How does the free plan differ from paid plans?",
                a: "The free plan includes 5 uploads per month with basic analysis. Paid plans unlock more uploads, PDF exports, longer history retention, API access, and priority AI processing. Enterprise offers unlimited everything.",
              },
            ].map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="bg-[#111827] border border-[#374151] rounded-xl px-6 data-[state=open]:border-indigo-500/50"
              >
                <AccordionTrigger className="text-white hover:text-indigo-400 font-medium text-left hover:no-underline py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-[#9CA3AF] text-sm leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ─── CONTACT ─── */}
      <section id="contact" className="py-24 bg-[#111827]/50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-indigo-400 text-sm font-medium uppercase tracking-wider mb-3">Contact</p>
              <h2 className="text-3xl font-bold text-white mb-6">Get in Touch</h2>
              <p className="text-[#9CA3AF] mb-8 leading-relaxed">
                Have questions about enterprise plans or need technical support? Drop us a message
                and our team will get back to you within 24 hours.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-[#9CA3AF]">
                  <div className="w-10 h-10 rounded-lg bg-[#1F2937] border border-[#374151] flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-sm">support@threadcounty.com</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-[#111827] border border-[#374151] p-8 rounded-2xl"
            >
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#9CA3AF]">Name</label>
                    <Input
                      placeholder="John Doe"
                      className="bg-[#0A0F1E] border-[#374151] text-white placeholder-[#6B7280] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#9CA3AF]">Email</label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      className="bg-[#0A0F1E] border-[#374151] text-white placeholder-[#6B7280] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#9CA3AF]">Subject</label>
                  <Input
                    placeholder="How can we help?"
                    className="bg-[#0A0F1E] border-[#374151] text-white placeholder-[#6B7280] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#9CA3AF]">Message</label>
                  <Textarea
                    placeholder="Your message here..."
                    rows={4}
                    className="bg-[#0A0F1E] border-[#374151] text-white placeholder-[#6B7280] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                  />
                </div>
                <motion.div whileTap={{ scale: 0.97 }}>
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white">
                    Send Message
                  </Button>
                </motion.div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}