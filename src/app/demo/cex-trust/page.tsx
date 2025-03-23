"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, ArrowRight, Building, Check, Lock, Network, Shield } from "lucide-react"
import Navbar from "@/components/navbar"
import PageTransition from "@/components/page-transition"

export default function CEXTrustVerificationPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [cexName, setCexName] = useState("")
  const [cexBalance, setCexBalance] = useState(0)
  const [transactionCompleted, setTransactionCompleted] = useState(false)
  const [selectedChain, setSelectedChain] = useState("ethereum")
  const [transactionAmount, setTransactionAmount] = useState(1000)

  const connectCEX = (exchange:string) => {
    setLoading(true)

    // Simulate CEX connection
    setTimeout(() => {
      setCexName(exchange)
      setCexBalance(exchange === "Binance" ? 25000 : exchange === "Coinbase" ? 15000 : 10000)
      setLoading(false)
      setStep(2)
    }, 1500)
  }

  const generateProof = () => {
    setLoading(true)

    // Simulate proof generation
    setTimeout(() => {
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
    setCexName("")
    setCexBalance(0)
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
                    CEX &quot;Trust-Us&quot; Verification
                  </h1>
                  <p className="max-w-[700px] mx-auto text-zinc-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Use assets held in centralized exchanges without withdrawing first. The exchange verifies your
                    ownership and approves transactions.
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
                      <Building className="h-5 w-5 text-white" />
                    </div>
                    <span className="mt-2 text-sm text-zinc-400">Connect Exchange</span>
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
                    <span className="mt-2 text-sm text-zinc-400">Verify Assets</span>
                  </div>
                  <div className="flex-1 flex items-center">
                    <div className={`h-1 w-full ${step >= 3 ? "bg-violet-600" : "bg-zinc-800"}`}></div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? "bg-violet-600" : "bg-zinc-800"}`}
                    >
                      <Network className="h-5 w-5 text-white" />
                    </div>
                    <span className="mt-2 text-sm text-zinc-400">Cross-Chain Transaction</span>
                  </div>
                </div>
              </div>

              {/* Step 1: Connect Exchange */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                      <CardTitle>Connect Your Centralized Exchange</CardTitle>
                      <CardDescription className="text-zinc-400">
                        Connect to your centralized exchange to use your assets without withdrawing them.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card
                          className="bg-zinc-800 border-zinc-700 hover:border-violet-500/50 transition-all duration-300 cursor-pointer"
                          onClick={() => connectCEX("Binance")}
                        >
                          <CardHeader className="p-4">
                            <CardTitle className="text-center">Binance</CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 pt-0 flex justify-center">
                            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center">
                              <span className="text-yellow-500 text-2xl font-bold">B</span>
                            </div>
                          </CardContent>
                        </Card>

                        <Card
                          className="bg-zinc-800 border-zinc-700 hover:border-violet-500/50 transition-all duration-300 cursor-pointer"
                          onClick={() => connectCEX("Coinbase")}
                        >
                          <CardHeader className="p-4">
                            <CardTitle className="text-center">Coinbase</CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 pt-0 flex justify-center">
                            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
                              <span className="text-blue-500 text-2xl font-bold">C</span>
                            </div>
                          </CardContent>
                        </Card>

                        <Card
                          className="bg-zinc-800 border-zinc-700 hover:border-violet-500/50 transition-all duration-300 cursor-pointer"
                          onClick={() => connectCEX("Kraken")}
                        >
                          <CardHeader className="p-4">
                            <CardTitle className="text-center">Kraken</CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 pt-0 flex justify-center">
                            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center">
                              <span className="text-purple-500 text-2xl font-bold">K</span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="bg-zinc-800/50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2 text-violet-400">How This Works</h4>
                        <p className="text-zinc-400 text-sm">
                          The CEX &quot;Trust-Us&quot; verification method allows you to use your assets held in centralized
                          exchanges without withdrawing them first. The exchange verifies your ownership and approves
                          transactions on your behalf. This enables cross-chain operations without pre-funding or asset
                          transfers.
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                      {loading && (
                        <div className="flex items-center gap-2 text-zinc-400">
                          <svg
                            className="animate-spin h-5 w-5 text-violet-500"
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
                          Connecting to exchange...
                        </div>
                      )}
                    </CardFooter>
                  </Card>
                </motion.div>
              )}

              {/* Step 2: Verify Assets */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                      <CardTitle>Verify Your Exchange Assets</CardTitle>
                      <CardDescription className="text-zinc-400">
                        Verify your assets held in {cexName} to use them for cross-chain operations.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="bg-violet-900/20 border border-violet-900/50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Check className="h-5 w-5 text-violet-400" />
                          <h4 className="font-semibold text-violet-400">Exchange Connected Successfully</h4>
                        </div>
                        <div className="space-y-2 text-zinc-400 text-sm">
                          <p>
                            You&apos;ve successfully connected to <span className="font-semibold">{cexName}</span>. Your
                            assets can now be verified and used for cross-chain operations.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-zinc-800/50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Exchange Assets</h4>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                                  <span className="text-yellow-500 text-xs font-bold">BTC</span>
                                </div>
                                <span className="text-zinc-400">Bitcoin</span>
                              </div>
                              <span className="font-semibold">0.75 BTC</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                                  <span className="text-blue-500 text-xs font-bold">ETH</span>
                                </div>
                                <span className="text-zinc-400">Ethereum</span>
                              </div>
                              <span className="font-semibold">12.5 ETH</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                                  <span className="text-green-500 text-xs font-bold">USDC</span>
                                </div>
                                <span className="text-zinc-400">USD Coin</span>
                              </div>
                              <span className="font-semibold">15,000 USDC</span>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t border-zinc-700">
                            <div className="flex justify-between items-center">
                              <span className="text-zinc-400">Total Value (USD)</span>
                              <span className="font-semibold text-lg">${cexBalance.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-zinc-800/50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Verification Process</h4>
                          <ul className="space-y-2 text-zinc-400 text-sm">
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Exchange API connection established</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Account ownership verified</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Asset balances confirmed</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Exchange validator authorized</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-zinc-800/50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2 text-violet-400">How This Works</h4>
                        <p className="text-zinc-400 text-sm">
                          The exchange acts as a trusted validator that verifies your asset ownership. When you execute
                          a transaction, the exchange will sign a message confirming that you have sufficient balance.
                          This signature will be used to authorize the transaction on any blockchain without requiring
                          you to move your assets from the exchange.
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
                            Verifying Assets...
                          </>
                        ) : (
                          <>
                            Verify Assets <Shield className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              )}

              {/* Step 3: Cross-Chain Transaction */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                      <CardTitle>Execute Cross-Chain Transaction</CardTitle>
                      <CardDescription className="text-zinc-400">
                        Use your verified exchange assets to execute transactions on any blockchain.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="bg-violet-900/20 border border-violet-900/50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="h-5 w-5 text-violet-400" />
                          <h4 className="font-semibold text-violet-400">Assets Verified Successfully</h4>
                        </div>
                        <div className="space-y-2 text-zinc-400 text-sm">
                          <p>
                            Your assets on <span className="font-semibold">{cexName}</span> have been verified. You can
                            now use them for cross-chain operations without withdrawing them from the exchange.
                          </p>
                          <p>
                            Available Balance: <span className="font-semibold">${cexBalance.toLocaleString()}</span>
                          </p>
                        </div>
                      </div>

                      {!transactionCompleted ? (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Select Blockchain</Label>
                            <Tabs
                              defaultValue="ethereum"
                              value={selectedChain}
                              onValueChange={setSelectedChain}
                              className="w-full"
                            >
                              <TabsList className="grid grid-cols-4 bg-zinc-800">
                                <TabsTrigger value="ethereum">Ethereum</TabsTrigger>
                                <TabsTrigger value="polygon">Polygon</TabsTrigger>
                                <TabsTrigger value="arbitrum">Arbitrum</TabsTrigger>
                                <TabsTrigger value="optimism">Optimism</TabsTrigger>
                              </TabsList>
                              <TabsContent value="ethereum" className="pt-4">
                                <p className="text-zinc-400 text-sm">
                                  Execute a transaction on the Ethereum blockchain using your assets held on {cexName}.
                                  No need to withdraw or bridge your assets.
                                </p>
                              </TabsContent>
                              <TabsContent value="polygon" className="pt-4">
                                <p className="text-zinc-400 text-sm">
                                  Execute a transaction on the Polygon blockchain using your assets held on {cexName}.
                                  No need to withdraw or bridge your assets.
                                </p>
                              </TabsContent>
                              <TabsContent value="arbitrum" className="pt-4">
                                <p className="text-zinc-400 text-sm">
                                  Execute a transaction on the Arbitrum blockchain using your assets held on {cexName}.
                                  No need to withdraw or bridge your assets.
                                </p>
                              </TabsContent>
                              <TabsContent value="optimism" className="pt-4">
                                <p className="text-zinc-400 text-sm">
                                  Execute a transaction on the Optimism blockchain using your assets held on {cexName}.
                                  No need to withdraw or bridge your assets.
                                </p>
                              </TabsContent>
                            </Tabs>
                          </div>

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
                                max={cexBalance}
                              />
                            </div>
                            {transactionAmount > cexBalance && (
                              <p className="text-red-400 text-sm">Transaction amount exceeds your available balance.</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label>Transaction Type</Label>
                            <Tabs defaultValue="swap" className="w-full">
                              <TabsList className="grid grid-cols-3 bg-zinc-800">
                                <TabsTrigger value="swap">Token Swap</TabsTrigger>
                                <TabsTrigger value="lend">Lend/Borrow</TabsTrigger>
                                <TabsTrigger value="stake">Stake</TabsTrigger>
                              </TabsList>
                            </Tabs>
                          </div>

                          <div className="bg-zinc-800/50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2 text-violet-400">How This Works</h4>
                            <p className="text-zinc-400 text-sm">
                              When you execute this transaction, {cexName} will act as a validator and sign a message
                              confirming that you have sufficient balance. This signature will be used to authorize the
                              transaction on the
                              {selectedChain === "ethereum"
                                ? " Ethereum"
                                : selectedChain === "polygon"
                                  ? " Polygon"
                                  : selectedChain === "arbitrum"
                                    ? " Arbitrum"
                                    : " Optimism"}{" "}
                              blockchain without requiring you to move your assets from the exchange.
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
                                Your transaction for{" "}
                                <span className="font-semibold">${transactionAmount.toLocaleString()}</span> has been
                                executed successfully on the{" "}
                                {selectedChain === "ethereum"
                                  ? "Ethereum"
                                  : selectedChain === "polygon"
                                    ? "Polygon"
                                    : selectedChain === "arbitrum"
                                      ? "Arbitrum"
                                      : "Optimism"}{" "}
                                blockchain.
                              </p>
                              <p>
                                Transaction Hash: <span className="font-mono text-violet-400">0x93F...E45C</span>
                              </p>
                              <p>
                                Remaining Balance on {cexName}:{" "}
                                <span className="font-semibold">
                                  ${(cexBalance - transactionAmount).toLocaleString()}
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="bg-zinc-800/50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2 text-violet-400">What Happened Behind the Scenes</h4>
                            <ol className="space-y-2 text-zinc-400 text-sm list-decimal pl-5">
                              <li>{cexName} verified your asset ownership internally</li>
                              <li>The exchange signed a message confirming your available balance</li>
                              <li>
                                The signature was used to authorize the transaction on the{" "}
                                {selectedChain === "ethereum"
                                  ? "Ethereum"
                                  : selectedChain === "polygon"
                                    ? "Polygon"
                                    : selectedChain === "arbitrum"
                                      ? "Arbitrum"
                                      : "Optimism"}{" "}
                                blockchain
                              </li>
                              <li>
                                The transaction was executed without requiring you to move your assets from the exchange
                              </li>
                              <li>Your exchange balance was updated to reflect the transaction</li>
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
                            disabled={loading || transactionAmount > cexBalance}
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
                                Execute Transaction <Network className="ml-2 h-4 w-4" />
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

