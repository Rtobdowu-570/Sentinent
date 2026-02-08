'use client'

import { ArrowRight, Zap, Target, Mail, Sparkles, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import { SignUpButton } from '@clerk/nextjs'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        setMousePosition({ x, y })
      }
    }

    const heroElement = heroRef.current
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove)
      return () => heroElement.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section ref={heroRef} className="relative overflow-hidden px-4 py-20 sm:py-32">
        <div className="absolute inset-0 -z-10 opacity-40">
          <motion.div 
            className="absolute top-20 right-0 w-80 h-80 bg-accent rounded-full mix-blend-multiply filter blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute -bottom-20 left-20 w-80 h-80 bg-accent/50 rounded-full mix-blend-multiply filter blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          {/* Mouse tracking glow effect */}
          <motion.div 
            className="absolute w-96 h-96 bg-accent/30 rounded-full mix-blend-screen filter blur-2xl pointer-events-none"
            animate={{
              x: mousePosition.x - 192,
              y: mousePosition.y - 192,
            }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 200,
            }}
          />
        </div>

        <div className="mx-auto max-w-4xl text-center">
          <motion.div 
            className="mb-6 inline-block"
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <motion.span 
              className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent border border-accent/20"
              animate={{ 
                boxShadow: [
                  "0 0 0px rgba(var(--accent), 0)",
                  "0 0 20px rgba(var(--accent), 0.5)",
                  "0 0 0px rgba(var(--accent), 0)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="w-4 h-4" />
              AI-Powered Outreach
            </motion.span>
          </motion.div>

          <motion.h1 
            className="text-5xl sm:text-7xl font-bold tracking-tight mb-6 text-balance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Transform URLs into{' '}
            <motion.span 
              className="text-accent inline-block"
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              personalized emails
            </motion.span>{' '}
            in 30 seconds
          </motion.h1>

          <motion.p 
            className="text-xl text-foreground/60 mb-8 max-w-2xl mx-auto text-balance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Our intelligent agent{' '}
            <motion.span
              className="font-semibold text-accent"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0 }}
            >
              scrapes company data
            </motion.span>
            , analyzes recent news, and generates hyper-personalized outreach emails. Perfect for sales teams, recruiters, and business development professionals.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <SignUpButton mode="redirect">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white gap-2 h-12 px-8 text-base">
                  Try Demo <ArrowRight className="w-4 h-4" />
                </Button>
              </SignUpButton>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="#features">
                <Button size="lg" variant="outline" className="gap-2 h-12 px-8 text-base bg-transparent">
                  View Features
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div 
            className="grid grid-cols-3 gap-6 max-w-2xl mx-auto pt-8 border-t border-border/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {[
              { value: '30s', label: 'Complete Analysis' },
              { value: '99%', label: 'Personalization Rate' },
              { value: '∞', label: 'Research Saved' }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div 
                  className="text-2xl font-bold text-accent"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: idx * 0.2 }}
                >
                  {stat.value}
                </motion.div>
                <p className="text-sm text-foreground/60">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 py-20 sm:py-32 bg-secondary/30">
        <div className="mx-auto max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Powerful Features</h2>
            <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
              Everything you need to research companies and generate compelling outreach messages
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <motion.div 
              className="bg-background rounded-lg border border-border p-8 hover:border-accent/50 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="mb-4 inline-flex p-3 bg-accent/10 rounded-lg">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Lightning Fast</h3>
              <p className="text-foreground/60">Get complete company analysis and personalized emails in just 30 seconds. No waiting, no complexity.</p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              className="bg-background rounded-lg border border-border p-8 hover:border-accent/50 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="mb-4 inline-flex p-3 bg-accent/10 rounded-lg">
                <Target className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Hyper-Personalized</h3>
              <p className="text-foreground/60">Analyzes recent news, LinkedIn updates, and company data to create truly unique outreach messages.</p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              className="bg-background rounded-lg border border-border p-8 hover:border-accent/50 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="mb-4 inline-flex p-3 bg-accent/10 rounded-lg">
                <Mail className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Research Dashboard</h3>
              <p className="text-foreground/60">Access your entire research history, save favorites, organize with tags, and track your outreach progress.</p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div 
              className="bg-background rounded-lg border border-border p-8 hover:border-accent/50 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="mb-4 inline-flex p-3 bg-accent/10 rounded-lg">
                <Sparkles className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-2">AI-Powered Analysis</h3>
              <p className="text-foreground/60">Advanced AI scrapes websites, searches news, analyzes company data, and identifies key talking points.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 py-20 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-foreground/60">Three simple steps to outreach success</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Paste Company URL',
                description: 'Enter any company website URL and our agent gets to work immediately.'
              },
              {
                step: '2',
                title: 'AI Analyzes & Researches',
                description: 'We scrape the site, search for recent news, analyze LinkedIn, and identify key insights.'
              },
              {
                step: '3',
                title: 'Get Personalized Email',
                description: 'Receive a crafted, hyper-personalized outreach email ready to send or customize.'
              }
            ].map((item, idx) => (
              <motion.div 
                key={item.step} 
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className="text-6xl font-bold text-accent/20 mb-4">{item.step}</div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-foreground/60">{item.description}</p>
                {item.step !== '3' && (
                  <motion.div 
                    className="hidden md:block absolute top-8 -right-4 text-2xl text-accent/40"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowRight className="w-8 h-8" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="px-4 py-20 sm:py-32 bg-secondary/30">
        <div className="mx-auto max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Who It's For</h2>
            <p className="text-lg text-foreground/60">Perfect for any professional doing targeted outreach</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: Target,
                title: 'Sales Teams',
                description: 'Close more deals with highly personalized cold outreach that actually resonates with prospects.'
              },
              {
                icon: Mail,
                title: 'Recruiters',
                description: 'Source and engage top talent with customized recruiting messages based on company insights.'
              },
              {
                icon: Zap,
                title: 'Business Development',
                description: 'Identify partnership opportunities and craft compelling outreach with data-driven insights.'
              },
              {
                icon: Sparkles,
                title: 'Investors',
                description: 'Research potential portfolio companies and create personalized investment inquiry emails.'
              }
            ].map((item, idx) => {
              const Icon = item.icon
              return (
                <motion.div 
                  key={idx} 
                  className="flex gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                      <Icon className="h-6 w-6 text-accent" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-foreground/60">{item.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-4 py-20 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-lg text-foreground/60">Start free, upgrade when you're ready</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Starter',
                price: 'Free',
                description: 'Perfect for trying it out',
                features: ['5 researches/month', 'Basic email generation', 'Research history', 'Email copy'],
                cta: 'Get Started',
                featured: false
              },
              {
                name: 'Professional',
                price: '$29',
                period: '/month',
                description: 'For active outreach',
                features: ['100 researches/month', 'Advanced AI analysis', 'Priority support', 'Email templates', 'Team collaboration'],
                cta: 'Start Free Trial',
                featured: true
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                description: 'For large teams',
                features: ['Unlimited researches', 'Custom AI models', '24/7 support', 'API access', 'Advanced analytics'],
                cta: 'Contact Sales',
                featured: false
              }
            ].map((plan, idx) => (
              <motion.div 
                key={idx} 
                className={`rounded-lg border p-8 transition-all ${
                  plan.featured 
                    ? 'border-accent bg-accent/5 ring-1 ring-accent scale-105' 
                    : 'border-border bg-background'
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ scale: plan.featured ? 1.05 : 1.02 }}
              >
                {plan.featured && (
                  <div className="mb-4 inline-block">
                    <span className="text-xs font-bold text-accent uppercase tracking-wider">Most Popular</span>
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-foreground/60">{plan.period}</span>}
                </div>
                <p className="text-foreground/60 mb-6">{plan.description}</p>
                <Button 
                  className={`w-full mb-6 ${plan.featured ? 'bg-accent hover:bg-accent/90' : 'bg-primary hover:bg-primary/90'}`}
                >
                  {plan.cta}
                </Button>
                <div className="space-y-3">
                  {plan.features.map((feature, fidx) => (
                    <div key={fidx} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-accent" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:py-32 bg-accent text-white">
        <div className="mx-auto max-w-3xl text-center">
          <motion.h2 
            className="text-4xl sm:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Ready to transform your outreach?
          </motion.h2>
          <motion.p 
            className="text-xl mb-8 opacity-90"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Join hundreds of teams generating personalized emails in seconds.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <SignUpButton mode="redirect">
              <Button size="lg" className="bg-white text-accent hover:bg-white/90 gap-2">
                Start Free <ArrowRight className="w-4 h-4" />
              </Button>
            </SignUpButton>
            <Link href="#features">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 gap-2 bg-transparent">
                View Demo
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
