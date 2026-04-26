"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface Project {
  title: string;
  description: string;
  tech: string[];
  link?: string;
  color: string;
}

interface Skill {
  name: string;
  icon: string;
  progress: number;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

const projects: Project[] = [
  {
    title: "E-Commerce Platform",
    description: "A full-featured online shopping platform with cart, checkout, and payment integration.",
    tech: ["React", "TypeScript", "Node.js", "Stripe"],
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Task Management App",
    description: "Collaborative project management tool with real-time updates and team features.",
    tech: ["Next.js", "PostgreSQL", "WebSocket", "Prisma"],
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Analytics Dashboard",
    description: "Interactive data visualization dashboard with charts and automated reports.",
    tech: ["React", "D3.js", "Python", "FastAPI"],
    color: "from-emerald-500 to-teal-500",
  },
  {
    title: "Chat Application",
    description: "Real-time messaging app with voice/video calls and file sharing.",
    tech: ["React", "Firebase", "WebRTC", "Tailwind"],
    color: "from-orange-500 to-red-500",
  },
];

const skills: Skill[] = [
  { name: "React", icon: "⚛️", progress: 95 },
  { name: "TypeScript", icon: "🔷", progress: 90 },
  { name: "Next.js", icon: "▲", progress: 88 },
  { name: "Node.js", icon: "🟢", progress: 85 },
  { name: "Tailwind CSS", icon: "🎨", progress: 92 },
  { name: "Python", icon: "🐍", progress: 75 },
];

const socialLinks = [
  { name: "GitHub", icon: "⌘", href: "https://github.com/umamaansari" },
  { name: "LinkedIn", icon: "in", href: "https://www.linkedin.com/in/umama-ansari-3970452b6" },
  { name: "Twitter", icon: "X", href: "https://twitter.com" },
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [visibleSection, setVisibleSection] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm your AI assistant. Ask me anything about Umama's portfolio!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typedText, setTypedText] = useState("");
  const fullText = "Full-Stack Developer";
  const messagesEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = ["hero", "about", "skills", "projects", "contact"];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setVisibleSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i <= fullText.length) {
        setTypedText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const handleSend = async function () {
    if (!input.trim() || loading) return;
    
    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I'm here to help! Ask me about Umama's portfolio." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black pointer-events-none" />
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzMzkiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djJoLTJ2LTJoMnptLTItMjBoMnYySDI0di0yaC00di0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20 pointer-events-none" />

      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-110 transition-all duration-300 z-50 animate-pulse"
      >
        {chatOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {chatOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 w-[calc(100%-2rem)] sm:w-80 md:w-96 h-[70vh] sm:h-[500px] bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl shadow-purple-500/20 z-50 flex flex-col overflow-hidden border border-slate-700/50">
          <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 p-4 flex items-center justify-between">
            <div>
              <h4 className="text-white font-semibold flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                AI Assistant
              </h4>
              <p className="text-white/70 text-xs"> Online</p>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.role === "user" 
                    ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white" 
                    : "bg-slate-800/80 text-slate-200 border border-slate-700/50"
                }`}>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <span className={`text-xs mt-1 block ${msg.role === "user" ? "text-white/60" : "text-slate-500"}`}>
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 rounded-2xl px-4 py-3 border border-slate-700">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEnd} />
          </div>
          <div className="p-3 border-t border-slate-700/50 bg-slate-800/30">
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 text-sm rounded-full bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="w-11 h-11 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full flex items-center justify-center disabled:opacity-50 hover:scale-105 transition-transform shadow-lg shadow-purple-500/30"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-slate-950/90 backdrop-blur-2xl border-b border-slate-800/50 shadow-lg shadow-black/20" : "bg-transparent"
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
          <button onClick={() => scrollTo("hero")} className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-lg">U</span>
            </div>
            <span className="text-xl font-bold text-white">Umama<span className="text-slate-400">.dev</span></span>
          </button>
          <div className="hidden md:flex gap-1">
            {[
              { id: "about", label: "About" },
              { id: "skills", label: "Skills" },
              { id: "projects", label: "Projects" },
              { id: "contact", label: "Contact" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  visibleSection === item.id
                    ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-purple-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button
            className="md:hidden text-slate-300 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900/95 backdrop-blur-xl px-4 py-4 border-t border-slate-800">
            {[
              { id: "about", label: "About" },
              { id: "skills", label: "Skills" },
              { id: "projects", label: "Projects" },
              { id: "contact", label: "Contact" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="block w-full text-left py-3 text-slate-300 hover:text-white active:text-white"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      <section id="hero" className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,70,255,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(200,100,255,0.1),transparent_40%)]" />
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-full bg-slate-800/60 border border-slate-700/50 mb-6 sm:mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs sm:text-sm text-slate-300 font-medium">Available for work</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Hi, I'm{' '}
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              Umama Ansari
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-slate-300 mb-5 font-medium">
            {typedText}
            <span className="animate-pulse text-violet-400">|</span>
          </p>
          
          <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            I build exceptional digital experiences with modern technologies.
            Specializing in full-stack development with React, TypeScript, and Node.js.
          </p>
          
          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center mb-8 sm:mb-14">
            <button onClick={() => scrollTo("projects")} className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-full font-medium hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 active:scale-95">
              View Projects
            </button>
            <button onClick={() => scrollTo("contact")} className="px-6 sm:px-8 py-3 sm:py-4 border border-slate-600 text-white rounded-full font-medium hover:bg-slate-800 transition-all duration-300 hover:border-slate-500 active:bg-slate-700">
              Contact Me
            </button>
          </div>

          <div className="flex gap-5 justify-center">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="text-slate-500 hover:text-white transition-colors text-2xl hover:scale-110 transform"
                title={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      <section id="about" className="py-16 sm:py-24 md:py-28 px-4 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(120,70,255,0.08),transparent_50%)]" />
        
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl md:text-5xl font-bold text-white mb-4 text-center">
            About <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">Me</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 mx-auto mb-14 rounded-full" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="relative group order-1">
              <div className="relative h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl bg-slate-800">
                <Image 
                  src="/laptop.jpg" 
                  alt="Umama Ansari" 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg shadow-lg">
                <p className="text-white text-sm font-semibold">Full-Stack Developer</p>
              </div>
            </div>
            
            <div className="space-y-6 order-2 md:order-2">
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                I'm a passionate <span className="text-violet-400">Full-Stack Developer</span> with expertise in building modern web applications. 
                I love creating seamless digital experiences with clean, efficient code.
              </p>
              <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
                My journey started with curiosity for how things work on the web, and it has evolved into a career
                building applications that make a difference. I believe in writing code that's not just functional,
                but maintainable and scalable.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                <div className="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-5 hover:border-violet-500/30 transition-all duration-300 group/card">
                  <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">4+</div>
                  <div className="text-slate-500 text-sm mt-1">Years Experience</div>
                </div>
                <div className="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-5 hover:border-purple-500/30 transition-all duration-300 group/card">
                  <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">20+</div>
                  <div className="text-slate-500 text-sm mt-1">Projects Completed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="skills" className="py-16 sm:py-20 md:py-24 px-4 relative">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl md:text-5xl font-bold text-white mb-4 text-center">
            My <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">Skills</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-violet-500 to-purple-500 mx-auto mb-12 rounded-full" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {skills.map((skill) => (
              <div key={skill.name} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 sm:p-5 hover:border-violet-500/30 transition-all duration-300 hover:bg-slate-800/50">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-xl sm:text-2xl">{skill.icon}</span>
                    <span className="text-white font-medium text-sm sm:text-base">{skill.name}</span>
                  </div>
                  <span className="text-slate-500 text-sm">{skill.progress}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-1000"
                    style={{ width: `${skill.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="py-16 sm:py-20 md:py-24 px-4 relative">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl md:text-5xl font-bold text-white mb-4 text-center">
            Featured <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">Projects</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-violet-500 to-purple-500 mx-auto mb-12 rounded-full" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <div 
                key={index} 
                className="group bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden hover:border-violet-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1"
              >
                <div className={`h-40 sm:h-48 bg-gradient-to-br ${project.color} relative`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute bottom-4 left-4">
                    <div className="flex gap-2">
                      {project.tech.slice(0, 3).map((t) => (
                        <span key={t} className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-md text-white text-xs">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{project.description}</p>
                  <button className="mt-4 text-violet-400 text-sm font-medium hover:text-violet-300 flex items-center gap-1">
                    View Project 
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-16 sm:py-20 md:py-24 px-4 relative">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl md:text-5xl font-bold text-white mb-4 text-center">
            Get In <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">Touch</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-violet-500 to-purple-500 mx-auto mb-8 rounded-full" />
          <p className="text-slate-400 text-center mb-8">
            Have a project in mind? Let's create something amazing together.
          </p>
          
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Message</label>
              <textarea
                className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all h-32 sm:h-40 resize-none"
                placeholder="Tell me about your project..."
              />
            </div>
            <button type="submit" className="w-full py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
              Send Message
            </button>
          </form>
        </div>
      </section>

      <footer className="py-12 border-t border-slate-800/50 bg-slate-900/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-white font-semibold text-lg">Umama Ansari</p>
              <p className="text-slate-500 text-sm mt-1">Full-Stack Developer</p>
            </div>
            <div className="flex gap-6">
              {socialLinks.map((social) => (
                <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors text-sm hover:scale-110 transform">
                  {social.name}
                </a>
              ))}
            </div>
            <p className="text-slate-600 text-sm">
              © {new Date().getFullYear()} Built with React
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}