"use client";

import { useEffect, useState } from "react";
import { useGlobal } from "@/lib/context/GlobalContext";
import { createSPASassClientAuthenticated } from "@/lib/supabase/client";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Eye, Download, Trash2, UploadCloud, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

function getWeaveBadgeClass(weave: string) {
    const w = (weave || "").toLowerCase();
    if (w.includes("plain")) return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    if (w.includes("twill")) return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    if (w.includes("satin")) return "bg-pink-500/10 text-pink-400 border-pink-500/20";
    if (w.includes("rib")) return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    if (w.includes("jacquard")) return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    return "bg-[#374151] text-[#9CA3AF] border-[#374151]";
}

function getGradeBadgeClass(grade: string) {
    if (grade === "A") return "bg-green-500/10 text-green-400 border-green-500/30";
    if (grade === "B") return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    return "bg-red-500/10 text-red-400 border-red-500/30";
}

export default function HistoryPage() {
    const { user } = useGlobal();
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        if (!user?.id) return;
        const userId = user.id;

        async function fetchHistory() {
            try {
                const supabase = await createSPASassClientAuthenticated();
                const client = supabase.getSupabaseClient();
                const { data, error } = await client
                    .from("reports")
                    .select("*, uploads(image_url, filename)")
                    .eq("user_id", userId)
                    .order("created_at", { ascending: false });
                if (error) throw error;
                setReports(data || []);
            } catch (err) {
                console.error("Failed to load history", err);
            } finally {
                setLoading(false);
            }
        }
        fetchHistory();
    }, [user]);

    const handleDelete = async (reportId: string) => {
        setDeletingId(reportId);
        try {
            const supabase = await createSPASassClientAuthenticated();
            const client = supabase.getSupabaseClient();
            const { error } = await client.from("reports").delete().eq("id", reportId);
            if (error) throw error;
            setReports((prev) => prev.filter((r) => r.id !== reportId));
            toast.success("Report deleted.");
        } catch (err) {
            toast.error("Failed to delete report.");
        } finally {
            setDeletingId(null);
        }
    };

    const filtered = reports.filter((r) => {
        const s = search.toLowerCase();
        return (
            !s ||
            r.uploads?.filename?.toLowerCase().includes(s) ||
            r.weave_type?.toLowerCase().includes(s)
        );
    });

    if (loading) {
        return (
            <div className="space-y-6 max-w-6xl mx-auto pb-20 lg:pb-0">
                <Skeleton className="h-10 w-48 bg-[#1F2937]" />
                <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-14 w-full bg-[#1F2937] rounded-lg" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <PageWrapper className="pb-20 lg:pb-0">
            <div className="space-y-6 max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-white">Analysis History</h1>
                        <p className="text-[#9CA3AF] mt-1 text-sm">
                            {reports.length} total report{reports.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                    <Button
                        className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                        asChild
                    >
                        <Link href="/app/analyze">
                            <UploadCloud className="w-4 h-4 mr-2" />
                            New Analysis
                        </Link>
                    </Button>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                    <Input
                        placeholder="Search by filename or weave type..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 bg-[#111827] border-[#374151] text-white placeholder-[#6B7280] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                </div>

                {/* Table / Empty state */}
                {reports.length === 0 ? (
                    <div className="text-center py-20 bg-[#111827] border border-dashed border-[#374151] rounded-2xl">
                        <UploadCloud className="w-12 h-12 text-[#374151] mx-auto mb-4" />
                        <p className="text-white font-medium text-lg">No analyses yet</p>
                        <p className="text-[#9CA3AF] text-sm mt-1 mb-6">
                            Upload your first fabric image to get started
                        </p>
                        <Button className="bg-indigo-600 hover:bg-indigo-500 text-white" asChild>
                            <Link href="/app/analyze">Upload Image</Link>
                        </Button>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16 bg-[#111827] border border-[#374151] rounded-2xl">
                        <Search className="w-10 h-10 text-[#374151] mx-auto mb-3" />
                        <p className="text-white font-medium">No results found</p>
                        <p className="text-[#9CA3AF] text-sm mt-1">Try a different search term</p>
                    </div>
                ) : (
                    <div className="bg-[#111827] border border-[#374151] rounded-xl overflow-hidden">
                        <ScrollArea className="w-full">
                            <TooltipProvider>
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-[#1F2937] hover:bg-transparent">
                                            <TableHead className="text-xs uppercase tracking-wider text-[#6B7280] bg-[#0A0F1E] w-8">#</TableHead>
                                            <TableHead className="text-xs uppercase tracking-wider text-[#6B7280] bg-[#0A0F1E]">Preview</TableHead>
                                            <TableHead className="text-xs uppercase tracking-wider text-[#6B7280] bg-[#0A0F1E]">Filename</TableHead>
                                            <TableHead className="text-xs uppercase tracking-wider text-[#6B7280] bg-[#0A0F1E]">Fabric Type</TableHead>
                                            <TableHead className="text-xs uppercase tracking-wider text-[#6B7280] bg-[#0A0F1E]">Density</TableHead>
                                            <TableHead className="text-xs uppercase tracking-wider text-[#6B7280] bg-[#0A0F1E]">Grade</TableHead>
                                            <TableHead className="text-xs uppercase tracking-wider text-[#6B7280] bg-[#0A0F1E]">Date</TableHead>
                                            <TableHead className="text-xs uppercase tracking-wider text-[#6B7280] bg-[#0A0F1E] text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filtered.map((report, i) => (
                                            <motion.tr
                                                key={report.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: i * 0.04 }}
                                                className="border-b border-[#1F2937] hover:bg-[#1F2937] transition-colors"
                                            >
                                                <TableCell className="text-xs text-[#6B7280] py-3">{i + 1}</TableCell>
                                                <TableCell className="py-3">
                                                    {report.uploads?.image_url ? (
                                                        <img
                                                            src={report.uploads.image_url}
                                                            alt=""
                                                            className="w-10 h-10 rounded-lg object-cover border border-[#374151]"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-lg bg-[#374151] flex items-center justify-center">
                                                            <UploadCloud className="w-4 h-4 text-[#6B7280]" />
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="py-3 max-w-[160px]">
                                                    <p className="text-sm text-white truncate">
                                                        {report.uploads?.filename || "Unknown"}
                                                    </p>
                                                </TableCell>
                                                <TableCell className="py-3">
                                                    <Badge
                                                        variant="outline"
                                                        className={cn("text-xs", getWeaveBadgeClass(report.weave_type))}
                                                    >
                                                        {report.weave_type}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm font-mono-data text-[#9CA3AF] py-3">
                                                    {report.warp_density} × {report.weft_density}
                                                </TableCell>
                                                <TableCell className="py-3">
                                                    <Badge
                                                        variant="outline"
                                                        className={cn("font-bold text-xs", getGradeBadgeClass(report.quality_grade))}
                                                    >
                                                        {report.quality_grade}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-xs text-[#9CA3AF] py-3 whitespace-nowrap">
                                                    {format(new Date(report.created_at), "MMM d, yyyy")}
                                                </TableCell>
                                                <TableCell className="text-right py-3">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="w-8 h-8 text-[#6B7280] hover:text-white hover:bg-[#374151]"
                                                                    asChild
                                                                >
                                                                    <Link href={`/app/reports/${report.id}`}>
                                                                        <Eye className="w-3.5 h-3.5" />
                                                                    </Link>
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent className="bg-[#111827] border-[#374151] text-white">View report</TooltipContent>
                                                        </Tooltip>

                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="w-8 h-8 text-[#6B7280] hover:text-red-400 hover:bg-red-500/10"
                                                                    disabled={deletingId === report.id}
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent className="bg-[#111827] border-[#374151] text-white">
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle className="text-white">Delete Report</AlertDialogTitle>
                                                                    <AlertDialogDescription className="text-[#9CA3AF]">
                                                                        This will permanently delete the analysis report. This action cannot be undone.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel className="border-[#374151] text-[#9CA3AF] hover:bg-[#1F2937] hover:text-white bg-transparent">
                                                                        Cancel
                                                                    </AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() => handleDelete(report.id)}
                                                                        className="bg-red-600 hover:bg-red-500 text-white"
                                                                    >
                                                                        Delete
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </TableCell>
                                            </motion.tr>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TooltipProvider>
                        </ScrollArea>
                    </div>
                )}
            </div>
        </PageWrapper>
    );
}
