"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, BookOpen, Code, FileText, LifeBuoy, Terminal } from "lucide-react"
import Navbar from "@/components/navbar"
import PageTransition from "@/components/page-transition"

export default function DocumentationPage() {
  return (
    <div className="flex min-h-screen flex-col dark">
      <Navbar />

      <PageTransition>
        <main className="flex-1 bg-zinc-950 text-white">
          {/* Hero Section */}
          <section className="w-full py-12 md:py-24 border-b border-zinc-800">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to home
                  </Link>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                    ZKredit Documentation
                  </h1>
                  <p className="max-w-[700px] mx-auto text-zinc-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Learn how to use ZKredit to enable AI agents to operate across multiple blockchains.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Documentation Content */}
          <section className="container px-4 py-12 md:px-6 md:py-24">
            <Tabs defaultValue="guides" className="w-full">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/4">
                  <div className="sticky top-24">
                    <TabsList className="flex flex-col space-y-1 h-auto bg-transparent p-0">
                      <TabsTrigger
                        value="guides"
                        className="w-full justify-start px-4 data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
                      >
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          <span>Guides</span>
                        </div>
                      </TabsTrigger>
                      <TabsTrigger
                        value="api"
                        className="w-full justify-start px-4 data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
                      >
                        <div className="flex items-center gap-2">
                          <Code className="h-4 w-4" />
                          <span>API Reference</span>
                        </div>
                      </TabsTrigger>
                      <TabsTrigger
                        value="sdk"
                        className="w-full justify-start px-4 data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
                      >
                        <div className="flex items-center gap-2">
                          <Terminal className="h-4 w-4" />
                          <span>SDK</span>
                        </div>
                      </TabsTrigger>
                      <TabsTrigger
                        value="concepts"
                        className="w-full justify-start px-4 data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span>Key Concepts</span>
                        </div>
                      </TabsTrigger>
                      <TabsTrigger
                        value="support"
                        className="w-full justify-start px-4 data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
                      >
                        <div className="flex items-center gap-2">
                          <LifeBuoy className="h-4 w-4" />
                          <span>Support</span>
                        </div>
                      </TabsTrigger>
                    </TabsList>
                  </div>
                </div>

                <div className="md:w-3/4">
                  <TabsContent value="guides" className="mt-0">
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
                        <div className="space-y-6 border border-zinc-800 rounded-lg p-6 bg-zinc-900/30">
                          <h3 className="text-xl font-bold">Introduction to ZKredit</h3>
                          <p className="text-zinc-400">
                            ZKredit is a privacy-preserving financial passport system for AI agents that enables them to
                            operate across multiple blockchains without pre-funding or asset transfers. This guide will
                            help you understand how ZKredit works and how to integrate it into your applications.
                          </p>

                          <h4 className="text-lg font-semibold mt-6">Prerequisites</h4>
                          <ul className="list-disc pl-6 space-y-2 text-zinc-400">
                            <li>Basic understanding of blockchain technology</li>
                            <li>Experience with web3 development</li>
                            <li>Familiarity with zero-knowledge proofs (helpful but not required)</li>
                          </ul>

                          <h4 className="text-lg font-semibold mt-6">Installation</h4>
                          <div className="bg-zinc-950 p-4 rounded-md font-mono text-sm">npm install @zkredit/sdk</div>

                          <h4 className="text-lg font-semibold mt-6">Quick Start</h4>
                          <p className="text-zinc-400 mb-4">
                            Here&apos;s a simple example of how to initialize the ZKredit SDK and connect assets:
                          </p>
                          <div className="bg-zinc-950 p-4 rounded-md font-mono text-sm whitespace-pre overflow-x-auto">
                            {`import { ZKredit } from '@zkredit/sdk';

// Initialize ZKredit client
const zkredit = new ZKredit({
  apiKey: 'YOUR_API_KEY',
  environment: 'testnet', // or 'mainnet'
});

// Connect a wallet
const connectWallet = async () => {
  try {
    const connection = await zkredit.connect.wallet({
      provider: window.ethereum,
    });
    
    console.log('Connected wallet:', connection.address);
    return connection;
  } catch (error) {
    console.error('Failed to connect wallet:', error);
  }
};

// Generate a ZK proof
const generateProof = async (connection) => {
  try {
    const proof = await zkredit.proofs.generate({
      connection,
      assetTypes: ['ETH', 'ERC20'],
      thresholds: {
        minimum: '1000', // minimum value in USD
      },
    });
    
    console.log('Generated proof:', proof.id);
    return proof;
  } catch (error) {
    console.error('Failed to generate proof:', error);
  }
};`}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h2 className="text-2xl font-bold mb-4">Core Guides</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-900/30 hover:border-violet-500/50 transition-all duration-300">
                            <h3 className="text-lg font-bold mb-2">Connecting Assets</h3>
                            <p className="text-zinc-400 mb-4">
                              Learn how to connect wallets, exchanges, and other assets to generate ZK proofs.
                            </p>
                            <Button variant="outline" className="w-full border-zinc-700">
                              Read Guide
                            </Button>
                          </div>
                          <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-900/30 hover:border-violet-500/50 transition-all duration-300">
                            <h3 className="text-lg font-bold mb-2">Generating ZK Proofs</h3>
                            <p className="text-zinc-400 mb-4">
                              Understand how to create and manage zero-knowledge proofs for your assets.
                            </p>
                            <Button variant="outline" className="w-full border-zinc-700">
                              Read Guide
                            </Button>
                          </div>
                          <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-900/30 hover:border-violet-500/50 transition-all duration-300">
                            <h3 className="text-lg font-bold mb-2">Cross-Chain Operations</h3>
                            <p className="text-zinc-400 mb-4">
                              Learn how to execute transactions across different blockchains using ZK credentials.
                            </p>
                            <Button variant="outline" className="w-full border-zinc-700">
                              Read Guide
                            </Button>
                          </div>
                          <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-900/30 hover:border-violet-500/50 transition-all duration-300">
                            <h3 className="text-lg font-bold mb-2">AI Agent Integration</h3>
                            <p className="text-zinc-400 mb-4">
                              Discover how to empower AI agents with ZKredit&apos;s financial passport system.
                            </p>
                            <Button variant="outline" className="w-full border-zinc-700">
                              Read Guide
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="api" className="mt-0">
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-2xl font-bold mb-4">API Reference</h2>
                        <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-900/30">
                          <p className="text-zinc-400 mb-6">
                            Complete documentation for the ZKredit API, including endpoints, request parameters, and
                            response formats.
                          </p>

                          <h3 className="text-lg font-bold mb-4">Authentication</h3>
                          <p className="text-zinc-400 mb-4">
                            All API requests require an API key for authentication. You can obtain an API key from the
                            ZKredit dashboard.
                          </p>
                          <div className="bg-zinc-950 p-4 rounded-md font-mono text-sm mb-6">
                            Authorization: Bearer YOUR_API_KEY
                          </div>

                          <h3 className="text-lg font-bold mb-4">Base URL</h3>
                          <div className="bg-zinc-950 p-4 rounded-md font-mono text-sm mb-6">
                            https://api.zkredit.xyz/v1
                          </div>

                          <h3 className="text-lg font-bold mb-4">Endpoints</h3>
                          <div className="space-y-4">
                            <div className="border border-zinc-800 rounded-md p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-full">
                                  POST
                                </span>
                                <span className="font-mono text-sm">/proofs/generate</span>
                              </div>
                              <p className="text-zinc-400 text-sm">
                                Generate a zero-knowledge proof for connected assets
                              </p>
                            </div>
                            <div className="border border-zinc-800 rounded-md p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 bg-blue-900/30 text-blue-400 text-xs rounded-full">GET</span>
                                <span className="font-mono text-sm">/proofs/{"{proofId}"}</span>
                              </div>
                              <p className="text-zinc-400 text-sm">Retrieve a previously generated proof</p>
                            </div>
                            <div className="border border-zinc-800 rounded-md p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-full">
                                  POST
                                </span>
                                <span className="font-mono text-sm">/proofs/verify</span>
                              </div>
                              <p className="text-zinc-400 text-sm">Verify a zero-knowledge proof</p>
                            </div>
                          </div>

                          <Button className="mt-6 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700">
                            View Full API Reference
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="sdk" className="mt-0">
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-2xl font-bold mb-4">SDK Documentation</h2>
                        <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-900/30">
                          <p className="text-zinc-400 mb-6">
                            The ZKredit SDK provides a simple interface for integrating ZKredit into your applications.
                          </p>

                          <h3 className="text-lg font-bold mb-4">Installation</h3>
                          <div className="bg-zinc-950 p-4 rounded-md font-mono text-sm mb-6">
                            npm install @zkredit/sdk
                          </div>

                          <h3 className="text-lg font-bold mb-4">Core Modules</h3>
                          <div className="space-y-4">
                            <div className="border border-zinc-800 rounded-md p-4">
                              <h4 className="font-bold mb-2">ZKredit.connect</h4>
                              <p className="text-zinc-400 text-sm mb-2">Methods for connecting assets</p>
                              <ul className="list-disc pl-6 space-y-1 text-zinc-400 text-sm">
                                <li>connect.wallet()</li>
                                <li>connect.exchange()</li>
                                <li>connect.credit()</li>
                              </ul>
                            </div>
                            <div className="border border-zinc-800 rounded-md p-4">
                              <h4 className="font-bold mb-2">ZKredit.proofs</h4>
                              <p className="text-zinc-400 text-sm mb-2">Methods for generating and managing proofs</p>
                              <ul className="list-disc pl-6 space-y-1 text-zinc-400 text-sm">
                                <li>proofs.generate()</li>
                                <li>proofs.verify()</li>
                                <li>proofs.revoke()</li>
                              </ul>
                            </div>
                            <div className="border border-zinc-800 rounded-md p-4">
                              <h4 className="font-bold mb-2">ZKredit.operations</h4>
                              <p className="text-zinc-400 text-sm mb-2">Methods for executing cross-chain operations</p>
                              <ul className="list-disc pl-6 space-y-1 text-zinc-400 text-sm">
                                <li>operations.execute()</li>
                                <li>operations.status()</li>
                                <li>operations.cancel()</li>
                              </ul>
                            </div>
                          </div>

                          <Button className="mt-6 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700">
                            View Full SDK Documentation
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="concepts" className="mt-0">
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-2xl font-bold mb-4">Key Concepts</h2>
                        <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-900/30">
                          <p className="text-zinc-400 mb-6">
                            Understanding the core concepts behind ZKredit will help you make the most of the platform.
                          </p>

                          <h3 className="text-lg font-bold mb-4">Zero-Knowledge Proofs</h3>
                          <p className="text-zinc-400 mb-6">
                            Zero-knowledge proofs allow one party (the prover) to prove to another party (the verifier)
                            that a statement is true without revealing any information beyond the validity of the
                            statement itself. In ZKredit, these proofs are used to verify asset ownership and
                            availability without revealing balances or private details.
                          </p>

                          <h3 className="text-lg font-bold mb-4">Financial Passport</h3>
                          <p className="text-zinc-400 mb-6">
                            A financial passport is a cryptographic credential that verifies an entity&apos;s financial
                            standing without revealing sensitive details. It enables cross-chain operations by proving
                            asset backing without requiring pre-funding or asset transfers.
                          </p>

                          <h3 className="text-lg font-bold mb-4">Asset Claim Circuit</h3>
                          <p className="text-zinc-400 mb-6">
                            The Asset Claim Circuit is a specialized zero-knowledge circuit that generates proofs
                            verifying an entity has access to specific assets, whether on exchanges, other chains, or in
                            wallets, without revealing exact balances.
                          </p>

                          <h3 className="text-lg font-bold mb-4">Agent Authority Circuit</h3>
                          <p className="text-zinc-400 mb-6">
                            The Agent Authority Circuit verifies that an AI agent or delegate has the appropriate
                            permissions and spending limits to perform operations on behalf of the asset owner.
                          </p>

                          <Button className="mt-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700">
                            Explore All Concepts
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="support" className="mt-0">
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-2xl font-bold mb-4">Support</h2>
                        <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-900/30">
                          <p className="text-zinc-400 mb-6">
                            Get help with using ZKredit and resolving any issues you encounter.
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="border border-zinc-800 rounded-lg p-4 hover:border-violet-500/50 transition-all duration-300">
                              <h3 className="font-bold mb-2">Developer Community</h3>
                              <p className="text-zinc-400 text-sm mb-4">
                                Join our Discord community to connect with other developers and get help from our team.
                              </p>
                              <Button variant="outline" className="w-full border-zinc-700">
                                Join Discord
                              </Button>
                            </div>
                            <div className="border border-zinc-800 rounded-lg p-4 hover:border-violet-500/50 transition-all duration-300">
                              <h3 className="font-bold mb-2">GitHub Repository</h3>
                              <p className="text-zinc-400 text-sm mb-4">
                                Report issues, contribute to the project, and access sample code on GitHub.
                              </p>
                              <Button variant="outline" className="w-full border-zinc-700">
                                Visit GitHub
                              </Button>
                            </div>
                          </div>

                          <h3 className="text-lg font-bold mb-4">Frequently Asked Questions</h3>
                          <div className="space-y-4">
                            <div className="border border-zinc-800 rounded-md p-4">
                              <h4 className="font-bold mb-2">What blockchains does ZKredit support?</h4>
                              <p className="text-zinc-400 text-sm">
                                ZKredit currently supports Ethereum, Arbitrum, Optimism, Polygon, and Base, with more
                                chains coming soon.
                              </p>
                            </div>
                            <div className="border border-zinc-800 rounded-md p-4">
                              <h4 className="font-bold mb-2">Is ZKredit audited?</h4>
                              <p className="text-zinc-400 text-sm">
                                Yes, ZKredit&apos;s smart contracts and ZK circuits have been audited by leading security
                                firms. Audit reports are available on our GitHub repository.
                              </p>
                            </div>
                            <div className="border border-zinc-800 rounded-md p-4">
                              <h4 className="font-bold mb-2">How much does ZKredit cost to use?</h4>
                              <p className="text-zinc-400 text-sm">
                                ZKredit offers a tiered pricing model based on usage. Please refer to our pricing page
                                for current rates.
                              </p>
                            </div>
                          </div>

                          <Button className="mt-6 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700">
                            Contact Support
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </div>
            </Tabs>
          </section>
        </main>
      </PageTransition>

      <footer className="w-full py-6 bg-zinc-950 border-t border-zinc-800">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-violet-500" />
              <span className="text-lg font-bold bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent">
                ZKredit Docs
              </span>
            </div>
            <p className="text-sm text-zinc-500">© 2023 ZKredit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

