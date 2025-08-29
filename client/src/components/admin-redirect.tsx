import { useEffect } from "react";
import { useLocation } from "wouter";

export default function AdminRedirect() {
  const [, navigate] = useLocation();
  
  useEffect(() => {
    navigate("/admin/dashboard");
  }, [navigate]);

  return null;
}