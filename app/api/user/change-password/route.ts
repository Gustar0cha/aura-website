import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID
const SHEET_NAME = 'Usuarios'

async function getAuth() {
    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })
    return auth
}

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const token = authHeader.split(' ')[1]

        // Decode token to get user CPF
        let userData
        try {
            userData = JSON.parse(Buffer.from(token, 'base64').toString())
        } catch {
            return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
        }

        const { currentPassword, newPassword } = await request.json()

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ error: 'Senha atual e nova senha são obrigatórias' }, { status: 400 })
        }

        if (newPassword.length < 4) {
            return NextResponse.json({ error: 'A nova senha deve ter pelo menos 4 caracteres' }, { status: 400 })
        }

        const auth = await getAuth()
        const sheets = google.sheets({ version: 'v4', auth })

        // Get all users to find current user
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_NAME}!A:H`,
        })

        const rows = response.data.values || []
        if (rows.length === 0) {
            return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
        }

        // Find user row (CPF in column A, Password in column C)
        const userRowIndex = rows.findIndex((row, index) => index > 0 && row[0] === userData.cpf)

        if (userRowIndex === -1) {
            return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
        }

        const userRow = rows[userRowIndex]
        const storedPassword = userRow[2] // Column C is password

        // Verify current password
        if (storedPassword !== currentPassword) {
            return NextResponse.json({ error: 'Senha atual incorreta' }, { status: 400 })
        }

        // Update password in spreadsheet
        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_NAME}!C${userRowIndex + 1}`,
            valueInputOption: 'RAW',
            requestBody: {
                values: [[newPassword]]
            }
        })

        return NextResponse.json({ message: 'Senha alterada com sucesso' })
    } catch (error) {
        console.error('Error changing password:', error)
        return NextResponse.json({ error: 'Erro ao alterar senha' }, { status: 500 })
    }
}
