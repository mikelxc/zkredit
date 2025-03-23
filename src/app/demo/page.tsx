"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Wallet, Key, Database, ArrowLeft, Check, ChevronRight } from "lucide-react"
import Navbar from "@/components/navbar"
import PageTransition from "@/components/page-transition"

export default function DemoPage() {
  const [activeStep, setActiveStep] = useState(1)
  const [connected, setConnected] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [verified, setVerified] = useState(false)

  const handleStepComplete = (step: number) => {
    if (step === 1) setConnected(true)
    if (step === 2) setGenerated(true)
    if (step === 3) setVerified(true)

    if (step < 4) setActiveStep(step + 1)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="flex min-h-screen flex-col dark">
      <Navbar />

      <PageTransition>
        <main className="flex-1 bg-zinc-950 text-white">
          <section className="container px-4 py-12 md:px-6 md:py-24">
            <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
              <div>
                <Link
                  href="/"
                  className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to home
                </Link>
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">ZKredit Demo</h1>
                <p className="mt-4 max-w-[700px] text-zinc-400 md:text-xl">
                  Experience how ZKredit enables AI agents to operate across multiple blockchains without pre-funding or
                  asset transfers.
                </p>
              </div>
            </div>

            <div className="mt-12 space-y-8">
              <Tabs defaultValue="interactive" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
                  <TabsTrigger value="interactive">Interactive Demo</TabsTrigger>
                  <TabsTrigger value="sandbox">Sandbox</TabsTrigger>
                </TabsList>

                <TabsContent value="interactive" className="space-y-4">
                  <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-900/30">
                    <div className="space-y-2 mb-8">
                      <h2 className="text-2xl font-bold">Interactive Walkthrough</h2>
                      <p className="text-zinc-400">Follow these steps to see how ZKredit works in action.</p>
                    </div>

                    <div className="flex flex-col md:flex-row mb-8 gap-4">
                      <div className="md:w-1/3">
                        <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-900">
                          <ul className="space-y-4">
                            <li
                              className={`flex items-center gap-3 p-3 rounded-md ${activeStep === 1 ? "bg-violet-900/20 border border-violet-500/30" : ""}`}
                            >
                              <div
                                className={`flex h-8 w-8 items-center justify-center rounded-full ${connected ? "bg-violet-500" : "bg-zinc-800"}`}
                              >
                                {connected ? (
                                  <Check className="h-4 w-4 text-white" />
                                ) : (
                                  <span className="text-sm">1</span>
                                )}
                              </div>
                              <div>
                                <p className={`font-medium ${activeStep === 1 ? "text-white" : "text-zinc-400"}`}>
                                  Connect Assets
                                </p>
                              </div>
                            </li>
                            <li
                              className={`flex items-center gap-3 p-3 rounded-md ${activeStep === 2 ? "bg-violet-900/20 border border-violet-500/30" : ""}`}
                            >
                              <div
                                className={`flex h-8 w-8 items-center justify-center rounded-full ${generated ? "bg-violet-500" : "bg-zinc-800"}`}
                              >
                                {generated ? (
                                  <Check className="h-4 w-4 text-white" />
                                ) : (
                                  <span className="text-sm">2</span>
                                )}
                              </div>
                              <div>
                                <p className={`font-medium ${activeStep === 2 ? "text-white" : "text-zinc-400"}`}>
                                  Generate Proof
                                </p>
                              </div>
                            </li>
                            <li
                              className={`flex items-center gap-3 p-3 rounded-md ${activeStep === 3 ? "bg-violet-900/20 border border-violet-500/30" : ""}`}
                            >
                              <div
                                className={`flex h-8 w-8 items-center justify-center rounded-full ${verified ? "bg-violet-500" : "bg-zinc-800"}`}
                              >
                                {verified ? (
                                  <Check className="h-4 w-4 text-white" />
                                ) : (
                                  <span className="text-sm">3</span>
                                )}
                              </div>
                              <div>
                                <p className={`font-medium ${activeStep === 3 ? "text-white" : "text-zinc-400"}`}>
                                  Verify Credentials
                                </p>
                              </div>
                            </li>
                            <li
                              className={`flex items-center gap-3 p-3 rounded-md ${activeStep === 4 ? "bg-violet-900/20 border border-violet-500/30" : ""}`}
                            >
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800">
                                <span className="text-sm">4</span>
                              </div>
                              <div>
                                <p className={`font-medium ${activeStep === 4 ? "text-white" : "text-zinc-400"}`}>
                                  Execute Cross-Chain
                                </p>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="md:w-2/3">
                        <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-900 h-full">
                          {activeStep === 1 && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="space-y-6"
                            >
                              <h3 className="text-xl font-bold">Connect Your Assets</h3>
                              <p className="text-zinc-400">
                                Connect your wallet or CEX account to generate zero-knowledge proofs of your assets
                                without revealing exact balances.
                              </p>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                                <Button
                                  variant="outline"
                                  className="border-zinc-700 hover:border-violet-500 transition-all h-20 flex flex-col gap-2"
                                >
                                  <Wallet className="h-5 w-5" />
                                  Connect Wallet
                                </Button>
                                <Link href="/dashboard">
                                  <Button
                                    variant="outline"
                                    className="border-zinc-700 hover:border-violet-500 transition-all h-20 flex flex-col gap-2"
                                  >
                                    <Database className="h-5 w-5" />
                                    Connect Exchange
                                  </Button>
                                </Link>
                              </div>

                              <Button
                                className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700"
                                onClick={() => handleStepComplete(1)}
                              >
                                Connect Demo Wallet
                              </Button>
                            </motion.div>
                          )}

                          {activeStep === 2 && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="space-y-6"
                            >
                              <h3 className="text-xl font-bold">Generate ZK Proof</h3>
                              <p className="text-zinc-400">
                                Generate a zero-knowledge proof of your assets that can be verified without revealing
                                sensitive information.
                              </p>

                              <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-900/50 my-6">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm text-zinc-400">Connected Wallet</p>
                                    <p className="font-mono text-sm">0x71C...F29E</p>
                                  </div>
                                  <div>
                                    <div className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-full">
                                      Connected
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-zinc-800">
                                  <p className="text-sm text-zinc-400">Available Assets</p>
                                  <ul className="mt-2 space-y-2">
                                    <li className="flex justify-between">
                                      <span>ETH</span>
                                      <span>10.0</span>
                                    </li>
                                    <li className="flex justify-between">
                                      <span>USDC</span>
                                      <span>25,000</span>
                                    </li>
                                  </ul>
                                </div>
                              </div>

                              <Button
                                className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700"
                                onClick={() => handleStepComplete(2)}
                              >
                                Generate Proof
                              </Button>
                            </motion.div>
                          )}

                          {activeStep === 3 && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="space-y-6"
                            >
                              <h3 className="text-xl font-bold">Verify Financial Passport</h3>
                              <p className="text-zinc-400">
                                Your ZK proof can now be verified by any compatible service without revealing your exact
                                balances or asset locations.
                              </p>

                              <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-900/50 my-6">
                                <div className="flex items-center space-x-2 mb-4">
                                  <Shield className="h-5 w-5 text-violet-500" />
                                  <h4 className="font-medium">Financial Passport</h4>
                                </div>

                                <div className="space-y-4">
                                  <div className="p-3 border border-zinc-800 rounded-md bg-zinc-950">
                                    <p className="text-sm text-zinc-400">Asset Verification</p>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <Check className="h-4 w-4 text-green-500" />
                                      <p className="text-sm">Assets verified with ZK proof</p>
                                    </div>
                                  </div>

                                  <div className="p-3 border border-zinc-800 rounded-md bg-zinc-950">
                                    <p className="text-sm text-zinc-400">Amount Threshold</p>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <Check className="h-4 w-4 text-green-500" />
                                      <p className="text-sm">Verified assets exceed 5,000 USDC</p>
                                    </div>
                                  </div>

                                  <div className="p-3 border border-zinc-800 rounded-md bg-zinc-950">
                                    <p className="text-sm text-zinc-400">ZK Credential</p>
                                    <p className="font-mono text-xs mt-1 text-zinc-300 truncate">
                                      zk:cred:71c...f29e:xxHash:9a8f...
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <Button
                                className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700"
                                onClick={() => handleStepComplete(3)}
                              >
                                Verify Passport
                              </Button>
                            </motion.div>
                          )}

                          {activeStep === 4 && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="space-y-6"
                            >
                              <h3 className="text-xl font-bold">Execute Cross-Chain Operation</h3>
                              <p className="text-zinc-400">
                                Now you can execute operations on any supported chain without pre-funding or
                                transferring assets.
                              </p>

                              <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-900/50 my-6">
                                <div className="flex flex-col md:flex-row gap-4">
                                  <div className="flex-1 p-3 border border-zinc-800 rounded-md bg-zinc-950">
                                    <p className="text-sm text-zinc-400">Source Chain</p>
                                    <p className="font-medium mt-1">Ethereum</p>
                                  </div>
                                  <div className="flex items-center justify-center">
                                    <ChevronRight className="h-6 w-6 text-zinc-500" />
                                  </div>
                                  <div className="flex-1 p-3 border border-zinc-800 rounded-md bg-zinc-950">
                                    <p className="text-sm text-zinc-400">Target Chain</p>
                                    <select className="w-full bg-transparent border-0 focus:ring-0 p-0 text-white mt-1">
                                      <option value="arbitrum">Arbitrum</option>
                                      <option value="optimism">Optimism</option>
                                      <option value="polygon">Polygon</option>
                                      <option value="base">Base</option>
                                    </select>
                                  </div>
                                </div>

                                <div className="mt-4 p-3 border border-zinc-800 rounded-md bg-zinc-950">
                                  <p className="text-sm text-zinc-400">Action</p>
                                  <select className="w-full bg-transparent border-0 focus:ring-0 p-0 text-white mt-1">
                                    <option value="swap">Swap Tokens</option>
                                    <option value="bridge">Bridge Assets</option>
                                    <option value="lend">Lend Assets</option>
                                  </select>
                                </div>
                              </div>

                              <Button className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700">
                                Execute Transaction
                              </Button>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="sandbox">
                  <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-900/30">
                    <div className="space-y-2 mb-8">
                      <h2 className="text-2xl font-bold">Sandbox Environment</h2>
                      <p className="text-zinc-400">
                        Experiment with different asset configurations and cross-chain operations.
                      </p>
                    </div>

                    <div className="p-8 flex items-center justify-center">
                      <p className="text-zinc-400">Sandbox environment coming soon...</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <motion.div
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <Card className="bg-zinc-900 border-zinc-800 hover:border-violet-500/50 transition-all duration-300">
                  <CardHeader>
                    <Shield className="h-10 w-10 text-violet-500 mb-2" />
                    <CardTitle className="text-white">Private by Design</CardTitle>
                    <CardDescription className="text-zinc-400">Keep your asset details private</CardDescription>
                  </CardHeader>
                  <CardContent className="text-zinc-400">
                    <p>Zero-knowledge proofs verify your assets without revealing exact balances or sources.</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="bg-zinc-900 border-zinc-800 hover:border-violet-500/50 transition-all duration-300">
                  <CardHeader>
                    <Wallet className="h-10 w-10 text-violet-500 mb-2" />
                    <CardTitle className="text-white">Capital Efficient</CardTitle>
                    <CardDescription className="text-zinc-400">No pre-funding required</CardDescription>
                  </CardHeader>
                  <CardContent className="text-zinc-400">
                    <p>Operate across any chain without locking assets or pre-funding wallets on each chain.</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="bg-zinc-900 border-zinc-800 hover:border-violet-500/50 transition-all duration-300">
                  <CardHeader>
                    <Key className="h-10 w-10 text-violet-500 mb-2" />
                    <CardTitle className="text-white">Secure Delegation</CardTitle>
                    <CardDescription className="text-zinc-400">For AI agents and more</CardDescription>
                  </CardHeader>
                  <CardContent className="text-zinc-400">
                    <p>Enable your AI agents to operate with verified asset backing across multiple blockchains.</p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </section>
        </main>
      </PageTransition>

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
          </div>
        </div>
      </footer>
    </div>
  )
}

