"use client";
import { createPortal } from "react-dom";
import { AlertCircle } from "lucide-react";

interface ErrorModalProps {
  message: string;
  onClose: () => void;
}

export function ErrorModal({ message, onClose }: ErrorModalProps) {
  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in p-4">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl mx-4 animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center space-y-5">
          <div className="text-red-500 bg-red-50 p-4 rounded-2xl">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Algo salió mal</h3>
          <p className="text-slate-500 text-sm font-medium leading-relaxed">{message}</p>
          <button
            onClick={onClose}
            className="w-full mt-2 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-white bg-slate-900 hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-900/10"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}