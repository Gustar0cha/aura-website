import { NextResponse } from 'next/server';
import { listUsers, createUser, findUserByCPF } from '@/lib/google/sheets';

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
    
    // Remove as senhas antes de enviar
    const safeUsers = users.map(({ password, ...user }) => user);

    return NextResponse.json(safeUsers);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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

    // Cria o novo usuário
    const userData = await request.json();
    
    // Verifica se o CPF já existe
    const existingUser = await findUserByCPF(userData.cpf);
    if (existingUser) {
      return NextResponse.json(
        { error: 'CPF já cadastrado' },
        { status: 400 }
      );
    }

    const success = await createUser(userData);
    if (!success) {
      throw new Error('Falha ao criar usuário');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
