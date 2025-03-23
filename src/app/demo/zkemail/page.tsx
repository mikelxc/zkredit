"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, ArrowRight, Check, Copy, Mail, Shield, Wallet } from "lucide-react"
import Navbar from "@/components/navbar"
import PageTransition from "@/components/page-transition"

export default function ZKEmailVerificationPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [verificationSent, setVerificationSent] = useState(false)
  const [transactionCompleted, setTransactionCompleted] = useState(false)
  const walletAddress = "0x93F...E45C"

  const sendVerificationEmail = () => {
    if (!email) return

    setLoading(true)

    // Simulate sending verification email
    setTimeout(() => {
      setVerificationSent(true)
      setVerificationCode("ZK-" + Math.floor(100000 + Math.random() * 900000))
      setLoading(false)
    }, 1500)
  }

  const verifyEmail = () => {
    if (!verificationCode) return

    setLoading(true)

    // Simulate email verification
    setTimeout(() => {
      setEmailVerified(true)
      setStep(2)
      setLoading(false)
    }, 1500)
  }

  const generateProof = () => {
    setLoading(true)

    // Simulate proof generation
    setTimeout(() => {
      setProofGenerated(true)
      setStep(3)
      setLoading(false)
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
    setEmail("")
    setVerificationCode("")
    setVerificationSent(false)
    setEmailVerified(false)
    setProofGenerated(false)
    setTransactionCompleted(false)
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
                    ZKEmail Domain Verification
                  </h1>
                  <p className="max-w-[700px] mx-auto text-zinc-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Verify email ownership with cryptographic certainty. Great for linking institutional identities to
                    on-chain actions.
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
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <span className="mt-2 text-sm text-zinc-400">Verify Email</span>
                  </div>
                  <div className="flex-1 flex items-center">
                    <div className={`h-1 w-full ${step >= 2 ? "bg-violet-600" : "bg-zinc-800"}`}></div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? "bg-violet-600" : "bg-zinc-800"}`}
                    >
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <span className="mt-2 text-sm text-zinc-400">Generate Proof</span>
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

              {/* Step 1: Verify Email */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                      <CardTitle>Verify Your Email Address</CardTitle>
                      <CardDescription className="text-zinc-400">
                        Verify your email ownership to create a zero-knowledge proof of your institutional identity.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {!verificationSent ? (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Institutional Email Address</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="you@institution.edu"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="bg-zinc-800 border-zinc-700"
                            />
                            <p className="text-zinc-500 text-xs">
                              Enter your institutional email address to verify your affiliation.
                            </p>
                          </div>

                          <div className="bg-zinc-800/50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2 text-violet-400">How This Works</h4>
                            <p className="text-zinc-400 text-sm">
                              We&apos;ll send a verification email to your institutional address. Once verified, we&apos;ll
                              generate a zero-knowledge proof of your email ownership without revealing your actual
                              email address on-chain.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="bg-violet-900/20 border border-violet-900/50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Mail className="h-5 w-5 text-violet-400" />
                              <h4 className="font-semibold text-violet-400">Verification Email Sent</h4>
                            </div>
                            <p className="text-zinc-400 text-sm">
                              A verification email has been sent to <span className="font-semibold">{email}</span>.
                              Please check your inbox and enter the verification code below.
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="verification-code">Verification Code</Label>
                            <div className="flex gap-2">
                              <Input
                                id="verification-code"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                className="bg-zinc-800 border-zinc-700"
                                readOnly
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                className="border-zinc-700"
                                onClick={() => {
                                  navigator.clipboard.writeText(verificationCode)
                                }}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-zinc-500 text-xs">
                              For demo purposes, the verification code is automatically filled in.
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      {!verificationSent ? (
                        <Button
                          onClick={sendVerificationEmail}
                          disabled={loading || !email}
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
                              Sending...
                            </>
                          ) : (
                            <>
                              Send Verification Email <Mail className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button
                          onClick={verifyEmail}
                          disabled={loading || !verificationCode}
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
                              Verify Email <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </motion.div>
              )}

              {/* Step 2: Generate Proof */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                      <CardTitle>Generate Zero-Knowledge Proof</CardTitle>
                      <CardDescription className="text-zinc-400">
                        Generate a cryptographic proof of your email ownership without revealing your actual email
                        address.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="bg-green-900/20 border border-green-900/50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Check className="h-5 w-5 text-green-500" />
                          <h4 className="font-semibold text-green-400">Email Verified Successfully</h4>
                        </div>
                        <p className="text-zinc-400 text-sm">
                          Your email <span className="font-semibold">{email}</span> has been verified. Now you can
                          generate a zero-knowledge proof of your email ownership.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-zinc-800/50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Email Properties</h4>
                          <ul className="space-y-2 text-zinc-400 text-sm">
                            <li className="flex justify-between">
                              <span>Email:</span>
                              <span className="font-semibold">{email}</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Domain:</span>
                              <span className="font-semibold">{email.split("@")[1]}</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Verification Method:</span>
                              <span className="font-semibold">DKIM Signature</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Timestamp:</span>
                              <span className="font-semibold">{new Date().toLocaleString()}</span>
                            </li>
                          </ul>
                        </div>

                        <div className="bg-zinc-800/50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">ZK Proof Will Verify</h4>
                          <ul className="space-y-2 text-zinc-400 text-sm">
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Email is from the specified domain</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>DKIM signature is valid</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Email was sent to the wallet owner</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Verification is recent (within 24 hours)</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-zinc-800/50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2 text-violet-400">How ZKEmail Works</h4>
                        <p className="text-zinc-400 text-sm">
                          ZKEmail uses zero-knowledge proofs to verify properties of your email without revealing the
                          email itself. The proof will verify that you own an email address from a specific domain
                          (e.g., a university or company) without revealing your actual email address on-chain.
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" onClick={() => setStep(1)} className="border-zinc-700">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                      </Button>
                      <Button
                        onClick={generateProof}
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
                            Generating Proof...
                          </>
                        ) : (
                          <>
                            Generate Proof <Shield className="ml-2 h-4 w-4" />
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
                      <CardTitle>Execute Transaction with Email Verification</CardTitle>
                      <CardDescription className="text-zinc-400">
                        Use your verified email identity to execute transactions with institutional backing.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="bg-violet-900/20 border border-violet-900/50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="h-5 w-5 text-violet-400" />
                          <h4 className="font-semibold text-violet-400">Email Proof Generated</h4>
                        </div>
                        <div className="space-y-2 text-zinc-400 text-sm">
                          <p>
                            Your zero-knowledge proof of email ownership has been generated. This proof verifies that
                            you own an email address from <span className="font-semibold">{email.split("@")[1]}</span>{" "}
                            without revealing your actual email address.
                          </p>
                          <p>
                            Wallet Address: <span className="font-mono text-violet-400">{walletAddress}</span>
                          </p>
                          <p>
                            Verified Domain: <span className="font-semibold">{email.split("@")[1]}</span>
                          </p>
                        </div>
                      </div>

                      {!transactionCompleted ? (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Transaction Type</Label>
                            <Tabs defaultValue="institutional" className="w-full">
                              <TabsList className="grid grid-cols-2 bg-zinc-800">
                                <TabsTrigger value="institutional">Institutional Transaction</TabsTrigger>
                                <TabsTrigger value="personal">Personal Transaction</TabsTrigger>
                              </TabsList>
                              <TabsContent value="institutional" className="pt-4">
                                <p className="text-zinc-400 text-sm">
                                  Execute a transaction that requires institutional affiliation verification. Your email
                                  proof will be used to verify your affiliation without revealing your identity.
                                </p>
                              </TabsContent>
                              <TabsContent value="personal" className="pt-4">
                                <p className="text-zinc-400 text-sm">
                                  Execute a personal transaction with the added trust of institutional verification.
                                  Your email proof adds an extra layer of trust to your transaction.
                                </p>
                              </TabsContent>
                            </Tabs>
                          </div>

                          <div className="space-y-2">
                            <Label>Transaction Details</Label>
                            <div className="bg-zinc-800/50 p-4 rounded-lg">
                              <ul className="space-y-2 text-zinc-400 text-sm">
                                <li className="flex justify-between">
                                  <span>Transaction Type:</span>
                                  <span className="font-semibold">Research Grant Distribution</span>
                                </li>
                                <li className="flex justify-between">
                                  <span>Amount:</span>
                                  <span className="font-semibold">$5,000</span>
                                </li>
                                <li className="flex justify-between">
                                  <span>Recipient:</span>
                                  <span className="font-semibold">Research Lab Wallet</span>
                                </li>
                                <li className="flex justify-between">
                                  <span>Required Verification:</span>
                                  <span className="font-semibold">Institutional Email</span>
                                </li>
                              </ul>
                            </div>
                          </div>

                          <div className="bg-zinc-800/50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2 text-violet-400">How This Works</h4>
                            <p className="text-zinc-400 text-sm">
                              When you execute this transaction, your zero-knowledge proof will be submitted to verify
                              your institutional affiliation. The transaction will be processed if you are verified as a
                              member of the required institution, without revealing your actual email address.
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
                                Your transaction for <span className="font-semibold">$5,000</span> to
                                <span className="font-semibold"> Research Lab Wallet</span> has been executed
                                successfully.
                              </p>
                              <p>
                                Transaction Hash: <span className="font-mono text-violet-400">0x45D...B28A</span>
                              </p>
                              <p>
                                Institutional Verification: <span className="font-semibold">Confirmed</span>
                              </p>
                            </div>
                          </div>

                          <div className="bg-zinc-800/50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2 text-violet-400">What Happened Behind the Scenes</h4>
                            <ol className="space-y-2 text-zinc-400 text-sm list-decimal pl-5">
                              <li>Your email verification was processed through the ZKEmail circuit</li>
                              <li>A zero-knowledge proof was generated verifying your institutional affiliation</li>
                              <li>The proof was verified on-chain without revealing your email address</li>
                              <li>The transaction was executed with institutional verification</li>
                              <li>Your privacy was maintained throughout the process</li>
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

