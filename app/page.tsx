'use client'

import { ArrowRight, Zap, Target, Mail, Sparkles, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import { SignUpButton } from '@clerk/nextjs'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { GlassmorphicCard } from '@/components/glassmorphic-card'
import { AnimatedCounter } from '@/components/animated-counter'
import { AnimatedConnectionLines } from '@/components/animated-connection-lines'

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
      <section ref={heroRef} className="relative overflow-hidden px-4 py-20 sm:py-32 h-screen flex items-center">
        {/* Enhanced background layers */}
        <div className="absolute inset-0 -z-20">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background" />
        </div>

        <div className="absolute inset-0 -z-10">
          
          {/* Orbital particle rings */}
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-cyan-500/20 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-purple-500/20 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-cyan-500/30 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Morphing blobs */}
          <motion.div 
            className="absolute top-20 right-0 w-80 h-80 bg-cyan-500/20 rounded-full mix-blend-multiply filter blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.6, 0.4],
              borderRadius: ["30%", "70%", "30%"]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute -bottom-20 left-20 w-80 h-80 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3],
              borderRadius: ["70%", "30%", "70%"]
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
            className="absolute w-96 h-96 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-full mix-blend-screen filter blur-2xl pointer-events-none"
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

        <div className="mx-auto max-w-4xl text-center relative z-10">
          <motion.div 
            className="mb-6 inline-block"
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <motion.span 
              className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-400 border border-cyan-500/30 backdrop-blur-sm"
              animate={{ 
                boxShadow: [
                  "0 0 0px rgba(6, 182, 212, 0)",
                  "0 0 20px rgba(6, 182, 212, 0.5)",
                  "0 0 0px rgba(6, 182, 212, 0)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="w-4 h-4" />
              ✨ AI-Powered Outreach
            </motion.span>
          </motion.div>

          {/* Main heading with staggered letter reveal */}
          <motion.h1 
            className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-6 text-balance leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Transform URLs into{' '}
            <motion.span 
              className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400"
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
            className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto text-balance leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Our intelligent agent{' '}
            <motion.span
              className="font-semibold text-cyan-400"
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
            <motion.div whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(6, 182, 212, 0.5)" }} whileTap={{ scale: 0.95 }}>
              <SignUpButton mode="redirect">
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white gap-2 h-12 px-8 text-base font-semibold shadow-lg hover:shadow-xl transition-all">
                  Try Demo <ArrowRight className="w-4 h-4" />
                </Button>
              </SignUpButton>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="#features">
                <Button size="lg" variant="outline" className="gap-2 h-12 px-8 text-base bg-white/10 border-white/20 hover:bg-white/20 backdrop-blur-sm">
                  View Features
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div 
            className="grid grid-cols-3 gap-6 max-w-2xl mx-auto pt-8 border-t border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {[
              { value: 30, label: 's', description: 'Complete Analysis' },
              { value: 99, label: '%', description: 'Personalization Rate' },
              { value: '∞', label: '', description: 'Research Saved' }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                whileHover={{ scale: 1.1, y: -5 }}
              >
                <motion.div 
                  className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: idx * 0.2 }}
                >
                  {typeof stat.value === 'number' ? (
                    <AnimatedCounter to={stat.value} duration={2} suffix={stat.label} delay={0.5 + idx * 0.1} />
                  ) : (
                    stat.value
                  )}
                </motion.div>
                <p className="text-sm text-foreground/60 mt-2">{stat.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative px-4 py-20 sm:py-32 bg-gradient-to-b from-background to-purple-950/10">
        {/* Animated background grid */}
        <div className="absolute inset-0 -z-10 opacity-20">
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(6, 182, 212, 0.1) 25%, rgba(6, 182, 212, 0.1) 26%, transparent 27%, transparent 74%, rgba(6, 182, 212, 0.1) 75%, rgba(6, 182, 212, 0.1) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(6, 182, 212, 0.1) 25%, rgba(6, 182, 212, 0.1) 26%, transparent 27%, transparent 74%, rgba(6, 182, 212, 0.1) 75%, rgba(6, 182, 212, 0.1) 76%, transparent 77%, transparent)',
              backgroundSize: '50px 50px',
            }}
            animate={{
              backgroundPosition: ['0 0', '50px 50px'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </div>

        <div className="mx-auto max-w-6xl relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Powerful Features</h2>
            <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
              Everything you need to research companies and generate compelling outreach messages
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <GlassmorphicCard delay={0.1}>
              <div className="mb-4 inline-flex p-3 bg-cyan-500/20 rounded-lg backdrop-blur-sm border border-cyan-500/30">
                <Zap className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Lightning Fast</h3>
              <p className="text-foreground/60">Get complete company analysis and personalized emails in just 30 seconds. No waiting, no complexity.</p>
            </GlassmorphicCard>

            {/* Feature 2 */}
            <GlassmorphicCard delay={0.2}>
              <div className="mb-4 inline-flex p-3 bg-purple-500/20 rounded-lg backdrop-blur-sm border border-purple-500/30">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Hyper-Personalized</h3>
              <p className="text-foreground/60">Analyzes recent news, LinkedIn updates, and company data to create truly unique outreach messages.</p>
            </GlassmorphicCard>

            {/* Feature 3 */}
            <GlassmorphicCard delay={0.3}>
              <div className="mb-4 inline-flex p-3 bg-cyan-500/20 rounded-lg backdrop-blur-sm border border-cyan-500/30">
                <Mail className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Research Dashboard</h3>
              <p className="text-foreground/60">Access your entire research history, save favorites, organize with tags, and track your outreach progress.</p>
            </GlassmorphicCard>

            {/* Feature 4 */}
            <GlassmorphicCard delay={0.4}>
              <div className="mb-4 inline-flex p-3 bg-purple-500/20 rounded-lg backdrop-blur-sm border border-purple-500/30">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">AI-Powered Analysis</h3>
              <p className="text-foreground/60">Advanced AI scrapes websites, searches news, analyzes company data, and identifies key talking points.</p>
            </GlassmorphicCard>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative px-4 py-20 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">How It Works</h2>
            <p className="text-lg text-foreground/60">Three simple steps to outreach success</p>
          </motion.div>

          <div className="relative grid md:grid-cols-3 gap-8">
            {/* Animated connection lines */}
            <div className="hidden md:block absolute top-0 left-0 w-full h-32">
              <AnimatedConnectionLines stepCount={3} />
            </div>

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
                className="relative pt-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                {/* Step number with glow */}
                <motion.div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/30 to-purple-500/30 flex items-center justify-center"
                  animate={{
                    boxShadow: [
                      '0 0 0px rgba(6, 182, 212, 0)',
                      '0 0 30px rgba(6, 182, 212, 0.5)',
                      '0 0 0px rgba(6, 182, 212, 0)',
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">{item.step}</span>
                </motion.div>
                
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-foreground/60">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="relative px-4 py-20 sm:py-32 bg-gradient-to-b from-purple-950/20 to-background">
        <div className="mx-auto max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Who It's For</h2>
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
                <GlassmorphicCard key={idx} delay={idx * 0.1} index={idx} className="rounded-lg">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
                        <Icon className="h-6 w-6 text-cyan-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-foreground/60">{item.description}</p>
                    </div>
                  </div>
                </GlassmorphicCard>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative px-4 py-20 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Simple Pricing</h2>
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
              <GlassmorphicCard key={idx} delay={idx * 0.1} index={idx} className="rounded-lg flex flex-col">
                <div className="flex-1">
                  {plan.featured && (
                    <motion.div 
                      className="mb-4 inline-block px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/30 to-purple-500/30 border border-cyan-500/30"
                      animate={{
                        boxShadow: [
                          '0 0 0px rgba(6, 182, 212, 0)',
                          '0 0 20px rgba(6, 182, 212, 0.3)',
                          '0 0 0px rgba(6, 182, 212, 0)',
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">✨ Most Popular</span>
                    </motion.div>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">{plan.price}</span>
                    {plan.period && <span className="text-foreground/60">{plan.period}</span>}
                  </div>
                  <p className="text-foreground/60 mb-6">{plan.description}</p>
                  
                  <div className="space-y-3">
                    {plan.features.map((feature, fidx) => (
                      <motion.div 
                        key={fidx} 
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: fidx * 0.05 }}
                      >
                        <motion.div 
                          className="text-cyan-400"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: fidx * 0.1 }}
                        >
                          <Check className="w-4 h-4" />
                        </motion.div>
                        <span className="text-sm">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <motion.div
                  className="mt-8"
                  whileHover={{ scale: 1.05 }}
                >
                  <Button 
                    className={`w-full font-semibold transition-all ${
                      plan.featured 
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white shadow-lg' 
                        : 'bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </motion.div>
              </GlassmorphicCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-4 py-20 sm:py-32 bg-gradient-to-r from-cyan-600 to-purple-600 text-white overflow-hidden">
        {/* Animated background particles */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        <div className="mx-auto max-w-3xl text-center relative z-10">
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
            <motion.div whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255,255,255,0.3)' }} whileTap={{ scale: 0.95 }}>
              <SignUpButton mode="redirect">
                <Button size="lg" className="bg-white text-cyan-600 hover:bg-white/90 gap-2 font-semibold shadow-lg">
                  Start Free <ArrowRight className="w-4 h-4" />
                </Button>
              </SignUpButton>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="#features">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 gap-2 bg-white/5 font-semibold backdrop-blur-sm">
                  View Demo
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
