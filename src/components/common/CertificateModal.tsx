import React from 'react';
import { Award, CheckCircle2, Download, Printer, Sparkles, X } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  learnerName: string;
  tutorName: string;
  skillName: string;
  sessionsCompleted: number;
  issueDate?: string;
  certificateId?: string;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  learnerName,
  tutorName,
  skillName,
  sessionsCompleted,
  issueDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  certificateId = `SKSPH-${Math.floor(100000 + Math.random() * 900000)}`,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-3xl rounded-3xl bg-white dark:bg-[#101828] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <span className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Verified Peer Learning Credential
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* The Printable Certificate Container */}
        <div
          id="certificate-print-area"
          className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-amber-50/80 via-white to-blue-50/40 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 border-8 border-double border-amber-400/50 shadow-2xl text-center space-y-6 overflow-hidden"
        >
          {/* Subtle watermark background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
            <Award className="w-96 h-96" />
          </div>

          {/* Certificate Header */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#5865F2] to-[#8B5CF6] text-white text-[11px] font-bold uppercase tracking-widest shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              SkillSphere Global Network
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mt-3">
              Certificate of Peer Learning
            </h2>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
              Reciprocal Knowledge Exchange Credential
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-slate-500 italic">This is proudly presented to</p>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-[#5865F2] dark:text-[#818CF8] tracking-tight font-serif">
              {learnerName}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed pt-2">
              for successfully completing <span className="font-bold text-slate-900 dark:text-white">{sessionsCompleted} live peer collaborative sessions</span> and demonstrating practical mastery in:
            </p>
            <div className="inline-block px-5 py-2 rounded-2xl bg-amber-400/15 border border-amber-400/30 text-amber-700 dark:text-amber-300 font-extrabold text-lg sm:text-xl shadow-xs mt-2">
              {skillName}
            </div>
          </div>

          {/* Signatures & Seal Row */}
          <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end border-t border-slate-200/80 dark:border-slate-800 text-xs">
            {/* Tutor Signature */}
            <div className="space-y-1 text-center sm:text-left">
              <div className="font-serif italic text-lg font-bold text-slate-800 dark:text-slate-200">
                {tutorName}
              </div>
              <div className="h-0.5 bg-slate-300 dark:bg-slate-700 w-36 mx-auto sm:mx-0"></div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Endorsing Peer Tutor
              </p>
            </div>

            {/* Golden Seal Badge */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/25 ring-4 ring-amber-300/40">
                <Award className="w-8 h-8" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 mt-2">
                VERIFIED CREDENTIAL
              </span>
            </div>

            {/* Date & ID */}
            <div className="space-y-1 text-center sm:text-right">
              <div className="font-bold text-slate-800 dark:text-slate-200">
                {issueDate}
              </div>
              <div className="h-0.5 bg-slate-300 dark:bg-slate-700 w-36 mx-auto sm:ml-auto sm:mr-0"></div>
              <p className="text-[10px] text-slate-400 font-mono">
                ID: {certificateId}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Action Controls */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Cryptographically signed & endorsed by peer
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#5865F2] to-[#8B5CF6] text-white text-xs font-bold shadow-md hover:opacity-95 flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

