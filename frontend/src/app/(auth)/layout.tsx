export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)] px-4 py-12 relative overflow-hidden">
      {/* Decorative background blur elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[var(--color-primary)]/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[var(--color-secondary)]/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="w-full max-w-md relative z-10">{children}</div>
    </div>
  );
}
