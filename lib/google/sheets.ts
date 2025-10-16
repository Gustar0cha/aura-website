import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

if (!process.env.GOOGLE_SHEETS_PRIVATE_KEY || !process.env.GOOGLE_SHEETS_CLIENT_EMAIL || !process.env.GOOGLE_SHEETS_SPREADSHEET_ID) {
  throw new Error('Credenciais do Google Sheets não configuradas');
}

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const auth = new JWT({
  email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
  key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
  scopes: SCOPES,
});

const sheets = google.sheets({ version: 'v4', auth });

interface User {
  cpf: string;
  password: string;
  nome?: string;
  telefone?: string;
  email?: string;
  empresa?: string;
  tipo: 'admin' | 'colaborador';
  status?: 'ativo' | 'inativo' | 'desativado';
  dataValidade?: string;
  dataPagamento?: string;
  isDependente?: boolean;
  titularCpf?: string;
}

export async function findUserByCPF(cpf: string): Promise<User | null> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
      range: 'Usuarios!A2:L', // A-L: CPF, Senha, Nome, Telefone, Email, Empresa, Tipo, Status, DataValidade, DataPagamento, IsDependente, TitularCpf
    });

    const rows = response.data.values;
    if (!rows) return null;

    const user = rows.find(row => row[0] === cpf);
    if (!user) return null;

    return {
      cpf: user[0],
      password: user[1],
      nome: user[2],
      telefone: user[3] || '',
      email: user[4] || '',
      empresa: user[5] || '',
      tipo: (user[6] || 'colaborador') as 'admin' | 'colaborador',
      status: (user[7] || 'ativo') as 'ativo' | 'inativo' | 'desativado',
      dataValidade: user[8] || '',
      dataPagamento: user[9] || '',
      isDependente: String(user[10]).toLowerCase() === 'true',
      titularCpf: user[11] || ''
    };
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return null;
  }
}

export async function validateCredentials(cpf: string, password: string): Promise<boolean> {
  const user = await findUserByCPF(cpf);
  if (!user) return false;
  
  // Em produção, você deve usar uma biblioteca de hash como bcrypt
  return user.password === password;
}

export async function listUsers(): Promise<User[]> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
      range: 'Usuarios!A2:L',
    });

    const rows = response.data.values;
    if (!rows) return [];

    return rows.map(row => ({
      cpf: row[0],
      password: row[1],
      nome: row[2],
      telefone: row[3] || '',
      email: row[4] || '',
      empresa: row[5] || '',
      tipo: (row[6] || 'colaborador') as 'admin' | 'colaborador',
      status: (row[7] || 'ativo') as 'ativo' | 'inativo' | 'desativado',
      dataValidade: row[8] || '',
      dataPagamento: row[9] || '',
      isDependente: String(row[10]).toLowerCase() === 'true',
      titularCpf: row[11] || ''
    }));
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return [];
  }
}

export async function createUser(user: Omit<User, 'password'> & { password: string }): Promise<boolean> {
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
      range: 'Usuarios!A2:L',
      valueInputOption: 'RAW',
      requestBody: {
        values: [[
          user.cpf,
          user.password,
          user.nome,
          user.telefone,
          user.email,
          user.empresa,
          user.tipo,
          user.status,
          user.dataValidade,
          user.dataPagamento,
          user.isDependente === true ? 'true' : 'false',
          user.titularCpf || ''
        ]]
      }
    });
    return true;
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return false;
  }
}

export async function updateUser(cpf: string, userData: Partial<User>): Promise<boolean> {
  try {
    const users = await listUsers();
    const userIndex = users.findIndex(u => u.cpf === cpf);
    if (userIndex === -1) return false;

    // Mantém os valores existentes que não foram fornecidos na atualização
    const updatedUser = {
      ...users[userIndex],
      ...userData,
      isDependente: userData.isDependente ?? users[userIndex].isDependente,
      titularCpf: userData.titularCpf ?? users[userIndex].titularCpf
    };
    
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
      range: `Usuarios!A${userIndex + 2}:L${userIndex + 2}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [[
          updatedUser.cpf,
          updatedUser.password,
          updatedUser.nome,
          updatedUser.telefone,
          updatedUser.email,
          updatedUser.empresa,
          updatedUser.tipo,
          updatedUser.status,
          updatedUser.dataValidade,
          updatedUser.dataPagamento,
          updatedUser.isDependente === true ? 'true' : 'false',
          updatedUser.titularCpf || ''
        ]]
      }
    });
    return true;
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return false;
  }
}
