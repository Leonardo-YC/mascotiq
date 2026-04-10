"use client";

import { useState } from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import Image from "next/image";
import { X, AlertCircle } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  isProduct?: boolean; // <-- NUEVA PROP: Define si es un producto o un perfil
}

export function ImageUpload({ value, onChange, isProduct = false }: ImageUploadProps) {
  const [errorModal, setErrorModal] = useState<{ isOpen: boolean; message: string }>({ isOpen: false, message: "" });

  // Si ya hay una imagen subida, mostramos la previsualización
  if (value) {
    return (
      <div className={`relative mx-auto overflow-hidden shadow-lg border-2 border-emerald-500 bg-slate-50
        ${isProduct ? 'w-full h-48 rounded-2xl' : 'w-40 h-40 rounded-full border-4'}
      `}>
        <Image fill src={value} alt="Preview" className="object-cover" />
        <button
          onClick={() => onChange("")}
          className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full shadow-md hover:bg-red-700 transition-transform hover:scale-110 z-10"
          type="button"
          title="Eliminar imagen"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Si no hay imagen, mostramos Uploadthing
  return (
    <>
      <div className="w-full">
        <UploadDropzone
          endpoint="petImage"
          onClientUploadComplete={(res) => {
            if (res && res.length > 0) {
              onChange(res[0].url);
            }
          }}
          onUploadError={(error: Error) => {
            console.error("Error al subir:", error.message);
            setErrorModal({ isOpen: true, message: "Hubo un error al subir la foto. Asegúrate de que pese menos de 4MB e inténtalo de nuevo." });
          }}
          appearance={{
            button: "bg-emerald-600 text-white font-bold hover:bg-emerald-700 after:bg-emerald-500",
            label: "text-emerald-600 hover:text-emerald-700 font-medium",
            container: "border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 transition-colors rounded-2xl p-6 w-full"
          }}
        />
      </div>

      {/* MODAL DE ERROR PROFESIONAL */}
      {errorModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="text-red-500 bg-red-50 p-3 rounded-full">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Problema con la foto</h3>
              <p className="text-slate-500 text-sm">{errorModal.message}</p>
              <button 
                onClick={() => setErrorModal({ isOpen: false, message: "" })}
                className="w-full mt-4 py-3 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-md"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}