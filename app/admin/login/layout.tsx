export default function AdminLoginLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg items-center px-6 py-16">
      {children}
    </div>
  );
}
