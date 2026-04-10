import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { CookieBanner } from "@/components/shared/CookieBanner";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <PublicNavbar />
      <div className="flex-grow">
        {children}
      </div>
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-sm font-medium text-slate-400">
        © {new Date().getFullYear()} Mascotiq. Panel de Control Seguro.
      </footer>
      {/* FIX: CookieBanner también en el dashboard */}
      <CookieBanner />
    </div>
  );
}