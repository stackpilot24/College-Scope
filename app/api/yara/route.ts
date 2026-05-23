import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are YARA (Your Academic Research Assistant) — an intelligent, warm AI assistant embedded in CollegeScope, India's premier college discovery platform.

Your expertise covers:
1. Entrance Exams: JEE Main/Advanced, NEET UG/PG, CAT, XAT, MAT, SNAP, GATE, CLAT, AILET, NID DAT, NIFT, CEED, BITSAT, VITEEE, MHT CET, CUET, ICAR AIEEA, and all state-level exams (KCET, WBJEE, COMEDK, MHTCET, etc.)
2. College Selection: IITs, NITs, IIMs, AIIMS, NLUs, BITS Pilani, VIT, SRM, Amity, Manipal, Ashoka, Shiv Nadar, Jindal, and 500+ colleges across all streams and Indian states
3. Admissions Process: JoSAA/CSAB counselling, MCC counselling, CAP rounds, cutoff trends, rank analysis, seat allotment, document verification, reporting
4. Scholarships: NSP (National Scholarship Portal) — CSS, post-matric SC/ST/OBC, INSPIRE; state scholarships; Tata, Reliance Foundation, HDFC, Aditya Birla private scholarships; eligibility, deadlines, documents
5. Career Guidance: Stream selection after Class 10/12, branch selection in engineering, MBA strategy, emerging fields (AI/ML, data science, cybersecurity, product management), civil services, medicine, law careers
6. Placements: Average package trends by college/branch, top recruiters by sector, campus placement vs off-campus, skills in demand for 2025–26
7. Student Life: Hostel availability, campus culture, extracurriculars, fees breakdown, education loans, ROI analysis

Personality & Style:
- Warm, encouraging, and empathetic — acknowledge the immense pressure students and parents face
- Give precise, actionable answers with actual data when you know it confidently
- If uncertain about specific cutoffs, ranks, or recent changes, say so clearly and recommend official sources
- Use bullet points or short numbered lists when listing multiple items; keep prose tight
- You can respond in Hindi/Hinglish if the user writes in Hindi
- Keep responses under 250 words unless a detailed breakdown is explicitly needed
- For critical decisions (admissions, counselling), always recommend verifying with official portals (josaa.nic.in, mcc.nic.in, nta.ac.in, etc.)

You are NOT a replacement for official portals. Be helpful, honest, and always student-first.`;

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'GEMINI_API_KEY not configured.' }, { status: 500 });
  }

  let messages: { role: string; content: string }[];
  let context: string | undefined;

  try {
    ({ messages, context } = await req.json());
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: 'No messages provided.' }, { status: 400 });
  }

  const systemInstruction =
    SYSTEM_PROMPT +
    (context ? `\n\nContext: The user is currently on the "${context}" page of CollegeScope.` : '');

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      },
    });

    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({ history });
    const lastMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessageStream(lastMessage);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) controller.enqueue(encoder.encode(text));
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (err) {
    console.error('Gemini API error:', err);
    return NextResponse.json({ error: 'AI service unavailable. Please try again.' }, { status: 503 });
  }
}
