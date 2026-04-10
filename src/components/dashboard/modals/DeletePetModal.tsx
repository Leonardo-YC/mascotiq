"use client";
import { createPortal } from "react-dom";
import { AlertTriangle } from "lucide-react";

interface DeletePetModalProps {
  petName: string;
  // Si tiene sub activa, solo mostramos aviso + cancelar (sin portal extra)
  hasActiveSub: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function DeletePetModal({ petName, hasActiveSub, onConfirm, onClose }: DeletePetModalProps) {
  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl mx-4 animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center space-y-4">

          <div className={`p-3 rounded-full ${hasActiveSub ? "bg-amber-100 text-amber-600" : "bg-red-100 text-red-600"}`}>
            <AlertTriangle className="w-7 h-7" />
          </div>

          {hasActiveSub ? (
            // Caso: suscripción activa — solo aviso, sin botón de portal
            <>
              <h3 className="text-lg font-bold text-gray-900">No se puede eliminar</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                <strong className="text-gray-800">{petName}</strong> tiene una suscripción activa.
                Para eliminar este perfil, cancela primero la suscripción desde{" "}
                <strong className="text-gray-800">Gestionar Suscripción</strong> en tu panel.
              </p>
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Entendido
              </button>
            </>
          ) : (
            // Caso normal: confirmar eliminación
            <>
              <h3 className="text-lg font-bold text-gray-900">Eliminar mascota</h3>
              <p className="text-gray-500 text-sm">
                ¿Seguro que deseas eliminar el perfil de{" "}
                <strong className="text-gray-800">{petName}</strong>?
                Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 py-3 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors text-sm"
                >
                  Sí, eliminar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}