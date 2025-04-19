"use client";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { DashboardNavbar } from "./components/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const admin = sessionStorage.getItem("admin");
    if (!admin) {
      redirect("/dashboard");
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <div>
      <DashboardNavbar />
      {children}
    </div>
  );
}
