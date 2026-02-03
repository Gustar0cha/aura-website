# AURA - Associação de Apoio

Website institucional e sistema de gestão de associados da AURA, desenvolvido com Next.js.

## 🚀 Tecnologias

- [Next.js 15](https://nextjs.org/)
- [React 19](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Google Sheets API](https://developers.google.com/sheets/api)

## 📋 Funcionalidades

- **Site Institucional**
  - Página inicial com informações da associação
  - Seções: Sobre Nós, O Que Fazemos, Depoimentos, Contato
  - Área de associados com login seguro

- **Área do Associado**
  - Login com CPF e senha
  - Carteirinha digital do associado
  - Informações pessoais e status

- **Painel Administrativo**
  - Gestão completa de usuários
  - Dashboard com métricas
  - Sistema de dependentes
  - Controle de status e pagamentos

## 🛠️ Instalação

1. Clone o repositório
```bash
git clone [URL_DO_REPOSITÓRIO]
cd aura-website
```

2. Instale as dependências
```bash
pnpm install
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env.local
# Edite .env.local com suas credenciais
```

4. Inicie o servidor de desenvolvimento
```bash
pnpm dev
```

## 📄 Variáveis de Ambiente

```env
GOOGLE_SHEETS_PRIVATE_KEY="sua-chave-privada"
GOOGLE_SHEETS_CLIENT_EMAIL="seu-email"
GOOGLE_SHEETS_SPREADSHEET_ID="id-da-planilha"
```

## 🤝 Contribuindo

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
