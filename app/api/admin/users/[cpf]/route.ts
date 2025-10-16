import { NextResponse } from 'next/server';
import { updateUser, findUserByCPF } from '@/lib/google/sheets';

export async function PUT(
  request: Request,
  { params }: { params: { cpf: string } }
) {
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
    const adminCpf = Buffer.from(token, 'base64').toString();
    
    const adminUser = await findUserByCPF(adminCpf);
    if (!adminUser || adminUser.tipo !== 'admin') {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 403 }
      );
    }

    // Atualiza o usuário
    const userData = await request.json();
    console.log('Dados recebidos para atualização:', userData);
    const success = await updateUser(params.cpf, userData);

    if (!success) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
