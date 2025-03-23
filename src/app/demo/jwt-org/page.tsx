"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, ArrowRight, Check, Key, Shield, Users, Wallet } from "lucide-react"
import Navbar from "@/components/navbar"
import PageTransition from "@/components/page-transition"

export default function JWTOrgVerificationPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [organization, setOrganization] = useState("")
  const [department, setDepartment] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const [spendingLimit, setSpendingLimit] = useState(10000)
  const [transactionCompleted, setTransactionCompleted] = useState(false)

  const handleLogin = () => {
    if (!email || !password) return

    setLoading(true)

    // Simulate login and JWT verification
    setTimeout(() => {
      setOrganization("Acme Corporation")
      setDepartment("Engineering")
      setLoading(false)
      setStep(2)
    }, 1500)
  }

  const createWallet = () => {
    setLoading(true)

    // Simulate wallet creation
    setTimeout(() => {
      setWalletAddress("0x71C...F29E")
      setLoading(false)
      setStep(3)
    }, 2000)
  }

  const executeTransaction = () => {
    setLoading(true)

    // Simulate transaction execution
    setTimeout(() => {
      setTransactionCompleted(true)
      setLoading(false)
    }, 2000)
  }

  const resetDemo = () => {
    setStep(1)
    setTransactionCompleted(false)
    setEmail("")
    setPassword("")
    setWalletAddress("")
  }

  return (
    <div className="flex min-h-screen flex-col dark">
      <Navbar />

      <PageTransition>
        <main className="flex-1 bg-zinc-950 text-white">
          <section className="w-full py-12 md:py-24 border-b border-zinc-800">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <Link
                    href="/demo"
                    className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to demo
                  </Link>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                    JWT Organization Verification
                  </h1>
                  <p className="max-w-[700px] mx-auto text-zinc-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Prove membership in your organization without revealing personal details using zero-knowledge
                    proofs.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="container px-4 py-12 md:px-6 md:py-24">
            <div className="mx-auto max-w-5xl">
              {/* Progress Steps */}
              <div className="mb-12">
                <div className="flex justify-between">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? "bg-violet-600" : "bg-zinc-800"}`}
                    >
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <span className="mt-2 text-sm text-zinc-400">Organization Login</span>
                  </div>
                  <div className="flex-1 flex items-center">
                    <div className={`h-1 w-full ${step >= 2 ? "bg-violet-600" : "bg-zinc-800"}`}></div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? "bg-violet-600" : "bg-zinc-800"}`}
                    >
                      <Key className="h-5 w-5 text-white" />
                    </div>
                    <span className="mt-2 text-sm text-zinc-400">Create Wallet</span>
                  </div>
                  <div className="flex-1 flex items-center">
                    <div className={`h-1 w-full ${step >= 3 ? "bg-violet-600" : "bg-zinc-800"}`}></div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? "bg-violet-600" : "bg-zinc-800"}`}
                    >
                      <Wallet className="h-5 w-5 text-white" />
                    </div>
                    <span className="mt-2 text-sm text-zinc-400">Execute Transaction</span>
                  </div>
                </div>
              </div>

              {/* Step 1: Organization Login */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                      <CardTitle>Login with Your Organization Account</CardTitle>
                      <CardDescription className="text-zinc-400">
                        Sign in with your Google Workspace account to verify your organization membership.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-zinc-800 border-zinc-700"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="password">Password</Label>
                          <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-zinc-800 border-zinc-700"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="bg-zinc-800 p-2 rounded-full">
                          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                              fill="#4285F4"
                            />
                            <path
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                              fill="#34A853"
                            />
                            <path
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                              fill="#FBBC05"
                            />
                            <path
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                              fill="#EA4335"
                            />
                          </svg>
                        </div>
                        <div className="text-zinc-400 text-sm">
                          <p className="font-semibold">Sign in with Google Workspace</p>
                          <p>Verify your organization membership securely</p>
                        </div>
                      </div>

                      <div className="bg-zinc-800/50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2 text-violet-400">How This Works</h4>
                        <p className="text-zinc-400 text-sm">
                          When you sign in, we&apos;ll verify your organization membership using your Google Workspace JWT
                          token. A zero-knowledge proof will be generated to prove your membership without revealing
                          your personal details.
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button
                        onClick={handleLogin}
                        disabled={loading || !email || !password}
                        className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700"
                      >
                        {loading ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Verifying...
                          </>
                        ) : (
                          <>
                            Sign In <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              )}

              {/* Step 2: Create Wallet */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                      <CardTitle>Create Organization Wallet</CardTitle>
                      <CardDescription className="text-zinc-400">
                        Create a wallet linked to your organization membership with customized spending limits.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="bg-violet-900/20 border border-violet-900/50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Check className="h-5 w-5 text-violet-400" />
                          <h4 className="font-semibold text-violet-400">Organization Membership Verified</h4>
                        </div>
                        <div className="space-y-2 text-zinc-400 text-sm">
                          <p>
                            Your membership in <span className="font-semibold">{organization}</span> has been verified
                            using a zero-knowledge proof.
                          </p>
                          <p>
                            Department: <span className="font-semibold">{department}</span>
                          </p>
                          <p>
                            Email: <span className="font-semibold">{email}</span>
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="spending-limit">Spending Limit (USD)</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
                            <Input
                              id="spending-limit"
                              type="number"
                              value={spendingLimit}
                              onChange={(e) => setSpendingLimit(Number.parseInt(e.target.value) || 0)}
                              className="pl-8 bg-zinc-800 border-zinc-700"
                            />
                          </div>
                          <p className="text-zinc-500 text-xs">
                            This is the maximum amount that can be spent using this wallet.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label>Wallet Type</Label>
                          <Tabs defaultValue="organization" className="w-full">
                            <TabsList className="grid grid-cols-2 bg-zinc-800">
                              <TabsTrigger value="organization">Organization Wallet</TabsTrigger>
                              <TabsTrigger value="personal">Personal Wallet</TabsTrigger>
                            </TabsList>
                            <TabsContent value="organization" className="pt-4">
                              <p className="text-zinc-400 text-sm">
                                An organization wallet is linked to your company membership and can be used for company
                                expenses. Transactions will require organization membership verification.
                              </p>
                            </TabsContent>
                            <TabsContent value="personal" className="pt-4">
                              <p className="text-zinc-400 text-sm">
                                A personal wallet is linked to your individual identity but can still leverage your
                                organization membership for certain transactions.
                              </p>
                            </TabsContent>
                          </Tabs>
                        </div>
                      </div>

                      <div className="bg-zinc-800/50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2 text-violet-400">How This Works</h4>
                        <p className="text-zinc-400 text-sm">
                          Your organization wallet will be linked to your verified membership. When you make
                          transactions, a zero-knowledge proof will verify your membership without revealing your
                          identity. The spending limit will be enforced on-chain.
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" onClick={() => setStep(1)} className="border-zinc-700">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                      </Button>
                      <Button
                        onClick={createWallet}
                        disabled={loading}
                        className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700"
                      >
                        {loading ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Creating Wallet...
                          </>
                        ) : (
                          <>
                            Create Wallet <Key className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              )}

              {/* Step 3: Execute Transaction */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                      <CardTitle>Execute Organization Transaction</CardTitle>
                      <CardDescription className="text-zinc-400">
                        Use your organization wallet to execute transactions with verified membership.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-violet-900/20 border border-violet-900/50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Check className="h-5 w-5 text-violet-400" />
                            <h4 className="font-semibold text-violet-400">Organization Wallet Created</h4>
                          </div>
                          <div className="space-y-2 text-zinc-400 text-sm">
                            <p>
                              Wallet Address: <span className="font-mono text-violet-400">{walletAddress}</span>
                            </p>
                            <p>
                              Organization: <span className="font-semibold">{organization}</span>
                            </p>
                            <p>
                              Spending Limit: <span className="font-semibold">${spendingLimit.toLocaleString()}</span>
                            </p>
                          </div>
                        </div>

                        <div className="bg-zinc-800/50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2 text-violet-400">Membership Verification</h4>
                          <ul className="space-y-2 text-zinc-400 text-sm">
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>JWT signature verified</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Organization domain confirmed</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Group membership validated</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Zero-knowledge proof generated</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      {!transactionCompleted ? (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Transaction Type</Label>
                            <Tabs defaultValue="purchase" className="w-full">
                              <TabsList className="grid grid-cols-3 bg-zinc-800">
                                <TabsTrigger value="purchase">Purchase</TabsTrigger>
                                <TabsTrigger value="subscription">Subscription</TabsTrigger>
                                <TabsTrigger value="transfer">Transfer</TabsTrigger>
                              </TabsList>
                              <TabsContent value="purchase" className="pt-4">
                                <p className="text-zinc-400 text-sm">
                                  Make a one-time purchase using your organization wallet. This transaction will be
                                  verified against your organization membership and spending limit.
                                </p>
                              </TabsContent>
                              <TabsContent value="subscription" className="pt-4">
                                <p className="text-zinc-400 text-sm">
                                  Set up a recurring subscription payment. Your organization membership will be verified
                                  for each payment cycle.
                                </p>
                              </TabsContent>
                              <TabsContent value="transfer" className="pt-4">
                                <p className="text-zinc-400 text-sm">
                                  Transfer funds to another wallet. This transaction will require organization
                                  membership verification and will be subject to your spending limit.
                                </p>
                              </TabsContent>
                            </Tabs>
                          </div>

                          <div className="space-y-2">
                            <Label>Transaction Amount</Label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
                              <Input type="number" value="2500" className="pl-8 bg-zinc-800 border-zinc-700" readOnly />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Merchant</Label>
                            <Input
                              type="text"
                              value="SaaS Enterprise Solutions"
                              className="bg-zinc-800 border-zinc-700"
                              readOnly
                            />
                          </div>

                          <div className="bg-zinc-800/50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2 text-violet-400">How This Works</h4>
                            <p className="text-zinc-400 text-sm">
                              When you execute this transaction, your organization membership will be verified using a
                              zero-knowledge proof. The transaction will be processed if you are a verified member and
                              the amount is within your spending limit.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="bg-green-900/20 border border-green-900/50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Check className="h-5 w-5 text-green-500" />
                              <h4 className="font-semibold text-green-400">Transaction Completed Successfully</h4>
                            </div>
                            <div className="space-y-2 text-zinc-400 text-sm">
                              <p>
                                Your transaction for <span className="font-semibold">$2,500</span> to
                                <span className="font-semibold"> SaaS Enterprise Solutions</span> has been executed
                                successfully.
                              </p>
                              <p>
                                Transaction Hash: <span className="font-mono text-violet-400">0x82D...A37B</span>
                              </p>
                              <p>
                                Remaining Spending Limit:{" "}
                                <span className="font-semibold">${(spendingLimit - 2500).toLocaleString()}</span>
                              </p>
                            </div>
                          </div>

                          <div className="bg-zinc-800/50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2 text-violet-400">What Happened Behind the Scenes</h4>
                            <ol className="space-y-2 text-zinc-400 text-sm list-decimal pl-5">
                              <li>Your JWT token was verified using the Noir zero-knowledge circuit</li>
                              <li>
                                A proof of your organization membership was generated without revealing your identity
                              </li>
                              <li>The proof was verified on-chain to confirm your membership</li>
                              <li>The transaction was executed using your organization wallet</li>
                              <li>The spending limit was updated to reflect the transaction</li>
                            </ol>
                          </div>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      {!transactionCompleted ? (
                        <>
                          <Button variant="outline" onClick={() => setStep(2)} className="border-zinc-700">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                          </Button>
                          <Button
                            onClick={executeTransaction}
                            disabled={loading}
                            className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700"
                          >
                            {loading ? (
                              <>
                                <svg
                                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                                Processing Transaction...
                              </>
                            ) : (
                              <>
                                Execute Transaction <Wallet className="ml-2 h-4 w-4" />
                              </>
                            )}
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="outline" onClick={resetDemo} className="border-zinc-700">
                            Restart Demo
                          </Button>
                          <Link href="/demo">
                            <Button className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700">
                              Back to All Demos <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                        </>
                      )}
                    </CardFooter>
                  </Card>
                </motion.div>
              )}
            </div>
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
            <p className="text-sm text-zinc-500">© 2025 ZKredit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

