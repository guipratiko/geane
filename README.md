# Landing Page – Geane Costa

Landing em Node.js (Express) com popup de lead antes do checkout.

## Como rodar

```bash
npm install
npm start
```

Acesse: **http://localhost:3000**

Para usar outra porta: `PORT=8080 npm start`

## Fluxo

1. Usuário clica em **"👉 GARANTA SUA VAGA"**.
2. Abre um popup com formulário (Nome e WhatsApp).
3. Ao enviar, os dados são enviados para o webhook OnlyFlow.
4. Após sucesso, o usuário é redirecionado para a página de checkout (Kiwify).

## Endpoints

- `GET /` – Página principal
- `POST /api/lead` – Recebe `{ nome, whatsapp }`, encaminha ao webhook e retorna `{ ok, redirect? }`
