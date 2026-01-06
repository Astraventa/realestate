import Hero from '@/components/Hero'
import Features from '@/components/Features'
import ChatbotAIVercel from '@/components/ChatbotAIVercel'
import Benefits from '@/components/Benefits'
import WhatYouGet from '@/components/WhatYouGet'
import LeadForm from '@/components/LeadForm'
import CTA from '@/components/CTA'
import AgentSetup from '@/components/AgentSetup'

export default function Home() {
  return (
    <main className="min-h-screen">
      <AgentSetup />
      <Hero />
      <Features />
      <WhatYouGet />
      <ChatbotAIVercel />
      <Benefits />
      <LeadForm />
      <CTA />
    </main>
  )
}

