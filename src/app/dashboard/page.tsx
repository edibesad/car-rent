"use client";

import { useEffect, useState } from "react";
import { getFromSessionStorage } from "@/helpers/sessionHelper";
import Login from "./components/login";

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const admin = getFromSessionStorage("admin");
    if (admin) {
      setIsLoggedIn(true);
      window.location.href = "/dashboard/content";
    }
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center min-h-screen">
        <Login />
      </div>
    );
  }
}
