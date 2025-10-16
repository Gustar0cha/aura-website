import { NextResponse } from 'next/server';
import { findUserByCPF } from '@/lib/google/sheets';

export async function GET(request: Request) {
  try {
    // Pega o token do header de autorização
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Token não fornecido' },
        { status: 401 }
      );
    }

    // Remove o prefixo "Bearer " e decodifica o token
    const token = authHeader.replace('Bearer ', '');
    const cpf = Buffer.from(token, 'base64').toString();

    // Busca o usuário pelo CPF
    const user = await findUserByCPF(cpf);
    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Remove a senha antes de enviar
    const { password, ...userData } = user;

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
