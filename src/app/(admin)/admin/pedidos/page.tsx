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
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      
      {/* 🚀 Cabecera */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Logística y Pedidos</h1>
        <p className="text-slate-500 mt-2 font-medium">
          Controla el estado de los envíos mensuales de todas las suscripciones activas.
        </p>
      </div>

      {/* 📈 Tarjetas de Métricas de Envíos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5">
          <div className="bg-amber-50 p-4 rounded-xl">
            <Clock className="w-7 h-7 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Pendientes</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{pendingOrders}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5">
          <div className="bg-blue-50 p-4 rounded-xl">
            <Truck className="w-7 h-7 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Histórico</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{totalOrders}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5">
          <div className="bg-emerald-50 p-4 rounded-xl">
            <PackageCheck className="w-7 h-7 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Completados</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{completedOrders}</h3>
          </div>
        </div>
      </div>

      {/* 🧩 Componente Interactivo (Client Component) */}
      <OrderManagerClient initialOrders={ordersData} />

    </div>
  );
}