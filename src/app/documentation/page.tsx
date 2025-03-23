"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  BookOpen,
  Code,
  FileText,
  LifeBuoy,
  Terminal,
  Shield,
  Wallet,
  Key,
  Database,
  Mail,
  Users,
  Building,
} from "lucide-react";
import Navbar from "@/components/navbar";
import PageTransition from "@/components/page-transition";

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
                    Learn how to use ZKredit to enable cross-chain operations
                    with various verification methods.
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
                        value="contracts"
                        className="w-full justify-start px-4 data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
                      >
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          <span>Verified Contracts</span>
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
                        <h2 className="text-2xl font-bold mb-4">
                          Getting Started
                        </h2>
                        <div className="space-y-6 border border-zinc-800 rounded-lg p-6 bg-zinc-900/30">
                          <h3 className="text-xl font-bold">
                            Introduction to ZKredit
                          </h3>
                          <p className="text-zinc-400">
                            ZKredit is a privacy-preserving financial passport
                            system that enables users to operate across multiple
                            blockchains without pre-funding or asset transfers.
                            This guide will help you understand how ZKredit
                            works and how to integrate it into your
                            applications.
                          </p>

                          <h4 className="text-lg font-semibold mt-6">
                            Prerequisites
                          </h4>
                          <ul className="list-disc pl-6 space-y-2 text-zinc-400">
                            <li>
                              Basic understanding of blockchain technology
                            </li>
                            <li>Experience with web3 development</li>
                            <li>
                              Familiarity with zero-knowledge proofs (helpful
                              but not required)
                            </li>
                          </ul>

                          <h4 className="text-lg font-semibold mt-6">
                            Installation
                          </h4>
                          <div className="bg-zinc-950 p-4 rounded-md font-mono text-sm">
                            npm install @zkredit/sdk
                          </div>

                          <h4 className="text-lg font-semibold mt-6">
                            Quick Start
                          </h4>
                          <p className="text-zinc-400 mb-4">
                            Here&apos;s a simple example of how to initialize the
                            ZKredit SDK and connect assets:
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
                        <h2 className="text-2xl font-bold mb-4">
                          Validator Guides
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-900/30 hover:border-violet-500/50 transition-all duration-300">
                            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                              <Database className="h-5 w-5 text-violet-500" />
                              SP1 Credit Verification
                            </h3>
                            <p className="text-zinc-400 mb-4">
                              Learn how to verify credit lines while keeping
                              financial details private using SP1 circuits.
                            </p>
                            <Button
                              variant="outline"
                              className="w-full border-zinc-700"
                            >
                              Read Guide
                            </Button>
                          </div>
                          <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-900/30 hover:border-violet-500/50 transition-all duration-300">
                            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                              <Users className="h-5 w-5 text-violet-500" />
                              Noir JWT Organization Verification
                            </h3>
                            <p className="text-zinc-400 mb-4">
                              Understand how to prove Google Workspace
                              membership without revealing personal details.
                            </p>
                            <Button
                              variant="outline"
                              className="w-full border-zinc-700"
                            >
                              Read Guide
                            </Button>
                          </div>
                          <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-900/30 hover:border-violet-500/50 transition-all duration-300">
                            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                              <Mail className="h-5 w-5 text-violet-500" />
                              ZKEmail Domain Verification
                            </h3>
                            <p className="text-zinc-400 mb-4">
                              Learn how to verify email ownership with
                              cryptographic certainty for institutional
                              identities.
                            </p>
                            <Button
                              variant="outline"
                              className="w-full border-zinc-700"
                            >
                              Read Guide
                            </Button>
                          </div>
                          <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-900/30 hover:border-violet-500/50 transition-all duration-300">
                            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                              <Building className="h-5 w-5 text-violet-500" />
                              CEX &quot;Trust-Us&quot; Verification
                            </h3>
                            <p className="text-zinc-400 mb-4">
                              Discover how to use assets held in centralized
                              exchanges without withdrawing first.
                            </p>
                            <Button
                              variant="outline"
                              className="w-full border-zinc-700"
                            >
                              Read Guide
                            </Button>
                          </div>
                          <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-900/30 hover:border-violet-500/50 transition-all duration-300">
                            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                              <Key className="h-5 w-5 text-violet-500" />
                              Registry-Based Delegation
                            </h3>
                            <p className="text-zinc-400 mb-4">
                              Learn how to create sub-wallets with custom
                              spending limits and asset restrictions.
                            </p>
                            <Button
                              variant="outline"
                              className="w-full border-zinc-700"
                            >
                              Read Guide
                            </Button>
                          </div>
                          <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-900/30 hover:border-violet-500/50 transition-all duration-300">
                            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                              <Wallet className="h-5 w-5 text-violet-500" />
                              Default Spending
                            </h3>
                            <p className="text-zinc-400 mb-4">
                              Learn how to skip transfers and use funds directly
                              from Account Abstraction wallet owners.
                            </p>
                            <Button
                              variant="outline"
                              className="w-full border-zinc-700"
                            >
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
                        <h2 className="text-2xl font-bold mb-4">
                          API Reference
                        </h2>
                        <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-900/30">
                          <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Code className="h-16 w-16 text-violet-500 mb-4" />
                            <h3 className="text-xl font-bold mb-2">
                              API Documentation Coming Soon
                            </h3>
                            <p className="text-zinc-400 max-w-md mb-6">
                              We&apos;re currently working on comprehensive API
                              documentation. Join our waitlist to be notified
                              when it&apos;s available.
                            </p>
                            <Button className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700">
                              Join Waitlist
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="sdk" className="mt-0">
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-2xl font-bold mb-4">
                          SDK Documentation
                        </h2>
                        <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-900/30">
                          <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Terminal className="h-16 w-16 text-violet-500 mb-4" />
                            <h3 className="text-xl font-bold mb-2">
                              SDK Documentation Coming Soon
                            </h3>
                            <p className="text-zinc-400 max-w-md mb-6">
                              Our SDK documentation is currently in development.
                              Join our waitlist to be notified when it&apos;s
                              available.
                            </p>
                            <Button className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700">
                              Join Waitlist
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="concepts" className="mt-0">
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-2xl font-bold mb-4">
                          Key Concepts
                        </h2>
                        <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-900/30">
                          <p className="text-zinc-400 mb-6">
                            Understanding the core concepts behind ZKredit will
                            help you make the most of the platform.
                          </p>

                          <div className="space-y-6">
                            <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-950">
                              <h3 className="text-lg font-bold mb-2 text-violet-400">
                                Zero-Knowledge Proofs
                              </h3>
                              <p className="text-zinc-400">
                                Zero-knowledge proofs allow one party (the
                                prover) to prove to another party (the verifier)
                                that a statement is true without revealing any
                                information beyond the validity of the statement
                                itself. In ZKredit, these proofs are used to
                                verify asset ownership and availability without
                                revealing balances or private details.
                              </p>
                            </div>

                            <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-950">
                              <h3 className="text-lg font-bold mb-2 text-violet-400">
                                Financial Passport
                              </h3>
                              <p className="text-zinc-400">
                                A financial passport is a cryptographic
                                credential that verifies an entity&apos;s financial
                                standing without revealing sensitive details. It
                                enables cross-chain operations by proving asset
                                backing without requiring pre-funding or asset
                                transfers.
                              </p>
                            </div>

                            <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-950">
                              <h3 className="text-lg font-bold mb-2 text-violet-400">
                                Asset Claim Circuit
                              </h3>
                              <p className="text-zinc-400">
                                The Asset Claim Circuit is a specialized
                                zero-knowledge circuit that generates proofs
                                verifying an entity has access to specific
                                assets, whether on exchanges, other chains, or
                                in wallets, without revealing exact balances.
                              </p>
                            </div>

                            <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-950">
                              <h3 className="text-lg font-bold mb-2 text-violet-400">
                                Agent Authority Circuit
                              </h3>
                              <p className="text-zinc-400">
                                The Agent Authority Circuit verifies that an AI
                                agent or delegate has the appropriate
                                permissions and spending limits to perform
                                operations on behalf of the asset owner.
                              </p>
                            </div>

                            <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-950">
                              <h3 className="text-lg font-bold mb-2 text-violet-400">
                                Cross-Chain Settlement
                              </h3>
                              <p className="text-zinc-400">
                                ZKredit enables operations across multiple
                                blockchains without requiring pre-funding or
                                asset bridging. This is achieved through a
                                combination of zero-knowledge proofs and
                                validator signatures that verify asset backing
                                on the source chain while allowing operations on
                                the target chain.
                              </p>
                            </div>

                            <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-950">
                              <h3 className="text-lg font-bold mb-2 text-violet-400">
                                Validator Registry
                              </h3>
                              <p className="text-zinc-400">
                                The Validator Registry is a core component that
                                maintains a list of trusted validators who can
                                authorize withdrawals and operations. Each
                                validator type has specific verification methods
                                and security properties, allowing for a flexible
                                and extensible system.
                              </p>
                            </div>

                            <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-950">
                              <h3 className="text-lg font-bold mb-2 text-violet-400">
                                Account Abstraction Integration
                              </h3>
                              <p className="text-zinc-400">
                                ZKredit is designed to work seamlessly with
                                ERC-4337 Account Abstraction, enabling advanced
                                features like multi-signature approvals,
                                spending limits, and programmable transaction
                                validation without requiring changes to the
                                underlying blockchain.
                              </p>
                            </div>
                          </div>

                          <Button className="mt-6 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700">
                            Explore All Concepts
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="contracts" className="mt-0">
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-2xl font-bold mb-4">
                          Verified Contracts
                        </h2>
                        <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-900/30">
                          <p className="text-zinc-400 mb-6">
                            All ZKredit smart contracts are verified on
                            blockchain explorers and audited by leading security
                            firms.
                          </p>

                          <div className="space-y-4">
                            <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-950">
                              <div className="flex justify-between items-center mb-2">
                                <h3 className="font-bold text-violet-400">
                                  ZKredit Core
                                </h3>
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-full">
                                    Audited
                                  </span>
                                  <span className="px-2 py-1 bg-blue-900/30 text-blue-400 text-xs rounded-full">
                                    Verified
                                  </span>
                                </div>
                              </div>
                              <p className="text-zinc-400 text-sm mb-2">
                                Main contract for the ZKredit protocol
                              </p>
                              <div className="flex items-center gap-2 text-sm text-zinc-500">
                                <span>Ethereum:</span>
                                <code className="font-mono">0x71C...F29E</code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-zinc-400"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <rect
                                      x="9"
                                      y="9"
                                      width="13"
                                      height="13"
                                      rx="2"
                                      ry="2"
                                    ></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                  </svg>
                                </Button>
                              </div>
                            </div>

                            <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-950">
                              <div className="flex justify-between items-center mb-2">
                                <h3 className="font-bold text-violet-400">
                                  ZKredit Registry
                                </h3>
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-full">
                                    Audited
                                  </span>
                                  <span className="px-2 py-1 bg-blue-900/30 text-blue-400 text-xs rounded-full">
                                    Verified
                                  </span>
                                </div>
                              </div>
                              <p className="text-zinc-400 text-sm mb-2">
                                Registry contract for granular control over
                                token access
                              </p>
                              <div className="flex items-center gap-2 text-sm text-zinc-500">
                                <span>Ethereum:</span>
                                <code className="font-mono">0x82D...A37B</code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-zinc-400"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <rect
                                      x="9"
                                      y="9"
                                      width="13"
                                      height="13"
                                      rx="2"
                                      ry="2"
                                    ></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                  </svg>
                                </Button>
                              </div>
                            </div>

                            <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-950">
                              <div className="flex justify-between items-center mb-2">
                                <h3 className="font-bold text-violet-400">
                                  SP1 Credit Verifier
                                </h3>
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-full">
                                    Audited
                                  </span>
                                  <span className="px-2 py-1 bg-blue-900/30 text-blue-400 text-xs rounded-full">
                                    Verified
                                  </span>
                                </div>
                              </div>
                              <p className="text-zinc-400 text-sm mb-2">
                                Verifies credit lines using SP1 zero-knowledge
                                proofs
                              </p>
                              <div className="flex items-center gap-2 text-sm text-zinc-500">
                                <span>Ethereum:</span>
                                <code className="font-mono">0x93F...E45C</code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-zinc-400"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <rect
                                      x="9"
                                      y="9"
                                      width="13"
                                      height="13"
                                      rx="2"
                                      ry="2"
                                    ></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                  </svg>
                                </Button>
                              </div>
                            </div>

                            <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-950">
                              <div className="flex justify-between items-center mb-2">
                                <h3 className="font-bold text-violet-400">
                                  Noir JWT Verifier
                                </h3>
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-full">
                                    Audited
                                  </span>
                                  <span className="px-2 py-1 bg-blue-900/30 text-blue-400 text-xs rounded-full">
                                    Verified
                                  </span>
                                </div>
                              </div>
                              <p className="text-zinc-400 text-sm mb-2">
                                Verifies Google Workspace membership using Noir
                                circuits
                              </p>
                              <div className="flex items-center gap-2 text-sm text-zinc-500">
                                <span>Ethereum:</span>
                                <code className="font-mono">0x45D...B28A</code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-zinc-400"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <rect
                                      x="9"
                                      y="9"
                                      width="13"
                                      height="13"
                                      rx="2"
                                      ry="2"
                                    ></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                  </svg>
                                </Button>
                              </div>
                            </div>
                          </div>

                          <Button className="mt-6 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700">
                            View All Contracts
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
                            Get help with using ZKredit and resolving any issues
                            you encounter.
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="border border-zinc-800 rounded-lg p-4 hover:border-violet-500/50 transition-all duration-300">
                              <h3 className="font-bold mb-2">
                                Developer Community
                              </h3>
                              <p className="text-zinc-400 text-sm mb-4">
                                Join our Discord community to connect with other
                                developers and get help from our team.
                              </p>
                              <Button
                                variant="outline"
                                className="w-full border-zinc-700"
                              >
                                Join Discord
                              </Button>
                            </div>
                            <div className="border border-zinc-800 rounded-lg p-4 hover:border-violet-500/50 transition-all duration-300">
                              <h3 className="font-bold mb-2">
                                GitHub Repository
                              </h3>
                              <p className="text-zinc-400 text-sm mb-4">
                                Report issues, contribute to the project, and
                                access sample code on GitHub.
                              </p>
                              <Button
                                variant="outline"
                                className="w-full border-zinc-700"
                              >
                                Visit GitHub
                              </Button>
                            </div>
                          </div>

                          <h3 className="text-lg font-bold mb-4">
                            Frequently Asked Questions
                          </h3>
                          <div className="space-y-4">
                            <div className="border border-zinc-800 rounded-md p-4">
                              <h4 className="font-bold mb-2">
                                What blockchains does ZKredit support?
                              </h4>
                              <p className="text-zinc-400 text-sm">
                                ZKredit currently supports Ethereum, Arbitrum,
                                Optimism, Polygon, and Base, with more chains
                                coming soon.
                              </p>
                            </div>
                            <div className="border border-zinc-800 rounded-md p-4">
                              <h4 className="font-bold mb-2">
                                Is ZKredit audited?
                              </h4>
                              <p className="text-zinc-400 text-sm">
                                Yes, ZKredit&apos;s smart contracts and ZK circuits
                                have been audited by leading security firms.
                                Audit reports are available on our GitHub
                                repository.
                              </p>
                            </div>
                            <div className="border border-zinc-800 rounded-md p-4">
                              <h4 className="font-bold mb-2">
                                How much does ZKredit cost to use?
                              </h4>
                              <p className="text-zinc-400 text-sm">
                                ZKredit offers a tiered pricing model based on
                                usage. Please refer to our pricing page for
                                current rates.
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
            <p className="text-sm text-zinc-500">
              © 2023 ZKredit. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
