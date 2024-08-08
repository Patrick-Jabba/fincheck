import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router } from "./Router";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./app/contexts/AuthContext";

const queryclient = new QueryClient();

export function App(){
  return(
    <QueryClientProvider client={queryclient}>
      <AuthProvider>
        <Router/>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  )
}