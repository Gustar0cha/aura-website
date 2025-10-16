"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Users, UserCheck, UserX, AlertCircle } from "lucide-react"

interface DashboardMetrics {
  ativos: number;
  inativos: number;
  desativados: number;
  pagamentosPendentes: Array<{
    nome: string;
    cpf: string;
    dataPagamento: string;
  }>;
  ultimosAcessos: Array<{
    nome: string;
    data: string;
  }>;
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    ativos: 0,
    inativos: 0,
    desativados: 0,
    pagamentosPendentes: [],
    ultimosAcessos: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/admin/dashboard', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('aura_auth')}`
          }
        });

        if (!response.ok) {
          throw new Error('Falha ao carregar métricas');
        }

        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error('Erro ao carregar métricas:', error);
        setError('Erro ao carregar dados do dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Carregando...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 text-red-600">
        <AlertCircle className="w-5 h-5 mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-white">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Parceiros Ativos</p>
              <h3 className="text-2xl font-bold text-gray-900">{metrics.ativos}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Parceiros Inativos</p>
              <h3 className="text-2xl font-bold text-gray-900">{metrics.inativos}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white">
          <div className="flex items-center gap-4">
            <div className="bg-red-100 p-3 rounded-full">
              <UserX className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Parceiros Desativados</p>
              <h3 className="text-2xl font-bold text-gray-900">{metrics.desativados}</h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-white">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Últimos Acessos</h2>
          {metrics.ultimosAcessos.length > 0 ? (
            <div className="space-y-4">
              {metrics.ultimosAcessos.map((acesso, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-gray-900">{acesso.nome}</span>
                  <span className="text-gray-500">{acesso.data}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-600">
              Nenhum acesso registrado
            </div>
          )}
        </Card>

        <Card className="p-6 bg-white">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pagamentos Pendentes</h2>
          {metrics.pagamentosPendentes.length > 0 ? (
            <div className="space-y-4">
              {metrics.pagamentosPendentes.map((pagamento, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-gray-900">{pagamento.nome}</span>
                  <span className="text-red-500">Vencido em {pagamento.dataPagamento}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-600">
              Nenhum pagamento pendente
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
