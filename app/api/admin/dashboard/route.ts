import { NextResponse } from 'next/server';
import { listUsers, findUserByCPF } from '@/lib/google/sheets';

export async function GET(request: Request) {
  try {
    // Verifica autenticação
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Token não fornecido' },
        { status: 401 }
      );
    }

    // Decodifica o token e verifica se é admin
    const token = authHeader.replace('Bearer ', '');
    const cpf = Buffer.from(token, 'base64').toString();
    
    const adminUser = await findUserByCPF(cpf);
    if (!adminUser || adminUser.tipo !== 'admin') {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 403 }
      );
    }

    // Lista todos os usuários
    const users = await listUsers();
    
    // Calcula as métricas
    const metrics = {
      ativos: users.filter(user => user.tipo === 'colaborador' && user.status === 'ativo').length,
      inativos: users.filter(user => user.tipo === 'colaborador' && user.status === 'inativo').length,
      desativados: users.filter(user => user.tipo === 'colaborador' && user.status === 'desativado').length,
      
      // Calcula pagamentos pendentes (usuários ativos com data de pagamento vencida)
      pagamentosPendentes: users.filter(user => {
        if (user.tipo !== 'colaborador' || user.status !== 'ativo' || !user.dataPagamento) return false;
        const dataUltimoPagamento = new Date(user.dataPagamento.split('/').reverse().join('-'));
        const umMesAtras = new Date();
        umMesAtras.setMonth(umMesAtras.getMonth() - 1);
        return dataUltimoPagamento < umMesAtras;
      }).map(user => ({
        nome: user.nome,
        cpf: user.cpf,
        dataPagamento: user.dataPagamento
      })),

      // Últimos acessos (mock por enquanto - podemos implementar depois)
      ultimosAcessos: []
    };

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Erro ao buscar métricas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
