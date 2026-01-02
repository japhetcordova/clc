import AdminAuthGate from "./auth-gate";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminAuthGate>
            {children}
        </AdminAuthGate>
    );
}
