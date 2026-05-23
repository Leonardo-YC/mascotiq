"use client";
import { useState, useMemo } from "react";
import { Search, X, Save, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/actions/order-actions";

const PAGE_SIZE = 10;

export interface AdminOrder {
  id: number;
  status: string;
  trackingNumber: string | null;
  createdAt: Date;
  customerName: string | null;
  customerEmail: string | null;
  planName: string;
}

export function OrderManagerClient({ initialOrders }: { initialOrders: AdminOrder[] }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [trackingModal, setTrackingModal] = useState<{
    isOpen: boolean;
    orderId: number | null;
    trackingNumber: string;
  }>({ isOpen: false, orderId: null, trackingNumber: "" });

  const filteredOrders = useMemo(() =>
    initialOrders.filter(order => {
      const matchesSearch =
        order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "Todos" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    }),
    [initialOrders, searchTerm, statusFilter]
  );

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const paginated = filteredOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilterChange = (newFilter: string) => {
    setStatusFilter(newFilter);
    setPage(1);
  };

  const handleSearch = (v: string) => {
    setSearchTerm(v);
    setPage(1);
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    if (newStatus === "Enviado") {
      setTrackingModal({ isOpen: true, orderId, trackingNumber: "" });
      return;
    }
    setUpdatingId(orderId);
    await updateOrderStatus(orderId, newStatus);
    setUpdatingId(null);
    router.refresh();
  };

  const confirmTracking = async () => {
    if (!trackingModal.orderId) return;
    setUpdatingId(trackingModal.orderId);
    await updateOrderStatus(trackingModal.orderId, "Enviado", trackingModal.trackingNumber || undefined);
    setUpdatingId(null);
    setTrackingModal({ isOpen: false, orderId: null, trackingNumber: "" });
    router.refresh();
  };

  const statusColors: Record<string, string> = {
    Pendiente:        "bg-amber-100 text-amber-700 border-amber-200",
    "En preparación": "bg-blue-100 text-blue-700 border-blue-200",
    Enviado:          "bg-purple-100 text-purple-700 border-purple-200",
    Entregado:        "bg-emerald-100 text-emerald-700 border-emerald-200",
  };

  return (
    <>
      <div className="space-y-4 w-full">
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <div className="bg-white flex-1 p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3 min-w-0">
            <Search className="w-5 h-5 text-slate-400 ml-1 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Buscar por cliente o correo..."
              className="flex-1 bg-transparent border-none focus:outline-none text-slate-700 font-medium text-sm min-w-0 w-full"
            />
          </div>
          <div className="relative shrink-0 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={e => handleFilterChange(e.target.value)}
              className="bg-white w-full sm:w-48 pl-4 pr-10 py-3 rounded-2xl border border-slate-100 shadow-sm text-sm font-bold text-slate-700 focus:outline-none appearance-none cursor-pointer"
            >
              <option value="Todos">Todos los estados</option>
              <option value="Pendiente">Pendientes</option>
              <option value="En preparación">En preparación</option>
              <option value="Enviado">Enviados</option>
              <option value="Entregado">Entregados</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <p className="text-xs text-slate-400 font-medium px-1">
          {filteredOrders.length} pedido{filteredOrders.length !== 1 ? "s" : ""}
        </p>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden w-full flex flex-col">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-400 uppercase tracking-wider font-black">
                  <th className="p-4">Fecha / ID</th>
                  <th className="p-4">Cliente</th>
                  <th className="p-4">Plan</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginated.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-xs font-medium text-slate-500 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" })}
                      <br /><span className="text-slate-400 text-[10px]">#{order.id}</span>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-slate-900 text-sm line-clamp-1">{order.customerName}</p>
                      <p className="text-xs text-slate-500 line-clamp-1">{order.customerEmail}</p>
                    </td>
                    <td className="p-4 font-bold text-slate-700 text-sm whitespace-nowrap">{order.planName}</td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border inline-block ${statusColors[order.status] || "bg-slate-100 text-slate-500 border-slate-200"}`}>
                        {order.status}
                      </span>
                      {order.trackingNumber && (
                        <p className="text-[10px] text-slate-400 mt-1 font-mono">Guía: {order.trackingNumber}</p>
                      )}
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="relative inline-block text-left">
                        <select
                          disabled={updatingId === order.id}
                          value={order.status}
                          onChange={e => handleStatusChange(order.id, e.target.value)}
                          className="appearance-none text-xs font-bold bg-slate-100 text-slate-700 py-2 pl-3 pr-8 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-200 focus:outline-none disabled:opacity-50"
                        >
                          <option value="Pendiente">Pendiente</option>
                          <option value="En preparación">En preparación</option>
                          <option value="Enviado">Enviado</option>
                          <option value="Entregado">Entregado</option>
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                      </div>
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400 text-sm font-medium">
                      No hay pedidos para mostrar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-slate-500 font-medium">
                Página {page} de {totalPages} · {filteredOrders.length} pedidos
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce<(number | "...")[]>((acc, p, i, arr) => {
                    if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, i) =>
                    item === "..." ? (
                      <span key={`d-${i}`} className="text-slate-400 text-sm px-1 font-bold">…</span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => setPage(item as number)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                          page === item
                            ? "bg-slate-900 text-white"
                            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 disabled:opacity-30 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {trackingModal.isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-black text-slate-900">Marcar como Enviado</h3>
              <button
                onClick={() => setTrackingModal({ isOpen: false, orderId: null, trackingNumber: "" })}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full bg-slate-50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-slate-500 text-sm mb-4">Número de guía de envío (opcional).</p>
            <input
              type="text"
              value={trackingModal.trackingNumber}
              onChange={e => setTrackingModal(prev => ({ ...prev, trackingNumber: e.target.value }))}
              placeholder="Ej. PE123456789"
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-emerald-500 focus:outline-none mb-4 transition-colors"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setTrackingModal({ isOpen: false, orderId: null, trackingNumber: "" })}
                className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 text-sm transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmTracking}
                disabled={updatingId !== null}
                className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2 text-sm transition-colors"
              >
                <Save className="w-4 h-4" /> Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}