<div align="center">
  <br />
    <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/pen-tool.svg" width="60" alt="Sign by HackArena" />
  <br />

  <h1>Sign by HackArena</h1>
  <p>
    <strong>A premium B2B SaaS platform for creating, sending, and digitally signing client agreements.</strong>
  </p>

  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#database-schema">Database Schema</a>
  </p>
</div>

<hr />

## 🚀 Overview

**Sign** is a modern, responsive, and secure agreement management system designed for agencies and freelancers. It allows users to create legally binding contracts, share them via secure public links, capture digital signatures, and generate physical PDF copies complete with cryptographic audit trails.

With native multi-tenancy support, teams can collaborate in isolated Workspaces, applying custom dynamic branding to their outgoing contracts.

## ✨ Features

- **Multi-Tenant Workspaces:** Users can operate in isolated Organizations (Workspaces) or Personal Accounts.
- **Dynamic Branding:** Client-facing contracts automatically inherit the specific Agency Name tied to the Workspace.
- **Digital Signatures:** Hand-drawn signature capture using an intuitive canvas pad.
- **PDF Generation:** One-click snapshot downloads of the agreement formatted perfectly for A4 printing.
- **Legal Audit Trails:** Every signed contract securely logs the Signer's IP address, timestamp, and a cryptographic signature hash.
- **Responsive Dark Mode:** A stunning, fully responsive dashboard that looks gorgeous on mobile and desktop.
- **Secure Public Links:** Shareable, read-only contract links for clients to review and sign.

## 💻 Tech Stack

- **Framework:** [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Authentication:** [Clerk](https://clerk.com/) (with Organization Support)
- **Database:** [Supabase](https://supabase.com/) (PostgreSQL)
- **PDF Generation:** `html-to-image` & `jspdf`
- **Icons:** [Lucide React](https://lucide.dev/)

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/anandmahadevv/sign.git
cd sign
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root of the project and add your keys:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### 4. Set up the Database

Run the provided `supabase.sql` script in your Supabase SQL Editor to provision the necessary tables, Row Level Security (RLS) policies, and IP auditing columns.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Database Schema

The core architecture relies on two primary tables:

1. **`agreements`**: Stores all contract metadata, terms, financial details, statuses, and cryptographic signature data.
2. **`profiles`**: Stores the dynamic `agency_name` linked to a specific `owner_id` (which can map to a User ID or a Clerk Organization ID).

## 🔒 Security

This application uses Row Level Security (RLS) in Supabase. In a production environment, ensure that you update the `supabase.sql` policies to authenticate strictly against the `user_id` and `org_id` tokens passed down from Clerk.

---

<div align="center">
  Built with ❤️ by <strong>Anand Mahadev (HackArena)</strong>
</div>
