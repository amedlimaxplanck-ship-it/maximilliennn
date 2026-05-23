import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, type, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Eksik alanlar var' }, { status: 400 });
    }

    // Firestore'dan Telegram ayarlarını oku
    const docRef = doc(db, 'settings', 'telegram');
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'Telegram ayarları yapılandırılmamış' }, { status: 400 });
    }

    const { token, chatId } = docSnap.data();

    if (!token || !chatId) {
      return NextResponse.json({ error: 'Telegram token veya chat ID eksik' }, { status: 400 });
    }

    // Mesaj formatı (Marka başta, web sitesinden gönderildi ibaresi sonda)
    const formattedMessage = `⚡️ <b>MAXIMILLIEN SYNTHETIX</b>\nYeni İletişim Formu Gönderisi\n\n` +
      `👤 <b>Ad Soyad:</b> ${name}\n` +
      `📧 <b>E-posta:</b> ${email}\n` +
      `💼 <b>Proje Türü:</b> ${type || 'Belirtilmedi'}\n\n` +
      `📝 <b>Mesaj:</b>\n${message}\n\n` +
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
