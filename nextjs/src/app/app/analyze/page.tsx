"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useGlobal } from "@/lib/context/GlobalContext";
import { createSPASassClientAuthenticated } from "@/lib/supabase/client";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, X, CheckCircle2, FileImage, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function formatBytes(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export default function AnalyzePage() {
    const { user } = useGlobal();
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [progress, setProgress] = useState(0);

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
        if (rejectedFiles.length > 0) {
            const error = rejectedFiles[0].errors[0];
            if (error.code === "file-too-large") {
                toast.error("File exceeds 10MB. Please compress and retry.");
            } else if (error.code === "file-invalid-type") {
                toast.error("Only JPG, JPEG, PNG files accepted.");
            } else {
                toast.error("Invalid file. Please try again.");
            }
            return;
        }
        if (acceptedFiles.length > 0) {
            const f = acceptedFiles[0];
            setFile(f);
            const reader = new FileReader();
            reader.onload = (e) => setPreview(e.target?.result as string);
            reader.readAsDataURL(f);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] },
        maxSize: 10 * 1024 * 1024,
        maxFiles: 1,
        disabled: isAnalyzing,
    });

    const handleAnalyze = async () => {
        if (!file || !user?.id) return;

        setIsAnalyzing(true);
        setProgress(10);

        try {
            const supabase = await createSPASassClientAuthenticated();
            setProgress(20);

            const filename = `fabric_${Date.now()}_${file.name}`;
            const { error: uploadError } = await supabase.uploadFile(user.id, filename, file);
            if (uploadError) throw uploadError;
            setProgress(50);

            const supabaseClient = supabase.getSupabaseClient();
            const filepath = `${user.id}/${filename.replace(/[^0-9a-zA-Z!\-_.*'()]/g, "_")}`;
            const { data: urlData } = supabaseClient.storage.from("files").getPublicUrl(filepath);
            const imageUrl = urlData.publicUrl;

            const { data: uploadRecord, error: dbError } = await supabaseClient
                .from("uploads")
                .insert({ user_id: user.id, image_url: imageUrl, filename: file.name, status: "processing" })
                .select()
                .single();
            if (dbError) throw dbError;
            setProgress(65);

            const session = await supabaseClient.auth.getSession();
            const token = session.data.session?.access_token;
            if (!token) throw new Error("Not authenticated");

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const response = await fetch(`${apiUrl}/analyze/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ upload_id: uploadRecord.id, image_url: imageUrl }),
            });

            if (!response.ok) throw new Error("Analysis failed. Please try again.");
            setProgress(95);

            const result = await response.json();
            setProgress(100);
            toast.success("Analysis complete! Redirecting...");

            setTimeout(() => router.push(`/app/reports/${result.report_id}`), 600);
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Upload failed. Check your connection and try again.");
            setIsAnalyzing(false);
            setProgress(0);
        }
    };

    const removeFile = () => {
        setFile(null);
        setPreview(null);
        setProgress(0);
    };

    return (
        <PageWrapper className="pb-20 lg:pb-0">
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-white">Analyse Fabric</h1>
                    <p className="text-[#9CA3AF] mt-1 text-sm">
                        Upload a clear, well-lit macro photo of your fabric for thread density and weave classification.
                    </p>
                </div>

                {/* Dropzone */}
                <div
                    {...getRootProps()}
                    className={cn(
                        "border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer select-none",
                        isDragActive
                            ? "border-indigo-500 bg-indigo-500/5 dropzone-active"
                            : file
                            ? "border-green-500/50 bg-green-500/5 cursor-default"
                            : "border-[#374151] hover:border-indigo-500/50 hover:bg-[#111827]",
                        isAnalyzing && "pointer-events-none opacity-70"
                    )}
                >
                    <input {...getInputProps()} />

                    <motion.div
                        key={file ? "file" : isDragActive ? "drag" : "idle"}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col items-center"
                    >
                        {file ? (
                            <>
                                <CheckCircle2 className="w-12 h-12 text-green-400 mb-4" />
                                <p className="text-white font-medium">File selected!</p>
                                <p className="text-[#9CA3AF] text-sm mt-1">Click to replace or remove below</p>
                            </>
                        ) : isDragActive ? (
                            <>
                                <UploadCloud className="w-12 h-12 text-indigo-400 mb-4" />
                                <p className="text-indigo-300 font-semibold text-lg">Drop it here!</p>
                            </>
                        ) : (
                            <>
                                <UploadCloud className="w-12 h-12 text-[#374151] mb-4" />
                                <p className="text-white font-medium text-lg">
                                    Drag & drop your fabric image
                                </p>
                                <p className="text-[#9CA3AF] text-sm mt-2">
                                    or <span className="text-indigo-400 font-medium">click to browse</span>
                                </p>
                                <p className="text-xs text-[#6B7280] mt-4">
                                    JPG, JPEG, PNG up to 10MB · Macro photo recommended
                                </p>
                            </>
                        )}
                    </motion.div>
                </div>

                {/* File Preview Card */}
                <AnimatePresence>
                    {file && preview && (
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            className="bg-[#111827] border border-[#374151] rounded-xl p-4 flex items-center gap-4"
                        >
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-20 h-20 rounded-lg object-cover flex-shrink-0 border border-[#374151]"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-white text-sm truncate">{file.name}</p>
                                <p className="text-xs text-[#9CA3AF] mt-0.5">{formatBytes(file.size)}</p>
                                <div className="flex items-center gap-1.5 mt-1.5">
                                    <FileImage className="w-3 h-3 text-indigo-400" />
                                    <span className="text-xs text-indigo-400 uppercase">{file.type.split("/")[1]}</span>
                                </div>
                            </div>
                            {!isAnalyzing && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); removeFile(); }}
                                    className="p-1.5 rounded-lg bg-[#1F2937] hover:bg-red-500/20 text-[#6B7280] hover:text-red-400 transition-all flex-shrink-0"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Progress Bar */}
                <AnimatePresence>
                    {isAnalyzing && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="space-y-2"
                        >
                            <div className="flex justify-between text-xs text-[#9CA3AF]">
                                <span>
                                    {progress < 50
                                        ? "Uploading image..."
                                        : progress < 80
                                        ? "Running AI analysis..."
                                        : "Generating report..."}
                                </span>
                                <span className="font-mono-data text-indigo-400 font-medium">{progress}%</span>
                            </div>
                            <Progress
                                value={progress}
                                className="h-2 bg-[#1F2937] rounded-full [&>div]:bg-indigo-500 [&>div]:rounded-full [&>div]:transition-all [&>div]:duration-500"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.div whileTap={file && !isAnalyzing ? { scale: 0.97 } : {}}>
                    <Button
                        onClick={handleAnalyze}
                        disabled={!file || isAnalyzing}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white h-12 text-base font-semibold rounded-xl shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Analysing...
                            </>
                        ) : (
                            <>
                                <UploadCloud className="w-4 h-4 mr-2" />
                                Start Analysis
                            </>
                        )}
                    </Button>
                </motion.div>

                {/* Tips */}
                {!file && (
                    <div className="bg-[#111827] border border-[#374151] rounded-xl p-4 space-y-2">
                        <p className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">Tips for best results</p>
                        {[
                            "Use a macro lens or camera close-up mode",
                            "Ensure uniform, diffused lighting — avoid flash",
                            "Keep the fabric flat and wrinkle-free",
                            "Capture at least 1cm × 1cm of the weave",
                        ].map((tip, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-[#6B7280]">
                                <span className="text-indigo-500 mt-0.5">•</span>
                                {tip}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </PageWrapper>
    );
}
