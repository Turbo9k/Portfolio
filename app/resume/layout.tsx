import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Resume - Ian Siats | Web Developer Portfolio",
  description: "Professional resume for Ian Siats - Self-taught Full-Stack Web Developer seeking entry-level opportunities. View technical skills, featured projects, and professional competencies.",
  openGraph: {
    title: "Resume - Ian Siats | Web Developer Portfolio",
    description: "Professional resume for Ian Siats - Self-taught Full-Stack Web Developer with expertise in React, Next.js, and modern web technologies.",
    type: "website",
    url: "https://iansiats.vercel.app/resume",
  },
  twitter: {
    card: "summary",
    title: "Resume - Ian Siats | Web Developer Portfolio",
    description: "Professional resume for Ian Siats - Self-taught Full-Stack Web Developer.",
  },
}

export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

