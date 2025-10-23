"use client";

import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const OnboardingSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-gradient-to-br from-slate-900 to-blue-950 relative overflow-hidden">
      {/* Blue glow effect across UI */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-soft-light filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full mix-blend-soft-light filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-slate-700 rounded-full mix-blend-soft-light filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>
      
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="mb-6 relative z-10"
      >
        <CheckCircle className="h-16 w-16 text-blue-400" strokeWidth={1.5} />
      </motion.div>
      
      <h2 className="text-2xl font-semibold mb-4 text-blue-300 relative z-10">
        Onboarding Complete!
      </h2>
      
      <p className="text-blue-100 mb-8 max-w-md relative z-10">
        Your consistency profile is ready. Let's build your personalized plan.
      </p>
      <Link href={'/dashboard'}>
        <button 
          className="success_btn"
          >
          Continue to Dashboard
        </button>
      </Link>
      
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default OnboardingSuccess;