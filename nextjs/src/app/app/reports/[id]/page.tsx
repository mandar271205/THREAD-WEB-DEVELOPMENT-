"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createSPASassClientAuthenticated } from "@/lib/supabase/client";
import { motion, animate } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, ArrowLeft, AlertTriangle, Share2, Upload, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// ─── Animated number counter ────────────────────────────────
function AnimatedNumber({ value, duration = 1.8 }: { value: number; duration?: number }) {
    const ref = useRef<HTMLSpanElement>(null);
    useEffect(() => {
        const controls = animate(0, value, {
            duration,
            ease: [0.25, 0.1, 0.25, 1] as any,
            onUpdate(v) {
                if (ref.current) ref.current.textContent = Math.round(v).toString();
            },
        });
        return () => controls.stop();
    }, [value, duration]);
    return (
        <span ref={ref} className="font-mono-data text-2xl font-bold text-white">
            0
        </span>
    );
}

// ─── Confidence Radial Ring ──────────────────────────────────
function ConfidenceRing({ score }: { score: number }) {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const strokeDash = (score / 100) * circumference;
    const color = score >= 85 ? "#10B981" : score >= 70 ? "#F59E0B" : "#EF4444";

    return (
        <div className="flex flex-col items-center gap-2">
            <svg width="88" height="88" className="-rotate-90">
                <circle cx="44" cy="44" r={radius} fill="none" stroke="#1F2937" strokeWidth="6" />
                <motion.circle
                    cx="44"
                    cy="44"
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: circumference - strokeDash }}
                    transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                />
            </svg>
            <span
                className="font-mono-data text-lg font-bold -mt-2"
                style={{ color }}
            >
                {score}%
            </span>
            <span className="text-xs text-[#9CA3AF]">Confidence</span>
        </div>
    );
}

// ─── Thread Grid Visualisation ───────────────────────────────
function ThreadGrid({ warp, weft }: { warp: number; weft: number }) {
    const COLS = 20;
    const ROWS = 20;
    const totalCells = COLS * ROWS;
    const density = warp + weft;
    const fillCount = Math.min(Math.round((density / 400) * totalCells), totalCells);

    return (
        <div className="mt-6">
            <p className="text-xs text-[#6B7280] mb-2 uppercase tracking-wider font-medium">
                Thread Grid Visualisation
            </p>
            <div
                className="grid gap-[2px]"
                style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
            >
                {Array.from({ length: totalCells }).map((_, i) => (
                    <motion.div
                        key={i}
                        className={cn(
                            "aspect-square rounded-[1px]",
                            i < fillCount ? "bg-indigo-500" : "bg-[#1F2937]"
                        )}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            delay: i < fillCount ? 2.2 + i * 0.006 : 0.1,
                            duration: 0.12,
                        }}
                    />
                ))}
            </div>
            <p className="text-xs text-[#6B7280] mt-2">
                {density} threads/cm² total density ({fillCount}/{totalCells} grid filled)
            </p>
        </div>
    );
}

// ─── Grade badge config ──────────────────────────────────────
const gradeConfig: Record<string, { color: string; glow: string; bg: string; label: string }> = {
    A: { color: "#10B981", glow: "0 0 20px rgba(16,185,129,0.4)", bg: "rgba(16,185,129,0.1)", label: "Grade A" },
    B: { color: "#F59E0B", glow: "0 0 20px rgba(245,158,11,0.4)", bg: "rgba(245,158,11,0.1)", label: "Grade B" },
    C: { color: "#EF4444", glow: "0 0 20px rgba(239,68,68,0.4)", bg: "rgba(239,68,68,0.1)", label: "Grade C" },
};

