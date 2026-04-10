"use client";
import { createPortal } from "react-dom";
import { AlertCircle } from "lucide-react";

interface ErrorModalProps {
  message: string;
  onClose: () => void;
}

export function ErrorModal({ message, onClose }: ErrorModalProps) {
  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl mx-4 animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="text-red-600 bg-red-50 p-3 rounded-full">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Algo salió mal</h3>
          <p className="text-gray-500 text-sm leading-relaxed">{message}</p>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}