const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const WEBHOOK_URL = 'https://back.onlyflow.com.br/api/workflows/webhook/webhookTrigger-1775671025479';
const REDIRECT_URL = 'https://pay.kiwify.com.br/aLMPkNy';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Envia nome e whatsapp para o webhook OnlyFlow; em seguida o cliente redireciona */
app.post('/api/lead', async function (req, res) {
  const nome = (req.body.nome || (req.body && req.body.nome) || '').trim();
  const whatsapp = (req.body.whatsapp || (req.body && req.body.whatsapp) || '').trim();

  if (!nome || !whatsapp) {
    return res.status(400).json({
      ok: false,
      message: 'Nome e WhatsApp são obrigatórios.',
    });
  }

  try {
    const payload = { nome, whatsapp };
    const webhookRes = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!webhookRes.ok) {
      const text = await webhookRes.text();
      console.error('Webhook error:', webhookRes.status, text);
      return res.status(502).json({
        ok: false,
        message: 'Falha ao enviar dados. Tente novamente.',
      });
    }

    res.json({
      ok: true,
      redirect: REDIRECT_URL,
    });
  } catch (err) {
    console.error('Lead API error:', err);
    res.status(500).json({
      ok: false,
      message: 'Erro interno. Tente novamente.',
    });
  }
});

app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/img', express.static(path.join(__dirname, 'img')));
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, function () {
  console.log('Servidor rodando em http://localhost:' + PORT);
});
