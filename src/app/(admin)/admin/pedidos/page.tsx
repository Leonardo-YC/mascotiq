import { getOrders } from "@/actions/order-actions";
import { Truck, Clock, PackageCheck } from "lucide-react";
import { OrderManagerClient } from "@/components/admin/OrderManagerClient";

export default async function PedidosManagerPage() {
  // 1. Extraemos los pedidos usando nuestra Server Action
  const response = await getOrders();
  const ordersData = response.success && response.data ? response.data : [];

  // 2. Calculamos métricas rápidas para las tarjetas
  const totalOrders = ordersData.length;
  const pendingOrders = ordersData.filter(o => o.status === 'Pendiente').length;
  const completedOrders = ordersData.filter(o => o.status === 'Entregado' || o.status === 'Enviado').length;

  return (
    // 📱 Responsivo: Reducimos espacio vertical en móviles
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 font-sans pb-8">
      
      {/* 🚀 Cabecera */}
      <div className="px-1 md:px-0">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Logística y Pedidos</h1>
        <p className="text-slate-500 mt-2 font-medium text-sm sm:text-base">
          Controla el estado de los envíos mensuales de todas las suscripciones activas.
        </p>
      </div>

      {/* 📈 Tarjetas de Métricas de Envíos */}
      {/* 📱 Responsivo: 1 columna en móvil, 2 en tablet (sm), 3 en PC (lg) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-row items-center gap-4 sm:gap-5 min-w-0">
          <div className="bg-amber-50 p-3 sm:p-4 rounded-xl shrink-0">
            <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-amber-600" />
          </div>
          <div className="flex-1">
            {/* FIX: Eliminado 'truncate' para permitir que el texto salte de línea si es necesario */}
            <p className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider leading-tight">Pendientes</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5 sm:mt-1">{pendingOrders}</h3>
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-row items-center gap-4 sm:gap-5 min-w-0">
          <div className="bg-blue-50 p-3 sm:p-4 rounded-xl shrink-0">
            <Truck className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
          </div>
          <div className="flex-1">
             {/* FIX: Eliminado 'truncate' */}
            <p className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider leading-tight">Total Histórico</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5 sm:mt-1">{totalOrders}</h3>
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-row items-center gap-4 sm:gap-5 min-w-0 sm:col-span-2 lg:col-span-1">
          <div className="bg-emerald-50 p-3 sm:p-4 rounded-xl shrink-0">
            <PackageCheck className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600" />
          </div>
          <div className="flex-1">
             {/* FIX: Eliminado 'truncate' */}
            <p className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider leading-tight">Completados</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5 sm:mt-1">{completedOrders}</h3>
          </div>
        </div>
      </div>

      {/* 🧩 Componente Interactivo (Client Component) */}
      <OrderManagerClient initialOrders={ordersData} />

    </div>
  );
}