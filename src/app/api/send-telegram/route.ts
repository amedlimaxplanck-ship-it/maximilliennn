import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

// Cold start'ta bu Map sıfırlanacaktır. Sunucusuz ortamlarda her instance'ın kendi Map'i olur.
const rateLimit = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 60 seconds
  const maxRequests = 3;

  let timestamps = rateLimit.get(ip) || [];
  timestamps = timestamps.filter(t => now - t < windowMs);
  
  if (timestamps.length >= maxRequests) {
    return false;
  }
  
  timestamps.push(now);
  rateLimit.set(ip, timestamps);
  return true;
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Çok fazla istek gönderdiniz. Lütfen daha sonra tekrar deneyin.' }, { status: 429 });
    }

    const body = await request.json();
    const { name, contactMethod, contactValue, type, message, company } = body;

    // Honeypot check
    if (company) {
      return NextResponse.json({ success: true });
    }

    if (!name || !contactMethod || !contactValue || !message) {
      return NextResponse.json({ error: 'Eksik alanlar var' }, { status: 400 });
    }

    // Length caps
    if (name.length > 100 || contactValue.length > 200 || (type && type.length > 100) || message.length > 2000) {
      return NextResponse.json({ error: 'Geçersiz veri uzunluğu' }, { status: 400 });
    }

    // Escape inputs
    const safeName = escapeHtml(name);
    const safeContactValue = escapeHtml(contactValue);
    const safeType = escapeHtml(type);
    const safeMessage = escapeHtml(message);

    // Firestore'dan Telegram ayarlarını oku
    const docRef = adminDb.collection('settings').doc('telegram');
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: 'Telegram ayarları yapılandırılmamış' }, { status: 400 });
    }

    const data = docSnap.data();
    if (!data) {
       return NextResponse.json({ error: 'Telegram ayarları eksik' }, { status: 400 });
    }
    const { token, chatId } = data;

    if (!token || !chatId) {
      return NextResponse.json({ error: 'Telegram token veya chat ID eksik' }, { status: 400 });
    }

    // İletişim yöntemi bilgisi
    let contactInfo = '';
    if (contactMethod === 'email') {
      contactInfo = `📧 <b>E-posta:</b> ${safeContactValue}`;
    } else if (contactMethod === 'whatsapp') {
      contactInfo = `📞 <b>WhatsApp:</b> ${safeContactValue}`;
    } else if (contactMethod === 'instagram') {
      contactInfo = `📸 <b>Instagram:</b> ${safeContactValue}`;
    } else {
      contactInfo = `ℹ️ <b>İletişim (${escapeHtml(contactMethod)}):</b> ${safeContactValue}`;
    }

    // Mesaj formatı (Marka başta, web sitesinden gönderildi ibaresi sonda)
    const formattedMessage = `⚡️ <b>MAXIMILLIEN SYNTHETIX</b>\nYeni İletişim Formu Gönderisi\n\n` +
      `👤 <b>Ad Soyad:</b> ${safeName}\n` +
      `${contactInfo}\n` +
      `💼 <b>Proje Türü:</b> ${safeType || 'Belirtilmedi'}\n\n` +
      `📝 <b>Mesaj:</b>\n${safeMessage}\n\n` +
      `🌐 <i>web sitesi iletişim formundan gönderildi.</i>`;

    // Telegram API'sine istek at
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: formattedMessage,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Telegram API response error:', errText);
      return NextResponse.json({ error: 'Telegram API hatası' }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Send Telegram Route error:', error);
    const errMessage = error instanceof Error ? error.message : 'Sunucu hatası';
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
