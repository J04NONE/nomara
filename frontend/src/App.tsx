import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AdminLayout } from '@/layouts/admin-layout'
import { DashboardPage } from '@/pages/dashboard'
import { EmpleadosPage } from '@/pages/empleados'
import { TurnosPage } from '@/pages/turnos'
import { VigenciasPage } from '@/pages/vigencias'
import { LiquidacionesPage } from '@/pages/liquidaciones'
import { XmlFiscalPage } from '@/pages/xml-fiscal'
import { AuditoriaPage } from '@/pages/auditoria'
import { ReportesPage } from '@/pages/reportes'
import { AusentismoPage } from '@/pages/ausentismo'
import { CentrosCostosPage } from '@/pages/centros-costos'
import { PortalColaboradorPage } from '@/pages/portal-colaborador'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="empleados" element={<EmpleadosPage />} />
            <Route path="turnos" element={<TurnosPage />} />
            <Route path="vigencias" element={<VigenciasPage />} />
            <Route path="liquidaciones" element={<LiquidacionesPage />} />
            <Route path="xml-fiscal" element={<XmlFiscalPage />} />
            <Route path="auditoria" element={<AuditoriaPage />} />
            <Route path="reportes" element={<ReportesPage />} />
            <Route path="ausentismo" element={<AusentismoPage />} />
            <Route path="centros-costos" element={<CentrosCostosPage />} />
            <Route path="portal-colaborador" element={<PortalColaboradorPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
