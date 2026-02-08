"use client";

export default function DashboardGrid({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 ${className}`}>
      {children}
    </div>
  );
}
