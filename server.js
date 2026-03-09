const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const ONLYFLOW_WEBHOOK = 'https://back.onlyflow.com.br/api/workflows/webhook/webhookTrigger-1773070136319';

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/api/webhook-proxy', async (req, res) => {
  const { name, whatsapp } = req.body || {};
  if (!name || !whatsapp) {
    return res.status(400).json({ error: 'name e whatsapp são obrigatórios' });
  }
  try {
    const onlyRes = await fetch(ONLYFLOW_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, whatsapp })
    });
    if (!onlyRes.ok) {
      const text = await onlyRes.text();
      console.error('OnlyFlow error', onlyRes.status, text);
      return res.status(502).json({ error: 'Falha no envio para o webhook' });
    }
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Proxy error', err);
    res.status(502).json({ error: 'Falha no envio' });
  }
});

app.listen(PORT, () => {
  console.log('Servidor rodando na porta', PORT);
});
