"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { AUTH_CHANGE_EVENT } from "./auth-session";

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    const handleAuthChange = () => {
      queryClient.clear();
    };

    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange);

    return () =>
      window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}