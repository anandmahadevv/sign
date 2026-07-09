import React from "react";
import { ArrowUpRight, Code2, Database, Layout, Server, Sparkles, Wrench } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Work & Projects | Portfolio",
  description: "A showcase of my recent projects and the technologies I use.",
};

const projects = [
  {
    name: "Agronova",
    description: "AI-powered smart agriculture platform for crop disease detection, pest identification, weather insights, and farmer assistance.",
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Python", "FastAPI", "TensorFlow", "OpenCV", "Supabase", "AI APIs"],
    link: null
  },
  {
    name: "Sign by HackArena",
    description: "Digital document signing platform with secure agreements, PDF generation, client portal, email automation, and document management.",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Clerk", "PostgreSQL", "PDF Generation", "Resend", "REST APIs"],
    link: null
  },
  {
    name: "Flow – AI Sales Operations Manager",
    description: "AI-powered autonomous sales agent that manages customer enquiries, quotation generation, approvals, CRM updates, and follow-ups.",
    technologies: ["Python", "FastAPI", "Next.js", "PostgreSQL", "OpenAI", "Groq", "RAG", "AI Tool Calling"],
    link: null
  },
  {
    name: "CardioNerve",
    description: "AI + IoT healthcare solution for real-time heart monitoring and early cardiovascular risk prediction.",
    technologies: ["Python", "Machine Learning", "TensorFlow", "Arduino UNO", "IoT", "FastAPI", "React Dashboard"],
    link: null
  },
  {
    name: "Abaya Cloth Shop",
    description: "Modern e-commerce platform for an abaya clothing brand with product catalogue, order management, and responsive shopping experience.",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "Razorpay", "REST APIs"],
    link: null
  },
  {
    name: "STR Jewel Machinery & Tools",
    description: "Corporate website for an industrial machinery company with product catalogue, enquiry system, SEO optimization, and responsive design.",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "CMS", "SEO", "REST APIs"],
    link: null
  },
  {
    name: "Project Sankalp",
    description: "Community/student platform for project management, registrations, collaboration, event management, and progress tracking.",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Firebase", "Authentication", "REST APIs"],
    link: null
  },
  {
    name: "OpenLoop",
    description: "AI-powered workflow automation platform that connects multiple business tools and automates repetitive business processes.",
    technologies: ["React", "Next.js", "TypeScript", "Python", "FastAPI", "PostgreSQL", "AI APIs", "n8n", "Webhooks"],
    link: null
  },
  {
    name: "TechClub NIAT",
    description: "Official student technology community platform for managing events, registrations, GitHub leaderboard, announcements, members, and technical resources.",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Clerk", "Supabase", "GitHub API", "REST APIs"],
    link: "https://techclub.niat.me"
  }
];

const techCategories = [
  {
    title: "Frontend",
    icon: <Layout className="w-5 h-5 text-blue-500" />,
    skills: ["HTML5", "CSS3", "JavaScript (ES6+)", "TypeScript", "React.js", "Next.js", "Tailwind CSS", "Framer Motion"]
  },
  {
    title: "Backend",
    icon: <Server className="w-5 h-5 text-green-500" />,
    skills: ["Node.js", "Express.js", "Python", "FastAPI", "REST APIs"]
  },
  {
    title: "Databases",
    icon: <Database className="w-5 h-5 text-yellow-500" />,
    skills: ["PostgreSQL", "Supabase", "Firebase", "SQLite"]
  },
  {
    title: "AI & Machine Learning",
    icon: <Sparkles className="w-5 h-5 text-purple-500" />,
    skills: ["OpenAI API", "Google Gemini API", "Groq API", "RAG", "AI Agents", "Prompt Engineering", "TensorFlow", "OpenCV"]
  },
  {
    title: "Tools & DevOps",
    icon: <Wrench className="w-5 h-5 text-gray-500 dark:text-gray-400" />,
    skills: ["AWS", "Vercel", "Git & GitHub", "GitHub Actions", "n8n", "Webhooks", "Postman", "Figma"]
  },
  {
    title: "Other Core Tech",
    icon: <Code2 className="w-5 h-5 text-red-500" />,
    skills: ["Clerk & Firebase Auth", "IoT (Arduino/Sensors)", "Payment Gateways", "Email APIs", "CRM Integrations"]
  }
];

export default function WorkPage() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black">
      
      {/* Navbar Placeholder - assuming site has a layout navbar, but giving top padding just in case */}
      <div className="pt-24 pb-12 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="max-w-3xl mb-20 animate-hero-rise">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">
            Work & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">Projects</span>
          </h1>
          <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed">
            A curated showcase of my recent projects spanning AI, full-stack web development, and IoT. Built with modern technologies and a focus on beautiful, functional design.
          </p>
        </header>

        {/* Projects Grid */}
        <section className="mb-28">
          <div className="flex items-center gap-3 mb-10">
            <h2 className="text-2xl font-bold tracking-tight">Featured Work</h2>
            <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <div 
                key={i} 
                className="group relative flex flex-col bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden hover:border-blue-500/30 dark:hover:border-blue-400/30 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold">{project.name}</h3>
                    {project.link && (
                      <Link 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-neutral-400 hover:text-blue-500 transition-colors"
                      >
                        <ArrowUpRight className="w-5 h-5" />
                      </Link>
                    )}
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6 flex-1">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {project.technologies.map((tech, j) => (
                      <span 
                        key={j} 
                        className="px-2.5 py-1 text-xs font-medium bg-neutral-100 dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 rounded-lg group-hover:border-neutral-300 dark:group-hover:border-neutral-700 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technology Stack */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-10">
            <h2 className="text-2xl font-bold tracking-tight">Technology Arsenal</h2>
            <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techCategories.map((category, i) => (
              <div 
                key={i} 
                className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl animate-fade-up"
                style={{ animationDelay: `${(projects.length * 50) + (i * 100)}ms` }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2.5 bg-neutral-100 dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800">
                    {category.icon}
                  </div>
                  <h3 className="text-lg font-bold">{category.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, j) => (
                    <span 
                      key={j} 
                      className="px-3 py-1.5 text-sm font-medium bg-neutral-50 dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 rounded-lg"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
