// Modern Card Component with enhanced visuals
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  variant?: "default" | "gradient" | "outlined" | "glass";
  hover?: boolean;
}

export function Card({ 
  children, 
  className, 
  title, 
  subtitle, 
  variant = "default",
  hover = false 
}: CardProps) {
  const variants = {
    default: "bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700",
    gradient: "bg-gradient-to-br from-violet-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 border border-violet-200 dark:border-slate-700",
    outlined: "bg-transparent border-2 border-slate-300 dark:border-slate-600",
    glass: "glass shadow-lg",
  };

  const hoverEffect = hover 
    ? "hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300" 
    : "";

  return (
    <div className={cn(
      "rounded-2xl p-6 transition-all duration-200",
      variants[variant],
      hoverEffect,
      className
    )}>
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
