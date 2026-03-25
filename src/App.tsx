import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import AdminLayout from "./layouts/AdminLayout";
import Inicio from "./pages/Inicio";
import Carteira from "./pages/Carteira";
import Vendas from "./pages/Vendas";
import Clientes from "./pages/Clientes";
import Taxas from "./pages/Taxas";
import Integracoes from "./pages/Integracoes";
import UtmiFy from "./pages/UtmiFy";
import Links from "./pages/Links";
import Configuracoes from "./pages/Configuracoes";
import ConfiguracoesPagamento from "./pages/ConfiguracoesPagamento";
import PixCheckout from "./pages/PixCheckout";
import Empresa from "./pages/Empresa";
import Documentacao from "./pages/Documentacao";
import Auth from "./pages/Auth";
import LandingPage from "./pages/LandingPage";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

import AdminOverviewPage from "./pages/admin/AdminOverviewPage";
import AdminProvidersPage from "./pages/admin/AdminProvidersPage";
import AdminMerchantsPage from "./pages/admin/AdminMerchantsPage";
import AdminTransactionsPage from "./pages/admin/AdminTransactionsPage";
import AdminRiskPage from "./pages/admin/AdminRiskPage";
import AdminDisputesPage from "./pages/admin/AdminDisputesPage";
import AdminSettlementsPage from "./pages/admin/AdminSettlementsPage";
import AdminWithdrawalsPage from "./pages/admin/AdminWithdrawalsPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminFeesPage from "./pages/admin/AdminFeesPage";
import AdminSystemPage from "./pages/admin/AdminSystemPage";
import AdminAuditPage from "./pages/admin/AdminAuditPage";
import AdminDocsPage from "./pages/admin/AdminDocsPage";
import ConfiguracoesPagamentoAdmin from "./pages/ConfiguracoesPagamento";
import ClientDocsPage from "./pages/ClientDocsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Inicio />} />
              <Route path="/carteira" element={<Carteira />} />
              <Route path="/vendas" element={<Vendas />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/taxas" element={<Taxas />} />
              <Route path="/integracoes" element={<Integracoes />} />
              <Route path="/apps/utmify" element={<UtmiFy />} />
              <Route path="/links" element={<Links />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
              <Route path="/configuracoes-pagamento" element={<ConfiguracoesPagamento />} />
              <Route path="/pix" element={<PixCheckout />} />
              <Route path="/empresa" element={<Empresa />} />
            </Route>
            {/* Docs as standalone protected pages */}
            <Route path="/dashboard/docs" element={<ProtectedRoute><ClientDocsPage /></ProtectedRoute>} />
            <Route path="/admin/docs" element={<ProtectedRoute><AdminDocsPage /></ProtectedRoute>} />
            {/* Admin standalone layout */}
            <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route path="/admin" element={<AdminOverviewPage />} />
              <Route path="/admin/provedores" element={<AdminProvidersPage />} />
              <Route path="/admin/merchants" element={<AdminMerchantsPage />} />
              <Route path="/admin/transacoes" element={<AdminTransactionsPage />} />
              <Route path="/admin/risco" element={<AdminRiskPage />} />
              <Route path="/admin/disputas" element={<AdminDisputesPage />} />
              <Route path="/admin/liquidacoes" element={<AdminSettlementsPage />} />
              <Route path="/admin/saques" element={<AdminWithdrawalsPage />} />
              <Route path="/admin/usuarios" element={<AdminUsersPage />} />
              <Route path="/admin/taxas" element={<AdminFeesPage />} />
              <Route path="/admin/sistema" element={<AdminSystemPage />} />
              <Route path="/admin/pagamentos" element={<ConfiguracoesPagamentoAdmin />} />
              <Route path="/admin/auditoria" element={<AdminAuditPage />} />
            </Route>
            <Route path="/documentacao" element={<Documentacao />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
