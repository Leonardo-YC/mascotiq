import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { CookieBanner } from "@/components/shared/CookieBanner";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <PublicNavbar />
      <main className="flex-grow">
        {children}
      </main>
      <PublicFooter />
      <CookieBanner />
    </div>
  );
}