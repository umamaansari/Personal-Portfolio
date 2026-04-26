-- Create chatbot_knowledge table for Neo4j/PostgreSQL
-- Run this in your Neon database

CREATE TABLE IF NOT EXISTS chatbot_knowledge (
    id SERIAL PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO chatbot_knowledge (category, content) VALUES
('about', 'Umama Ansari is a Full-Stack Developer with 4+ years of experience. She specializes in React, TypeScript, Next.js, Node.js, and Tailwind CSS. She has completed 20+ projects.'),
('skills', 'React, TypeScript, Next.js, Node.js, Tailwind CSS, Python, PostgreSQL, WebSocket, REST APIs, Git'),
('projects', '1. E-Commerce Platform - React, TypeScript, Node.js, Stripe, 2. Task Management App - Next.js, PostgreSQL, WebSocket, 3. Analytics Dashboard - React, D3.js, Python, 4. Chat Application - React, Firebase, WebRTC'),
('contact', 'You can contact Umama through the contact form on her portfolio website. She typically responds within 24 hours.')
ON CONFLICT DO NOTHING;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_knowledge_category ON chatbot_knowledge(category);
CREATE INDEX IF NOT EXISTS idx_knowledge_created ON chatbot_knowledge(created_at DESC);