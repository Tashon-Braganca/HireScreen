import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[15%] w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[30%] left-[10%] w-48 h-48 bg-chart-2/5 rounded-full blur-3xl" />
      </div>
      
      {/* Theme Toggle in top right */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md relative z-10">
        {children}
      </div>
    </div>
  );
}
