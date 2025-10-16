import { NextResponse } from 'next/server';
import { validateCredentials } from '@/lib/google/sheets';

export async function POST(request: Request) {
  try {
    const { cpf, password } = await request.json();

    if (!cpf || !password) {
      return NextResponse.json(
        { error: 'CPF e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Remove formatação do CPF antes de validar
    const cpfNumerico = cpf.replace(/\D/g, '');
    const isValid = await validateCredentials(cpfNumerico, password);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    // Em produção, você deve usar um sistema de tokens mais seguro
    return NextResponse.json({
      success: true,
      token: Buffer.from(cpfNumerico).toString('base64'),
    });

  } catch (error) {
    console.error('Erro na autenticação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
