// Configuração para resolver o problema do OpenSSL
process.env.NODE_OPTIONS = '--openssl-legacy-provider';

// Executa o Next.js
require('next/dist/bin/next');
