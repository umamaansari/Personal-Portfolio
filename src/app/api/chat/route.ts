import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    let systemPrompt = `
You are Umama Ansari's AI portfolio assistant. Umama is a Full-Stack Developer with expertise in React, TypeScript, Next.js, Node.js, and Tailwind CSS.
She has 4+ years of experience and has completed 20+ projects.
Use the information provided to answer questions about her portfolio.
Be friendly, professional, and concise.
    `.trim();

    let portfolioInfo = '';
    try {
      const portfolioResult = await pool.query(`
        SELECT category, content FROM chatbot_knowledge 
        ORDER BY created_at DESC 
        LIMIT 10
      `);
      
      if (portfolioResult.rows.length > 0) {
        portfolioInfo = portfolioResult.rows
          .map((row: any) => `${row.category}: ${row.content}`)
          .join('\n');
        systemPrompt = `
You are Umama Ansari's AI portfolio assistant. Use this information about her:
${portfolioInfo}

Answer questions about her portfolio based on the information above. Be friendly, professional, and concise.
        `.trim();
      }
    } catch (dbError) {
      console.log('Database not available, using default info');
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey || apiKey === 'your_api_key_here') {
      const fallbackResponses: Record<string, string> = {
        'about': 'Umama Ansari is a Full-Stack Developer with 4+ years of experience. She specializes in React, TypeScript, Next.js, Node.js, and Tailwind CSS.',
        'skills': 'Umama is proficient in React, TypeScript, Next.js, Node.js, Tailwind CSS, Python, PostgreSQL, and more.',
        'projects': "She has completed 20+ projects including E-Commerce Platform, Task Management App, Analytics Dashboard, and Chat Application.",
        'contact': 'You can contact Umama through the contact form on her portfolio. She typically responds within 24 hours.',
        'default': "I'm here to help! Ask me about Umama's skills, projects, or how to contact her."
      };
      
      const lowerMessage = message.toLowerCase();
      let reply = fallbackResponses.default;
      
      if (lowerMessage.includes('about') || lowerMessage.includes('who')) {
        reply = fallbackResponses.about;
      } else if (lowerMessage.includes('skill') || lowerMessage.includes('tech') || lowerMessage.includes('stack')) {
        reply = fallbackResponses.skills;
      } else if (lowerMessage.includes('project') || lowerMessage.includes('work')) {
        reply = fallbackResponses.projects;
      } else if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('reach')) {
        reply = fallbackResponses.contact;
      }
      
      return NextResponse.json({ reply });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content: message }],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Anthropic API error:', errorData);
      return NextResponse.json({ reply: "I'm having trouble connecting to the AI. Please try again." });
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text || "I'd be happy to tell you more about Umama's portfolio!";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { reply: "I'm here to help! Feel free to ask about Umama's work." }
    );
  }
}