"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, ArrowRight, Check, Database, Lock, Shield, Wallet } from "lucide-react"
import Navbar from "@/components/navbar"
import PageTransition from "@/components/page-transition"

export default function SP1CreditVerificationPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [creditScore, setCreditScore] = useState(720)
  const [income, setIncome] = useState(75000)
  const [debt, setDebt] = useState(15000)
  const [creditLine, setCreditLine] = useState(0)
  const [proofGenerated, setProofGenerated] = useState(false)
  const [transactionAmount, setTransactionAmount] = useState(5000)
  const [transactionCompleted, setTransactionCompleted] = useState(false)

  const generateProof = () => {
    setLoading(true)

    // Simulate proof generation
    setTimeout(() => {
      // Calculate credit line based on credit score and debt-to-income ratio
      const debtToIncomeRatio = (debt / income) * 100
      let calculatedCreditLine = 0

      if (creditScore >= 750 && debtToIncomeRatio <= 30) {
        calculatedCreditLine = income / 3
      } else if (creditScore >= 700 && debtToIncomeRatio <= 35) {
        calculatedCreditLine = income / 4
      } else if (creditScore >= 650 && debtToIncomeRatio <= 40) {
        calculatedCreditLine = income / 5
      } else {
        calculatedCreditLine = income / 10
      }

      setCreditLine(Math.round(calculatedCreditLine))
      setProofGenerated(true)
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
    setProofGenerated(false)
    setTransactionCompleted(false)
    setCreditLine(0)
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
                    SP1 Credit Verification
                  </h1>
                  <p className="max-w-[700px] mx-auto text-zinc-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Prove your borrowing capacity without revealing sensitive financial information using zero-knowledge
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
                      <Database className="h-5 w-5 text-white" />
                    </div>
                    <span className="mt-2 text-sm text-zinc-400">Financial Data</span>
                  </div>
                  <div className="flex-1 flex items-center">
                    <div className={`h-1 w-full ${step >= 2 ? "bg-violet-600" : "bg-zinc-800"}`}></div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? "bg-violet-600" : "bg-zinc-800"}`}
                    >
                      <Lock className="h-5 w-5 text-white" />
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

              {/* Step 1: Financial Data */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                      <CardTitle>Enter Your Financial Information</CardTitle>
                      <CardDescription className="text-zinc-400">
                        This information will be used to generate a zero-knowledge proof of your credit-worthiness.
                        <span className="block mt-2 text-violet-400 font-semibold">
                          Your actual financial data will never be revealed on-chain.
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="credit-score">Credit Score</Label>
                          <span className="text-violet-400 font-semibold">{creditScore}</span>
                        </div>
                        <Slider
                          id="credit-score"
                          min={300}
                          max={850}
                          step={1}
                          value={[creditScore]}
                          onValueChange={(value) => setCreditScore(value[0])}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-zinc-500">
                          <span>Poor</span>
                          <span>Fair</span>
                          <span>Good</span>
                          <span>Excellent</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="annual-income">Annual Income (USD)</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
                          <Input
                            id="annual-income"
                            type="number"
                            value={income}
                            onChange={(e) => setIncome(Number.parseInt(e.target.value) || 0)}
                            className="pl-8 bg-zinc-800 border-zinc-700"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="total-debt">Total Debt (USD)</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
                          <Input
                            id="total-debt"
                            type="number"
                            value={debt}
                            onChange={(e) => setDebt(Number.parseInt(e.target.value) || 0)}
                            className="pl-8 bg-zinc-800 border-zinc-700"
                          />
                        </div>
                      </div>

                      <div className="bg-zinc-800/50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2 text-violet-400">How This Works</h4>
                        <p className="text-zinc-400 text-sm">
                          The SP1 zero-knowledge circuit will verify your credit-worthiness based on your credit score
                          and debt-to-income ratio. Only the proof of your eligibility will be shared, not your actual
                          financial data.
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button
                        onClick={() => setStep(2)}
                        className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700"
                      >
                        Continue <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
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
                        Generate a cryptographic proof of your credit-worthiness without revealing your financial
                        details.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-zinc-800/50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Financial Summary</h4>
                          <ul className="space-y-2 text-zinc-400">
                            <li className="flex justify-between">
                              <span>Credit Score:</span>
                              <span className="font-semibold">{creditScore}</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Annual Income:</span>
                              <span className="font-semibold">${income.toLocaleString()}</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Total Debt:</span>
                              <span className="font-semibold">${debt.toLocaleString()}</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Debt-to-Income Ratio:</span>
                              <span className="font-semibold">{((debt / income) * 100).toFixed(1)}%</span>
                            </li>
                          </ul>
                        </div>

                        <div className="bg-zinc-800/50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">SP1 Circuit Verification</h4>
                          <ul className="space-y-2 text-zinc-400">
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Credit score meets minimum requirements</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Debt-to-income ratio within acceptable range</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Income verification completed</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Financial stability confirmed</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      {proofGenerated ? (
                        <div className="bg-green-900/20 border border-green-900/50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className="h-5 w-5 text-green-500" />
                            <h4 className="font-semibold text-green-400">Proof Generated Successfully</h4>
                          </div>
                          <p className="text-zinc-400 text-sm mb-2">
                            Your zero-knowledge proof has been generated and verified. Your approved credit line is:
                          </p>
                          <p className="text-2xl font-bold text-green-400 text-center my-2">
                            ${creditLine.toLocaleString()}
                          </p>
                          <p className="text-zinc-400 text-sm">
                            This credit line can be used for transactions without revealing your financial details.
                          </p>
                        </div>
                      ) : (
                        <div className="bg-zinc-800/50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2 text-violet-400">How Zero-Knowledge Proofs Work</h4>
                          <p className="text-zinc-400 text-sm">
                            The SP1 circuit will process your financial data locally and generate a cryptographic proof
                            that verifies your credit-worthiness without revealing the actual data. Only the proof and
                            your approved credit line will be shared on-chain.
                          </p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" onClick={() => setStep(1)} className="border-zinc-700">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                      </Button>

                      {proofGenerated ? (
                        <Button
                          onClick={() => setStep(3)}
                          className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700"
                        >
                          Continue <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      ) : (
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
                              Generate Proof <Lock className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      )}
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
                      <CardTitle>Execute Transaction</CardTitle>
                      <CardDescription className="text-zinc-400">
                        Use your verified credit line to execute a transaction across any blockchain.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="bg-violet-900/20 border border-violet-900/50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="h-5 w-5 text-violet-400" />
                          <h4 className="font-semibold text-violet-400">Verified Credit Line</h4>
                        </div>
                        <p className="text-2xl font-bold text-violet-400 text-center my-2">
                          ${creditLine.toLocaleString()}
                        </p>
                        <p className="text-zinc-400 text-sm">
                          Your credit line has been verified using zero-knowledge proofs. You can now execute
                          transactions up to this amount without revealing your financial details.
                        </p>
                      </div>

                      {!transactionCompleted ? (
                        <>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="transaction-amount">Transaction Amount (USD)</Label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
                                <Input
                                  id="transaction-amount"
                                  type="number"
                                  value={transactionAmount}
                                  onChange={(e) => setTransactionAmount(Number.parseInt(e.target.value) || 0)}
                                  className="pl-8 bg-zinc-800 border-zinc-700"
                                  max={creditLine}
                                />
                              </div>
                              {transactionAmount > creditLine && (
                                <p className="text-red-400 text-sm">Transaction amount exceeds your credit line.</p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label>Select Blockchain</Label>
                              <Tabs defaultValue="ethereum" className="w-full">
                                <TabsList className="grid grid-cols-4 bg-zinc-800">
                                  <TabsTrigger value="ethereum">Ethereum</TabsTrigger>
                                  <TabsTrigger value="polygon">Polygon</TabsTrigger>
                                  <TabsTrigger value="arbitrum">Arbitrum</TabsTrigger>
                                  <TabsTrigger value="optimism">Optimism</TabsTrigger>
                                </TabsList>
                              </Tabs>
                            </div>

                            <div className="space-y-2">
                              <Label>Transaction Type</Label>
                              <Tabs defaultValue="swap" className="w-full">
                                <TabsList className="grid grid-cols-3 bg-zinc-800">
                                  <TabsTrigger value="swap">Token Swap</TabsTrigger>
                                  <TabsTrigger value="bridge">Bridge Assets</TabsTrigger>
                                  <TabsTrigger value="lend">Lend/Borrow</TabsTrigger>
                                </TabsList>
                              </Tabs>
                            </div>
                          </div>

                          <div className="bg-zinc-800/50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2 text-violet-400">How This Works</h4>
                            <p className="text-zinc-400 text-sm">
                              When you execute this transaction, your zero-knowledge proof will be submitted to verify
                              your credit line. The transaction will be processed without requiring pre-funding or asset
                              transfers. Your actual financial data remains private.
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="space-y-6">
                          <div className="bg-green-900/20 border border-green-900/50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Check className="h-5 w-5 text-green-500" />
                              <h4 className="font-semibold text-green-400">Transaction Completed Successfully</h4>
                            </div>
                            <div className="space-y-2 text-zinc-400 text-sm">
                              <p>
                                Your transaction for{" "}
                                <span className="font-semibold">${transactionAmount.toLocaleString()}</span> has been
                                executed successfully using your verified credit line.
                              </p>
                              <p>
                                Transaction Hash: <span className="font-mono text-violet-400">0x71C...F29E</span>
                              </p>
                              <p>
                                Remaining Credit:{" "}
                                <span className="font-semibold">
                                  ${(creditLine - transactionAmount).toLocaleString()}
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="bg-zinc-800/50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2 text-violet-400">What Happened Behind the Scenes</h4>
                            <ol className="space-y-2 text-zinc-400 text-sm list-decimal pl-5">
                              <li>Your zero-knowledge proof was verified on-chain</li>
                              <li>Your credit line was confirmed without revealing your financial data</li>
                              <li>The transaction was executed using your verified credit line</li>
                              <li>No pre-funding or asset transfers were required</li>
                              <li>Your financial details remained private throughout the process</li>
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
                            disabled={loading || transactionAmount > creditLine}
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

