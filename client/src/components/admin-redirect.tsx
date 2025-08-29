import { useEffect } from "react";

export default function AdminRedirect() {
  useEffect(() => {
    window.location.replace("/admin/dashboard");
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  );
}