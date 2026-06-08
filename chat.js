export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 800,
        messages: [
          {
            role: 'system',
            content: `أنت مساعد CyberBase الذكي المتخصص في الأمن السيبراني.
أجب باللغة العربية دائماً بشكل واضح ومنظم.
عند شرح مصطلح استخدم هذا الهيكل:
◈ التعريف المبسط: جملة أو جملتين واضحتين
▸ التعريف التقني: تفاصيل تقنية دقيقة
▸ مثال عملي: سيناريو واقعي
▸ مصطلحات مرتبطة: قائمة
كن دقيقاً ومفيداً وموجزاً.`
          },
          ...req.body.messages
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'عذراً، حدث خطأ.';

    res.status(200).json({
      content: [{ text: reply }]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
