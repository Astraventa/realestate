import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Chatbot from '@/components/Chatbot'
import Benefits from '@/components/Benefits'
import LeadForm from '@/components/LeadForm'
import CTA from '@/components/CTA'
import AgentSetup from '@/components/AgentSetup'

export default function Home() {
  return (
    <main className="min-h-screen">
      <AgentSetup />
      <Hero />
      <Features />
      <Chatbot />
      <Benefits />
      <LeadForm />
      <CTA />
    </main>
  )
}

