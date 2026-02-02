import { NextResponse } from 'next/server';
import { findUserByCPF, listUsers } from '@/lib/google/sheets';

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

        // Busca dependentes se for titular
        let dependentes = [];
        if (!user.isDependente) {
            const allUsers = await listUsers();
            dependentes = allUsers
                .filter(u => u.isDependente && u.titularCpf === cpf)
                .map(({ password, ...dep }) => dep);
        }

        // Gera número de registro se não existir
        const generateRegistro = (cpf: string, tipo: 'titular' | 'dependente') => {
            const prefix = tipo === 'titular' ? 'TIT' : 'DEP';
            const cpfShort = cpf.replace(/\D/g, '').slice(-4);
            const random = Math.random().toString(36).substring(2, 4).toUpperCase();
            return `${prefix}-AURA-G-${cpfShort}${random}`;
        };

        const cardData = {
            nome: user.nome,
            cpf: user.cpf,
            registro: generateRegistro(user.cpf, user.isDependente ? 'dependente' : 'titular'),
            validade: user.dataValidade || '12/2025',
            tipo: user.isDependente ? 'dependente' : 'titular',
            titularNome: user.isDependente ? (await findUserByCPF(user.titularCpf || ''))?.nome || '' : '',
            dependentes: dependentes.map(dep => ({
                nome: dep.nome,
                cpf: dep.cpf,
                registro: generateRegistro(dep.cpf, 'dependente'),
                validade: dep.dataValidade || '12/2025',
            })),
        };

        return NextResponse.json(cardData);
    } catch (error) {
        console.error('Erro ao buscar dados da carteira:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}
