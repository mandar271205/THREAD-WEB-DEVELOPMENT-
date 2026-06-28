import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const productName = process.env.NEXT_PUBLIC_PRODUCTNAME || "ThreadCounty";
    const testimonials = [
        {
            quote: "ThreadCounty's AI analysis has completely transformed how we inspect fabric. It's fast, accurate, and essential.",
            author: "Sarah Chen",
            role: "Head of QA, LoomTech",
            avatar: "SC"
        },
        {
            quote: "The interface is gorgeous and the insights are deep. We saved hours of manual counting in the first week.",
            author: "Michael Roberts",
            role: "Director of Production, SilkRoad",
            avatar: "MR"
        },
        {
            quote: "Finally, a modern tool for textile analysis. ThreadCounty is years ahead of the competition.",
            author: "Jessica Kim",
            role: "Lead Inspector, WeaveWorks",
            avatar: "JK"
        }
    ];

    return (
        <div className="flex min-h-screen bg-[#0A0F1E]">
            <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
                <Link
                    href="/"
                    className="absolute left-8 top-8 flex items-center text-sm text-[#9CA3AF] hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Homepage
                </Link>

                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 className="text-center text-3xl font-bold tracking-tight text-white mb-2">
                        {productName}
                    </h2>
                    <p className="text-center text-[#9CA3AF] text-sm">Welcome back to the future of textiles.</p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    {children}
                </div>
            </div>

            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-900/40 via-[#0A0F1E] to-purple-900/20 border-l border-[#1F2937] relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
                
                {/* Decorative glowing orbs */}
                <div className="absolute top-1/4 -left-20 w-72 h-72 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="w-full flex items-center justify-center p-12 relative z-10">
                    <div className="space-y-6 max-w-lg">
                        <h3 className="text-white text-2xl font-bold mb-8">
                            Trusted by textile experts worldwide
                        </h3>
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="relative bg-[#111827]/60 backdrop-blur-md rounded-xl p-6 border border-[#374151] shadow-xl hover:border-indigo-500/30 transition-colors"
                            >
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-semibold shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                                            {testimonial.avatar}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-[#D1D5DB] mb-2 font-light leading-relaxed">
                                            &#34;{testimonial.quote}&#34;
                                        </p>
                                        <div className="mt-3">
                                            <p className="text-sm font-medium text-white">
                                                {testimonial.author}
                                            </p>
                                            <p className="text-xs text-indigo-300">
                                                {testimonial.role}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}