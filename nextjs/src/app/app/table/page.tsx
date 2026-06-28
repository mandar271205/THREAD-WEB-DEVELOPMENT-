"use client";

import React, { useState, useEffect } from 'react';
import { useGlobal } from '@/lib/context/GlobalContext';
import {
    createSPASassClientAuthenticated as createSPASassClient
} from '@/lib/supabase/client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Loader2, Plus, Trash2, AlertCircle, AlertTriangle } from 'lucide-react';
import Confetti from '@/components/Confetti';
import { PageWrapper } from "@/components/layout/PageWrapper";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from 'framer-motion';

import { Database } from '@/lib/types';

type Task = Database['public']['Tables']['todo_list']['Row'];
type NewTask = Database['public']['Tables']['todo_list']['Insert'];

interface CreateTaskDialogProps {
    onTaskCreated: () => Promise<void>;
}

function CreateTaskDialog({ onTaskCreated }: CreateTaskDialogProps) {
    const { user } = useGlobal();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [newTaskTitle, setNewTaskTitle] = useState<string>('');
    const [newTaskDescription, setNewTaskDescription] = useState<string>('');
    const [isUrgent, setIsUrgent] = useState<boolean>(false);

    const handleAddTask = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newTaskTitle.trim() || !user?.id) return;

        try {
            setLoading(true);
            const supabase = await createSPASassClient();
            const newTask: NewTask = {
                title: newTaskTitle.trim(),
                description: newTaskDescription.trim() || null,
                urgent: isUrgent,
                owner: user.id,
                done: false
            };

            const { error: supabaseError } = await supabase.createTask(newTask);
            if (supabaseError) throw supabaseError;

            setNewTaskTitle('');
            setNewTaskDescription('');
            setIsUrgent(false);
            setOpen(false);
            await onTaskCreated();
        } catch (err) {
            setError('Failed to add task');
            console.error('Error adding task:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20">
                    <Plus className="h-4 w-4 mr-2" />
                    New Task
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#111827] border-[#374151] text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl">Create New Task</DialogTitle>
                </DialogHeader>
                {error && (
                    <Alert variant="destructive" className="bg-red-500/10 border-red-500/30 text-red-400">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <form onSubmit={handleAddTask} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[#9CA3AF]">Task Title</label>
                        <Input
                            type="text"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            placeholder="e.g. Calibrate thread counter"
                            required
                            className="bg-[#0A0F1E] border-[#374151] text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-[#6B7280]"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[#9CA3AF]">Description</label>
                        <Textarea
                            value={newTaskDescription}
                            onChange={(e) => setNewTaskDescription(e.target.value)}
                            placeholder="Optional details..."
                            rows={3}
                            className="bg-[#0A0F1E] border-[#374151] text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-[#6B7280] resize-none"
                        />
                    </div>
                    <div className="flex items-center justify-between pt-2">
                        <label className="flex items-center space-x-2 cursor-pointer group">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    checked={isUrgent}
                                    onChange={(e) => setIsUrgent(e.target.checked)}
                                    className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-[#374151] bg-[#0A0F1E] checked:border-indigo-500 checked:bg-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:ring-offset-1 focus:ring-offset-[#111827] transition-all"
                                />
                                <CheckCircle className="absolute left-0 top-0 h-4 w-4 pointer-events-none opacity-0 peer-checked:opacity-100 text-white p-0.5" />
                            </div>
                            <span className="text-sm text-[#9CA3AF] group-hover:text-white transition-colors">Mark as urgent</span>
                        </label>
                        <Button
                            type="submit"
                            disabled={loading || !newTaskTitle.trim()}
                            className="bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Task"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default function TaskManagementPage() {
    const { user } = useGlobal();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [initialLoading, setInitialLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [filter, setFilter] = useState<boolean | null>(null);
    const [showConfetti, setShowConfetti] = useState<boolean>(false);

    useEffect(() => {
        if (user?.id) {
            loadTasks();
        }
    }, [filter, user?.id]);

    const loadTasks = async (): Promise<void> => {
        try {
            const isFirstLoad = initialLoading;
            if (!isFirstLoad) setLoading(true);

            const supabase = await createSPASassClient();
            const { data, error: supabaseError } = await supabase.getMyTodoList(1, 100, 'created_at', filter);

            if (supabaseError) throw supabaseError;
            setTasks(data || []);
        } catch (err) {
            setError('Failed to load tasks');
            console.error('Error loading tasks:', err);
        } finally {
            setLoading(false);
            setInitialLoading(false);
        }
    };

    const handleRemoveTask = async (id: number): Promise<void> => {
        try {
            const supabase = await createSPASassClient();
            const { error: supabaseError } = await supabase.removeTask(id);
            if (supabaseError) throw supabaseError;
            setTasks(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            setError('Failed to remove task');
            console.error('Error removing task:', err);
        }
    };

    const handleMarkAsDone = async (id: number): Promise<void> => {
        try {
            const supabase = await createSPASassClient();
            const { error: supabaseError } = await supabase.updateAsDone(id);
            if (supabaseError) throw supabaseError;
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 2000);
            
            // Optimistic update
            setTasks(prev => prev.map(t => t.id === id ? { ...t, done: true, done_at: new Date().toISOString() } : t));
        } catch (err) {
            setError('Failed to update task');
            console.error('Error updating task:', err);
        }
    };

    if (initialLoading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <PageWrapper className="pb-20 lg:pb-0">
            <div className="space-y-6 max-w-5xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-white">Admin Tasks</h1>
                        <p className="text-[#9CA3AF] mt-1 text-sm">
                            Manage laboratory tasks, calibration schedules, and team to-dos.
                        </p>
                    </div>
                    <CreateTaskDialog onTaskCreated={loadTasks} />
                </div>

                <div className="bg-[#111827] border border-[#374151] rounded-xl overflow-hidden shadow-sm">
                    <div className="p-6">
                        {error && (
                            <Alert variant="destructive" className="mb-6 bg-red-500/10 border-red-500/30 text-red-400">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {/* Filters */}
                        <div className="mb-6 flex flex-wrap gap-2">
                            <Button
                                variant={filter === null ? "default" : "outline"}
                                onClick={() => setFilter(null)}
                                size="sm"
                                className={filter === null 
                                    ? "bg-indigo-600 text-white hover:bg-indigo-500 border-indigo-600" 
                                    : "border-[#374151] text-[#9CA3AF] hover:text-white hover:bg-[#1F2937]"
                                }
                            >
                                All Tasks
                            </Button>
                            <Button
                                variant={filter === false ? "default" : "outline"}
                                onClick={() => setFilter(false)}
                                size="sm"
                                className={filter === false 
                                    ? "bg-indigo-600 text-white hover:bg-indigo-500 border-indigo-600" 
                                    : "border-[#374151] text-[#9CA3AF] hover:text-white hover:bg-[#1F2937]"
                                }
                            >
                                Active
                            </Button>
                            <Button
                                variant={filter === true ? "default" : "outline"}
                                onClick={() => setFilter(true)}
                                size="sm"
                                className={filter === true 
                                    ? "bg-indigo-600 text-white hover:bg-indigo-500 border-indigo-600" 
                                    : "border-[#374151] text-[#9CA3AF] hover:text-white hover:bg-[#1F2937]"
                                }
                            >
                                Completed
                            </Button>
                        </div>

                        {/* Task List */}
                        <div className="space-y-3 relative min-h-[200px]">
                            {loading && (
                                <div className="absolute inset-0 bg-[#111827]/50 flex items-center justify-center backdrop-blur-sm z-10 rounded-lg">
                                    <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                                </div>
                            )}

                            {tasks.length === 0 && !loading ? (
                                <div className="text-center py-12 border-2 border-dashed border-[#374151] rounded-xl bg-[#0A0F1E]">
                                    <div className="w-12 h-12 rounded-full bg-[#1F2937] flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="h-6 w-6 text-[#6B7280]" />
                                    </div>
                                    <p className="text-white font-medium text-lg">No tasks found</p>
                                    <p className="text-[#9CA3AF] text-sm mt-1">You're all caught up!</p>
                                </div>
                            ) : (
                                <AnimatePresence>
                                    {tasks.map((task, i) => (
                                        <motion.div
                                            key={task.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ delay: Math.min(i * 0.05, 0.3) }}
                                            className={cn(
                                                "p-4 rounded-xl transition-all flex items-start justify-between gap-4 border",
                                                task.done 
                                                    ? "bg-[#0A0F1E]/50 border-[#1F2937] opacity-60" 
                                                    : task.urgent 
                                                        ? "bg-[#111827] border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.05)]" 
                                                        : "bg-[#111827] border-[#374151] hover:border-indigo-500/30 card-lift"
                                            )}
                                        >
                                            <div className="flex-1 min-w-0 pt-0.5">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className={cn(
                                                        "font-medium text-base truncate",
                                                        task.done ? "line-through text-[#6B7280]" : "text-white"
                                                    )}>
                                                        {task.title}
                                                    </h3>
                                                    {task.urgent && !task.done && (
                                                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20 rounded-full flex-shrink-0">
                                                            Urgent
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                {task.description && (
                                                    <p className={cn(
                                                        "text-sm mb-3",
                                                        task.done ? "text-[#4B5563]" : "text-[#9CA3AF]"
                                                    )}>
                                                        {task.description}
                                                    </p>
                                                )}
                                                
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-xs text-[#6B7280] font-mono-data">
                                                        {task.done && task.done_at ? (
                                                            <>Completed: {new Date(task.done_at).toLocaleDateString()}</>
                                                        ) : (
                                                            <>Added: {new Date(task.created_at).toLocaleDateString()}</>
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1.5 flex-shrink-0">
                                                {!task.done && (
                                                    <Button
                                                        onClick={() => handleMarkAsDone(task.id)}
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-[#9CA3AF] hover:text-green-400 hover:bg-green-500/10 h-9 w-9 rounded-lg"
                                                        title="Mark as done"
                                                    >
                                                        <CheckCircle className="h-5 w-5" />
                                                    </Button>
                                                )}
                                                <Button
                                                    onClick={() => handleRemoveTask(task.id)}
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-[#6B7280] hover:text-red-400 hover:bg-red-500/10 h-9 w-9 rounded-lg"
                                                    title="Delete task"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Confetti active={showConfetti} />
        </PageWrapper>
    );
}