import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';

export default async function LandingPage() {
  const { userId } = await auth();
  const tailorUrl = userId ? '/dashboard' : '/sign-up';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-slate-900 py-6 px-8 max-w-7xl mx-auto w-full flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
            ResumeForge
          </span>
        </div>
        <nav className="flex space-x-6 items-center">
          <Link href="/sign-in" className="text-slate-400 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link href="/sign-up" className="bg-blue-600 hover:bg-blue-500 text-white py-2.5 px-5 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20">
            Get Started
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="max-w-4xl mx-auto px-6 py-20 text-center flex-grow flex flex-col justify-center items-center">
        <span className="bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs px-3.5 py-1.5 rounded-full font-medium tracking-wide uppercase mb-6">
          AI-Powered Tailoring
        </span>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
          Tailor Your Resume in <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Under 5 Minutes</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
          ResumeForge reads job descriptions to intelligently align and rewrite your accomplishments, maximizing ATS visibility and matching recruitment patterns instantly.
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href={tailorUrl} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-4 px-8 rounded-xl transition-all duration-300 shadow-xl shadow-blue-500/20 transform hover:-translate-y-0.5">
            Tailor My Resume
          </Link>
          <Link href="/sign-up" className="border border-slate-800 bg-slate-900/50 hover:bg-slate-900 text-slate-300 hover:text-white font-medium py-4 px-8 rounded-xl transition-colors">
            Create Free Account
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 text-center text-sm text-slate-500">
        <p>© {new Date().getFullYear()} ResumeForge. Premium AI Engineering.</p>
      </footer>
    </div>
  );
}