export default function ReportPage() {
    const params = useParams();
    const router = useRouter();
    const reportId = params.id as string;
    const [report, setReport] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [imgLoaded, setImgLoaded] = useState(false);

    useEffect(() => {
        async function fetchReport() {
            try {
                const supabase = await createSPASassClientAuthenticated();
                const client = supabase.getSupabaseClient();
                const { data, error } = await client
                    .from("reports")
                    .select("*, uploads(image_url, filename)")
                    .eq("id", reportId)
                    .single();
                if (error) throw error;
                setReport(data);
            } catch (err: any) {
                setError("Failed to load report. It may have been deleted or you don't have access.");
            } finally {
                setLoading(false);
            }
        }
        fetchReport();
    }, [reportId]);

    const downloadPdf = async () => {
        try {
            const supabase = await createSPASassClientAuthenticated();
            const client = supabase.getSupabaseClient();
            const session = await client.auth.getSession();
            const token = session.data.session?.access_token;
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const response = await fetch(`${apiUrl}/reports/${reportId}/pdf`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error("Failed to generate PDF");
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `ThreadCounty_Report_${reportId.substring(0, 8)}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            toast.success("PDF downloaded successfully!");
        } catch (err) {
            toast.error("Error downloading PDF. Please try again.");
        }
    };

    const shareReport = async () => {
        const url = window.location.href;
        await navigator.clipboard.writeText(url);
        toast.success("Report link copied to clipboard!");
    };

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto space-y-6 pb-20 lg:pb-0">
                <Skeleton className="h-8 w-36 bg-[#1F2937]" />
                <div className="grid lg:grid-cols-2 gap-8">
                    <Skeleton className="h-[420px] rounded-xl bg-[#1F2937] animate-pulse" />
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-14 w-full bg-[#1F2937]" />
                        ))}
                        <Skeleton className="h-40 w-full bg-[#1F2937]" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !report) {
        return (
            <div className="text-center py-20">
                <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Report Not Found</h2>
                <p className="text-[#9CA3AF] mb-6">{error}</p>
                <Button className="bg-indigo-600 hover:bg-indigo-500 text-white" asChild>
                    <Link href="/app">Return to Dashboard</Link>
                </Button>
            </div>
        );
    }

    const grade = report.quality_grade as string;
    const gradeCfg = gradeConfig[grade] || gradeConfig["C"];

    return (
        <PageWrapper className="pb-20 lg:pb-0">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Back + title */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="-ml-3 mb-2 text-[#9CA3AF] hover:text-white hover:bg-[#1F2937]"
                            asChild
                        >
                            <Link href="/app">
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                Back to Dashboard
                            </Link>
                        </Button>
                        <h1 className="text-2xl lg:text-3xl font-bold text-white">Analysis Report</h1>
                        <p className="text-xs text-[#6B7280] mt-1 font-mono-data">
                            ID: {report.id}
                        </p>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, delay: 2 }}
                        className="px-5 py-2 rounded-xl font-bold text-lg border"
                        style={{
                            color: gradeCfg.color,
                            background: gradeCfg.bg,
                            boxShadow: gradeCfg.glow,
                            borderColor: gradeCfg.color + "50",
                        }}
                    >
                        {gradeCfg.label}
                    </motion.div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* ─── LEFT: Image ─────────────────────────────── */}
                    <div>
                        <div className="bg-[#111827] border border-[#374151] rounded-xl overflow-hidden">
                            <div className="aspect-square relative bg-[#0A0F1E]">
                                {!imgLoaded && (
                                    <div className="absolute inset-0 shimmer" />
                                )}
                                {report.uploads?.image_url ? (
                                    <img
                                        src={report.uploads.image_url}
                                        alt="Analyzed Fabric"
                                        className="w-full h-full object-cover"
                                        onLoad={() => setImgLoaded(true)}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[#374151]">
                                        Image unavailable
                                    </div>
                                )}
                            </div>

                            {/* Image metadata */}
                            <div className="p-4 border-t border-[#374151] space-y-2">
                                {[
                                    { label: "Filename", value: report.uploads?.filename || "Unknown" },
                                    { label: "Analysis Method", value: "ThreadCounty AI v1.0" },
                                ].map((row, i) => (
                                    <div key={i} className="flex justify-between text-xs">
                                        <span className="text-[#6B7280]">{row.label}</span>
                                        <span className="text-[#9CA3AF] font-medium truncate ml-4 max-w-[180px]">{row.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ─── RIGHT: Analysis Card ─────────────────────── */}
                    <div className="bg-[#111827] border border-[#374151] rounded-2xl p-6 lg:p-8 space-y-5">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-white">Thread Density Analysis</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-xs font-medium">
                                        <Sparkles className="w-2.5 h-2.5" />
                                        AI
                                    </span>
                                </div>
                            </div>
                            <ConfidenceRing score={report.confidence_score} />
                        </div>

                        <Separator className="bg-[#374151]" />

                        {/* Metric rows */}
                        <div className="space-y-0">
                            {/* Weave Classification */}
                            <div className="flex justify-between items-baseline py-3.5 border-b border-[#1F2937]">
                                <span className="text-sm text-[#9CA3AF]">Weave Classification</span>
                                <span className="font-semibold text-white">{report.weave_type}</span>
                            </div>

                            {/* Warp Count */}
                            <div className="flex justify-between items-baseline py-3.5 border-b border-[#1F2937]">
                                <span className="text-sm text-[#9CA3AF]">Warp Count</span>
                                <div className="flex items-baseline gap-1">
                                    <AnimatedNumber value={report.warp_density} duration={1.6} />
                                    <span className="text-xs text-[#6B7280]">/cm</span>
                                </div>
                            </div>

                            {/* Weft Count */}
                            <div className="flex justify-between items-baseline py-3.5 border-b border-[#1F2937]">
                                <span className="text-sm text-[#9CA3AF]">Weft Count</span>
                                <div className="flex items-baseline gap-1">
                                    <AnimatedNumber value={report.weft_density} duration={1.6} />
                                    <span className="text-xs text-[#6B7280]">/cm</span>
                                </div>
                            </div>

                            {/* Thread Density */}
                            <div className="flex justify-between items-baseline py-3.5">
                                <span className="text-sm text-[#9CA3AF]">Total Thread Density</span>
                                <div className="flex items-baseline gap-1">
                                    <AnimatedNumber
                                        value={report.warp_density + report.weft_density}
                                        duration={1.8}
                                    />
                                    <span className="text-xs text-[#6B7280]">threads/cm²</span>
                                </div>
                            </div>
                        </div>

                        {/* Thread Grid */}
                        <ThreadGrid warp={report.warp_density} weft={report.weft_density} />

                        {/* AI Suggestions */}
                        {report.notes && (
                            <div className="bg-[#0A0F1E] border border-indigo-500/20 rounded-xl p-4">
                                <p className="text-xs uppercase tracking-wider text-indigo-400 font-medium mb-2">
                                    AI Suggestion
                                </p>
                                <p className="text-sm text-[#D1D5DB] italic leading-relaxed">
                                    {report.notes}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                    <motion.div whileTap={{ scale: 0.97 }}>
                        <Button
                            onClick={downloadPdf}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF Report
                        </Button>
                    </motion.div>
                    <motion.div whileTap={{ scale: 0.97 }}>
                        <Button
                            onClick={shareReport}
                            variant="outline"
                            className="border-[#374151] text-[#9CA3AF] hover:text-white hover:bg-[#1F2937] hover:border-indigo-500/50"
                        >
                            <Share2 className="w-4 h-4 mr-2" />
                            Share Report
                        </Button>
                    </motion.div>
                    <motion.div whileTap={{ scale: 0.97 }}>
                        <Button
                            variant="ghost"
                            className="text-[#9CA3AF] hover:text-white hover:bg-[#1F2937]"
                            asChild
                        >
                            <Link href="/app/analyze">
                                <Upload className="w-4 h-4 mr-2" />
                                Analyse Another
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </div>
        </PageWrapper>
    );
}
