"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Shield, Wallet, Lock, Key, Database, Network, CreditCard, Cpu, Globe, RefreshCw } from "lucide-react"
import Navbar from "@/components/navbar"
import { motion } from "framer-motion"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
    },
  }),
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
}

export default function LandingPage() {
  const problemRef = useRef<HTMLElement>(null)
  const solutionRef = useRef<HTMLElement>(null)
  const howItWorksRef = useRef<HTMLElement>(null)
  const innovationsRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in")
          }
        })
      },
      { threshold: 0.1 },
    )

    const sections = [problemRef.current, solutionRef.current, howItWorksRef.current, innovationsRef.current]

    sections.forEach((section) => {
      if (section) observer.observe(section)
    })

    return () => {
      sections.forEach((section) => {
        if (section) observer.unobserve(section)
      })
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col dark">
      <Navbar />

      <main className="flex-1 bg-zinc-950 text-white">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 border-b border-zinc-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-900/20 via-zinc-900/5 to-zinc-950 z-0"></div>
          <div className="container relative z-10 px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <motion.div
                className="flex flex-col justify-center space-y-4"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center space-x-1 rounded-full bg-zinc-800/30 px-3 py-1 text-sm text-violet-400">
                  <span>The Missing Financial Layer for AI Agent Networks</span>
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                    Privacy-Preserving Financial Passport for AI Agents
                  </h1>
                  <p className="max-w-[600px] text-zinc-400 md:text-xl">
                    Enabling AI agents to operate across multiple blockchains using zero-knowledge verified asset
                    claims—without requiring asset transfers or pre-funding.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 gap-1 transition-all duration-300 hover:scale-105"
                  >
                    Join Waitlist <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Link href="/demo">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-zinc-700 text-white hover:bg-zinc-800 transition-all duration-300 hover:border-violet-500"
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>
              </motion.div>
              <motion.div
                className="flex items-center justify-center"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="relative w-full max-w-[500px] aspect-square overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 shadow-xl">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3/4 h-3/4 relative">
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-blue-500/20 rounded-full animate-pulse"
                        style={{ animationDuration: "4s" }}
                      ></div>
                      <div
                        className="absolute inset-4 bg-gradient-to-r from-violet-500/30 to-blue-500/30 rounded-full animate-pulse"
                        style={{ animationDuration: "3s" }}
                      ></div>
                      <div
                        className="absolute inset-8 bg-gradient-to-r from-violet-500/40 to-blue-500/40 rounded-full animate-pulse"
                        style={{ animationDuration: "2s" }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Shield className="h-16 w-16 text-violet-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section
          id="problem"
          ref={problemRef}
          className="w-full py-12 md:py-24 lg:py-32 border-b border-zinc-800 opacity-0 transition-opacity duration-700"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-zinc-800 px-3 py-1 text-sm text-violet-400">The Problem</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                  Today&apos;s AI Agents Are Crippled by Blockchain&apos;s Fragmented Nature
                </h2>
                <p className="max-w-[900px] text-zinc-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  The current blockchain ecosystem forces inefficient capital allocation and limits AI agent
                  capabilities.
                </p>
              </div>
            </div>
            <motion.div
              className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="flex flex-col gap-4">
                <motion.div variants={fadeIn} custom={0}>
                  <Card className="bg-zinc-900 border-zinc-800 hover:border-violet-500/50 transition-all duration-300 hover:-translate-y-1">
                    <CardHeader>
                      <CardTitle className="text-white">Pre-Funding Requirements</CardTitle>
                    </CardHeader>
                    <CardContent className="text-zinc-400">
                      Agents need pre-funded wallets on every chain they operate on, creating significant capital
                      inefficiency.
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div variants={fadeIn} custom={1}>
                  <Card className="bg-zinc-900 border-zinc-800 hover:border-violet-500/50 transition-all duration-300 hover:-translate-y-1">
                    <CardHeader>
                      <CardTitle className="text-white">Slow & Expensive Bridging</CardTitle>
                    </CardHeader>
                    <CardContent className="text-zinc-400">
                      Moving assets between chains is slow, expensive, and capital-inefficient, limiting agent
                      responsiveness.
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
              <div className="flex flex-col gap-4">
                <motion.div variants={fadeIn} custom={2}>
                  <Card className="bg-zinc-900 border-zinc-800 hover:border-violet-500/50 transition-all duration-300 hover:-translate-y-1">
                    <CardHeader>
                      <CardTitle className="text-white">Idle Exchange Assets</CardTitle>
                    </CardHeader>
                    <CardContent className="text-zinc-400">
                      Centralized exchange assets sit idle rather than powering agent operations across multiple chains.
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div variants={fadeIn} custom={3}>
                  <Card className="bg-zinc-900 border-zinc-800 hover:border-violet-500/50 transition-all duration-300 hover:-translate-y-1">
                    <CardHeader>
                      <CardTitle className="text-white">Limited Credit Validation</CardTitle>
                    </CardHeader>
                    <CardContent className="text-zinc-400">
                      Credit facilities can&apos;t easily validate agent operations across chains, restricting financing
                      options.
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Solution Section */}
        <section
          id="solution"
          ref={solutionRef}
          className="w-full py-12 md:py-24 lg:py-32 border-b border-zinc-800 bg-zinc-900/30 opacity-0 transition-opacity duration-700"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-zinc-800 px-3 py-1 text-sm text-violet-400">
                  Our Solution
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                  ZK-Powered Financial Passport System
                </h2>
                <p className="max-w-[900px] text-zinc-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  ZKredit creates a unified financial layer where agents can prove asset backing without moving or
                  locking those assets.
                </p>
              </div>
            </div>
            <motion.div
              className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.div variants={fadeIn} custom={0}>
                <Card className="bg-zinc-900 border-zinc-800 hover:border-violet-500/50 transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <Wallet className="h-10 w-10 text-violet-500 mb-2" />
                    <CardTitle className="text-white">Asset Claim Circuit</CardTitle>
                    <CardDescription className="text-zinc-400">
                      Cryptographically proves an agent has access to specific assets
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-zinc-400">
                    <p>
                      Verifies assets on CEXs, other chains, or wallets without revealing exact balances or exposing
                      private information.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={fadeIn} custom={1}>
                <Card className="bg-zinc-900 border-zinc-800 hover:border-violet-500/50 transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <Key className="h-10 w-10 text-violet-500 mb-2" />
                    <CardTitle className="text-white">Agent Authority Circuit</CardTitle>
                    <CardDescription className="text-zinc-400">
                      Verifies agent permissions and spending limits
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-zinc-400">
                    <p>
                      Enables secure delegation across any chain without compromising the security of the primary wallet
                      or assets.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={fadeIn} custom={2}>
                <Card className="bg-zinc-900 border-zinc-800 hover:border-violet-500/50 transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <Database className="h-10 w-10 text-violet-500 mb-2" />
                    <CardTitle className="text-white">Credit Verification Circuit</CardTitle>
                    <CardDescription className="text-zinc-400">
                      Enables verifiable credit lines for agents
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-zinc-400">
                    <p>
                      Credit providers can issue credit based on performance history or off-chain KYC with cryptographic
                      verification.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* How It Works Section - Rest of the sections would follow similar pattern with animations */}
        <section
          id="how-it-works"
          ref={howItWorksRef}
          className="w-full py-12 md:py-24 lg:py-32 border-b border-zinc-800 opacity-0 transition-opacity duration-700"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-zinc-800 px-3 py-1 text-sm text-violet-400">
                  How It Works
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                  Seamless Cross-Chain Operations
                </h2>
                <p className="max-w-[900px] text-zinc-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our innovative system enables AI agents to operate across any blockchain without pre-funding or asset
                  bridging.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-5xl py-12">
              <div className="relative">
                {/* Flow diagram */}
                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-500 to-blue-500 transform -translate-x-1/2"></div>

                <motion.div
                  className="space-y-16 relative"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                >
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
                    variants={fadeIn}
                    custom={0}
                  >
                    <div className="md:text-right order-2 md:order-1">
                      <h3 className="text-xl font-bold text-white mb-2">Connect Assets</h3>
                      <p className="text-zinc-400">
                        The asset owner connects their CEX account, wallet, or secures a credit line through our secure
                        interface.
                      </p>
                    </div>
                    <div className="flex justify-center md:justify-start order-1 md:order-2">
                      <div className="w-16 h-16 rounded-full bg-zinc-800 border border-violet-500 flex items-center justify-center relative z-10">
                        <Wallet className="h-8 w-8 text-violet-500" />
                      </div>
                    </div>
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="flex justify-center md:justify-end">
                      <div className="w-16 h-16 rounded-full bg-zinc-800 border border-violet-500 flex items-center justify-center relative z-10">
                        <Shield className="h-8 w-8 text-violet-500" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Generate ZK Proofs</h3>
                      <p className="text-zinc-400">ZKredit generates zero-knowledge proofs of available &quot;spendable assets&quot; in a secure Trusted Execution Environment (TEE).</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="md:text-right order-2 md:order-1">
                      <h3 className="text-xl font-bold text-white mb-2">Issue Financial Passport</h3>
                      <p className="text-zinc-400">The agent receives these cryptographic &quot;financial passport&quot; credentials that verify asset backing without revealing sensitive details.</p>
                    </div>
                    <div className="flex justify-center md:justify-start order-1 md:order-2">
                      <div className="w-16 h-16 rounded-full bg-zinc-800 border border-violet-500 flex items-center justify-center relative z-10">
                        <Key className="h-8 w-8 text-violet-500" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="flex justify-center md:justify-end">
                      <div className="w-16 h-16 rounded-full bg-zinc-800 border border-violet-500 flex items-center justify-center relative z-10">
                        <Globe className="h-8 w-8 text-violet-500" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Cross-Chain Operation</h3>
                      <p className="text-zinc-400">When operating on any chain, the agent presents its ZK proofs to verify asset backing without pre-funding.</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="md:text-right order-2 md:order-1">
                      <h3 className="text-xl font-bold text-white mb-2">Verification & Execution</h3>
                      <p className="text-zinc-400">Our ZK-verifying paymaster validates the claims and allows operation without requiring assets on the target chain.</p>
                    </div>
                    <div className="flex justify-center md:justify-start order-1 md:order-2">
                      <div className="w-16 h-16 rounded-full bg-zinc-800 border border-violet-500 flex items-center justify-center relative z-10">
                        <Cpu className="h-8 w-8 text-violet-500" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="flex justify-center md:justify-end">
                      <div className="w-16 h-16 rounded-full bg-zinc-800 border border-violet-500 flex items-center justify-center relative z-10">
                        <RefreshCw className="h-8 w-8 text-violet-500" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Intelligent Settlement</h3>
                      <p className="text-zinc-400">Settlement happens after completion, debiting the original source with optimized paths for maximum capital efficiency.</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Innovations Section */}
        <section
          id="innovations"
          ref={innovationsRef}
          className="w-full py-12 md:py-24 lg:py-32 border-b border-zinc-800 bg-zinc-900/30 opacity-0 transition-opacity duration-700"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-zinc-800 px-3 py-1 text-sm text-violet-400">
                  Key Innovations
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                  Revolutionary Blockchain Infrastructure
                </h2>
                <p className="max-w-[900px] text-zinc-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  ZKredit transforms how agent networks interact with blockchain infrastructure.
                </p>
              </div>
            </div>
            <motion.div
              className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-4"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.div variants={fadeIn} custom={0}>
                <Card className="bg-zinc-900 border-zinc-800 hover:border-violet-500/50 transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <Network className="h-10 w-10 text-violet-500 mb-2" />
                    <CardTitle className="text-white">True Cross-Chain Integration</CardTitle>
                  </CardHeader>
                  <CardContent className="text-zinc-400">
                    <p>Enables seamless agent operation across any blockchain without asset bridging or pre-funding.</p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={fadeIn} custom={1}>
                <Link href="/demo" className="block">
                  <Card className="bg-zinc-900 border-zinc-800 hover:border-violet-500/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                    <CardHeader>
                      <Database className="h-10 w-10 text-violet-500 mb-2" />
                      <CardTitle className="text-white">CEX Asset Activation</CardTitle>
                    </CardHeader>
                    <CardContent className="text-zinc-400">
                      <p>
                        Allows exchange assets to power agent operations without withdrawal, maximizing capital
                        efficiency.
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
              <motion.div variants={fadeIn} custom={2}>
                <Card className="bg-zinc-900 border-zinc-800 hover:border-violet-500/50 transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <CreditCard className="h-10 w-10 text-violet-500 mb-2" />
                    <CardTitle className="text-white">Credit-Based Operations</CardTitle>
                  </CardHeader>
                  <CardContent className="text-zinc-400">
                    <p>
                      Opens new financing models for successful agent strategies with verifiable performance history.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={fadeIn} custom={3}>
                <Card className="bg-zinc-900 border-zinc-800 hover:border-violet-500/50 transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <Lock className="h-10 w-10 text-violet-500 mb-2" />
                    <CardTitle className="text-white">Privacy-Preserving</CardTitle>
                  </CardHeader>
                  <CardContent className="text-zinc-400">
                    <p>
                      Balance amounts and sources remain private while proving solvency through zero-knowledge proofs.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 bg-zinc-950 border-t border-zinc-800">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-violet-500" />
              <span className="text-lg font-bold bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent">
                ZKredit.xyz
              </span>
            </div>
            <p className="text-sm text-zinc-500">© 2023 ZKredit. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
                Twitter
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
                Discord
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
                GitHub
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

