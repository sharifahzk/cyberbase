export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 800,
        system: `أنت مساعد CyberBase الذكي المتخصص في الأمن السيبراني.
أجب باللغة العربية دائماً بشكل واضح ومنظم.
عند شرح مصطلح استخدم هذا الهيكل:
◈ التعريف المبسط: جملة أو جملتين واضحتين
▸ التعريف التقني: تفاصيل تقنية دقيقة
▸ مثال عملي: سيناريو واقعي
▸ مصطلحات مرتبطة: قائمة
كن دقيقاً ومفيداً وموجزاً.`,
        messages: req.body.messages
      })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
