"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  ArrowLeft,
  Check,
  ChevronRight,
  Code,
  Network,
} from "lucide-react";
import Navbar from "@/components/navbar";
import PageTransition from "@/components/page-transition";

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState("base-contract");

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
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                  ZKredit Demo
                </h1>
                <p className="mt-4 max-w-[700px] text-zinc-400 md:text-xl">
                  Explore how ZKredit enables cross-chain operations with
                  various verification methods.
                </p>
              </div>
            </div>

            <div className="mt-12 space-y-8">
              <Tabs
                defaultValue="base-contract"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full max-w-4xl grid-cols-6 mb-8">
                  <TabsTrigger value="base-contract">Base Contract</TabsTrigger>
                  <TabsTrigger value="registry">Registry</TabsTrigger>
                  <TabsTrigger value="cex-trust">CEX &quot;Trust-Us&quot;</TabsTrigger>
                  <TabsTrigger value="sp1-credit">SP1 Credit</TabsTrigger>
                  <TabsTrigger value="noir-jwt">Noir JWT</TabsTrigger>
                  <TabsTrigger value="default-spending">
                    Default Spending
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="base-contract" className="space-y-4">
                  <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-900/30">
                    <div className="space-y-2 mb-8">
                      <h2 className="text-2xl font-bold">
                        Base ZKredit Contract
                      </h2>
                      <p className="text-zinc-400">
                        The foundation of ZKredit is a smart contract that
                        allows deposits and withdrawals with validator
                        signatures.
                      </p>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-6">
                      <h3 className="text-xl font-bold mb-4">
                        Contract Architecture
                      </h3>
                      <p className="text-zinc-400 mb-6">
                        The base contract implements a registry of potential
                        valid signatures that can authorize asset withdrawals.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-950">
                          <h4 className="font-bold mb-2 text-violet-400">
                            Key Features
                          </h4>
                          <ul className="space-y-2 text-zinc-400">
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Registry of valid signature sources</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>
                                Fallback to self-verification for direct
                                withdrawals
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Support for both ETH and ERC20 tokens</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Expandable validation interface</span>
                            </li>
                          </ul>
                        </div>

                        <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-950">
                          <h4 className="font-bold mb-2 text-violet-400">
                            Contract Flow
                          </h4>
                          <ol className="space-y-2 text-zinc-400 list-decimal pl-5">
                            <li>User deposits assets (ETH or ERC20 tokens)</li>
                            <li>Assets are locked in the contract</li>
                            <li>Withdrawal requires a valid signature</li>
                            <li>
                              Signature can come from the user or a registered
                              validator
                            </li>
                            <li>
                              Contract verifies the signature before releasing
                              funds
                            </li>
                          </ol>
                        </div>
                      </div>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                      <h3 className="text-xl font-bold mb-4">Contract Code</h3>
                      <div className="bg-zinc-950 p-4 rounded-md font-mono text-sm overflow-x-auto mb-4">
                        <pre className="text-zinc-400">
                          {`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ZKredit {
    // Mapping of registered validators
    mapping(address => bool) public validators;
    
    // Mapping of user balances: user => token => amount
    mapping(address => mapping(address => uint256)) public balances;
    
    // Withdraw assets with validator signature
    function withdraw(
        address token, 
        uint256 amount, 
        address validator, 
        bytes calldata signature
    ) external {
        // If validator is not registered, check if it's the user's own address
        if (!validators[validator]) {
            require(validator == msg.sender, "Invalid validator");
            // No signature verification needed for self-withdrawals
        } else {
            // Verify signature from registered validator
            bytes32 messageHash = keccak256(abi.encodePacked(
                msg.sender,
                token,
                amount,
                block.chainid,
                address(this)
            ));
            
            // Verify signature...
        }
        
        // Transfer assets...
    }
}`}
                        </pre>
                      </div>

                      <Button
                        className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700"
                        onClick={() => setActiveTab("registry")}
                      >
                        Explore Registry Implementation{" "}
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="registry" className="space-y-4">
                  <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-900/30">
                    <div className="space-y-2 mb-8">
                      <h2 className="text-2xl font-bold">
                        Registry-Based Delegation
                      </h2>
                      <p className="text-zinc-400">
                        Create sub-wallets with custom spending limits and asset
                        restrictions for team management and controlled
                        delegation.
                      </p>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-6">
                      <h3 className="text-xl font-bold mb-4">
                        Registry Architecture
                      </h3>
                      <p className="text-zinc-400 mb-6">
                        The registry contract provides granular control over
                        which accounts have access to which tokens, with
                        customizable spending limits.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-950">
                          <h4 className="font-bold mb-2 text-violet-400">
                            Key Features
                          </h4>
                          <ul className="space-y-2 text-zinc-400">
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>
                                Create sub-wallets with custom permissions
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>
                                Set spending limits per token and sub-wallet
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Track spending against limits</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>
                                Reset spending periods (e.g., monthly)
                              </span>
                            </li>
                          </ul>
                        </div>

                        <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-950">
                          <h4 className="font-bold mb-2 text-violet-400">
                            Use Cases
                          </h4>
                          <ul className="space-y-2 text-zinc-400">
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>
                                Company expense accounts with monthly limits
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>
                                Team budgets with restricted token access
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>
                                Delegated spending for specific projects
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>
                                Controlled access to organizational funds
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                      <h3 className="text-xl font-bold mb-4">Registry Code</h3>
                      <div className="bg-zinc-950 p-4 rounded-md font-mono text-sm overflow-x-auto mb-4">
                        <pre className="text-zinc-400">
                          {`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ZKreditRegistry {
    // Main ZKredit contract
    IZKredit public zkredit;
    
    // Mapping of sub-wallets: owner => sub-wallet => token => allowed
    mapping(address => mapping(address => mapping(address => bool))) public allowances;
    
    // Mapping of sub-wallet spending limits: owner => sub-wallet => token => limit
    mapping(address => mapping(address => mapping(address => uint256))) public spendingLimits;
    
    // Mapping of sub-wallet spent amounts: owner => sub-wallet => token => spent
    mapping(address => mapping(address => mapping(address => uint256))) public spentAmounts;
    
    // Grant access to a sub-wallet for a specific token
    function grantAccess(address subWallet, address token, uint256 limit) external {
        allowances[msg.sender][subWallet][token] = true;
        spendingLimits[msg.sender][subWallet][token] = limit;
        spentAmounts[msg.sender][subWallet][token] = 0;
    }
    
    // Approve withdrawal for a sub-wallet
    function approveWithdrawal(address owner, address token, uint256 amount) external returns (bytes memory) {
        require(allowances[owner][msg.sender][token], "Not authorized");
        
        uint256 limit = spendingLimits[owner][msg.sender][token];
        if (limit > 0) {
            uint256 spent = spentAmounts[owner][msg.sender][token];
            require(spent + amount <= limit, "Exceeds spending limit");
            spentAmounts[owner][msg.sender][token] = spent + amount;
        }
        
        // Generate signature for ZKredit withdrawal...
    }
}`}
                        </pre>
                      </div>

                      <div className="flex space-x-4">
                        <Button
                          variant="outline"
                          className="border-zinc-700 text-white hover:bg-zinc-800"
                          onClick={() => setActiveTab("base-contract")}
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Back to Base Contract
                        </Button>
                        <Button
                          className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700"
                          onClick={() => setActiveTab("cex-trust")}
                        >
                          Explore CEX Trust-Us Implementation{" "}
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="cex-trust" className="space-y-4">
                  <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-900/30">
                    <div className="space-y-2 mb-8">
                      <h2 className="text-2xl font-bold">
                        CEX &quot;Trust-Us&quot; Verification
                      </h2>
                      <p className="text-zinc-400">
                        Use assets held in centralized exchanges without
                        withdrawing first. The exchange verifies your ownership
                        and approves transactions.
                      </p>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-6">
                      <h3 className="text-xl font-bold mb-4">
                        CEX Validator Architecture
                      </h3>
                      <p className="text-zinc-400 mb-6">
                        The CEX validator mimics a centralized exchange that
                        verifies if a wallet is controlled by the exchange and
                        checks internal balances.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-950">
                          <h4 className="font-bold mb-2 text-violet-400">
                            Key Features
                          </h4>
                          <ul className="space-y-2 text-zinc-400">
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Use CEX assets without withdrawing</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>CEX verifies user balances internally</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>CEX signs withdrawal approvals</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>
                                No need to pre-fund blockchain wallets
                              </span>
                            </li>
                          </ul>
                        </div>

                        <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-950">
                          <h4 className="font-bold mb-2 text-violet-400">
                            How It Works
                          </h4>
                          <ol className="space-y-2 text-zinc-400 list-decimal pl-5">
                            <li>
                              CEX maintains internal record of user balances
                            </li>
                            <li>User requests to use assets on-chain</li>
                            <li>CEX verifies user has sufficient balance</li>
                            <li>CEX signs approval for ZKredit withdrawal</li>
                            <li>
                              User can operate on any chain without moving
                              assets
                            </li>
                          </ol>
                        </div>
                      </div>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                      <h3 className="text-xl font-bold mb-4">
                        CEX Validator Code
                      </h3>
                      <div className="bg-zinc-950 p-4 rounded-md font-mono text-sm overflow-x-auto mb-4">
                        <pre className="text-zinc-400">
                          {`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CEXTrustUsValidator {
    // Mapping of CEX-controlled wallets
    mapping(address => bool) public cexWallets;
    
    // Mapping of user balances in the CEX: user => token => amount
    mapping(address => mapping(address => uint256)) private userBalances;
    
    // Check if a user has sufficient balance for a withdrawal
    function hasSufficientBalance(
        address user, 
        address token, 
        uint256 amount
    ) public view returns (bool) {
        return userBalances[user][token] >= amount;
    }
    
    // Generate signature for withdrawal
    function approveWithdrawal(
        address user, 
        address token, 
        uint256 amount, 
        address zkredit
    ) external returns (bytes memory) {
        require(cexWallets[msg.sender], "Not a CEX-controlled wallet");
        require(hasSufficientBalance(user, token, amount), "Insufficient balance");
        
        // Reduce user balance
        userBalances[user][token] -= amount;
        
        // Generate signature for ZKredit withdrawal...
    }
}`}
                        </pre>
                      </div>

                      <div className="flex space-x-4">
                        <Button
                          variant="outline"
                          className="border-zinc-700 text-white hover:bg-zinc-800"
                          onClick={() => setActiveTab("registry")}
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Back to Registry
                        </Button>
                        <Button
                          className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700"
                          onClick={() => setActiveTab("sp1-credit")}
                        >
                          Explore SP1 Credit Verification{" "}
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="sp1-credit" className="space-y-4">
                  <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-900/30">
                    <div className="space-y-2 mb-8">
                      <h2 className="text-2xl font-bold">
                        SP1 Credit Verification
                      </h2>
                      <p className="text-zinc-400">
                        Prove your borrowing capacity without revealing
                        sensitive financial information using SP1 zero-knowledge
                        circuits.
                      </p>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-6">
                      <h3 className="text-xl font-bold mb-4">
                        SP1 Credit Verification Architecture
                      </h3>
                      <p className="text-zinc-400 mb-6">
                        SP1 is a zero-knowledge proof system that allows
                        verification of credit lines while keeping financial
                        details private.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-950">
                          <h4 className="font-bold mb-2 text-violet-400">
                            Key Features
                          </h4>
                          <ul className="space-y-2 text-zinc-400">
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>
                                Privacy-preserving credit verification
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>
                                Prove credit-worthiness without revealing
                                details
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>
                                Cryptographic verification of credit lines
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>
                                On-chain verification of off-chain data
                              </span>
                            </li>
                          </ul>
                        </div>

                        <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-950">
                          <h4 className="font-bold mb-2 text-violet-400">
                            How It Works
                          </h4>
                          <ol className="space-y-2 text-zinc-400 list-decimal pl-5">
                            <li>
                              Credit provider assesses user&apos;s credit-worthiness
                            </li>
                            <li>
                              User generates a zero-knowledge proof of their
                              credit line
                            </li>
                            <li>
                              Proof verifies credit without revealing sensitive
                              data
                            </li>
                            <li>
                              ZKredit contract verifies the proof on-chain
                            </li>
                            <li>
                              User can operate based on their verified credit
                              line
                            </li>
                          </ol>
                        </div>
                      </div>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                      <h3 className="text-xl font-bold mb-4">
                        SP1 Credit Verification Implementation
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-zinc-950 p-4 rounded-md font-mono text-sm overflow-x-auto">
                          <h4 className="font-bold mb-2 text-violet-400">
                            SP1 Circuit (Rust)
                          </h4>
                          <pre className="text-zinc-400">
                            {`// SP1 credit verification circuit
fn main() {
    // Input: User's credit score, income, debt
    // These inputs are private and not revealed
    let credit_score = sp1_input!(u32);
    let income = sp1_input!(u64);
    let debt = sp1_input!(u64);
    
    // Credit line threshold parameters
    let min_credit_score = 650;
    let max_debt_to_income = 40; // 40%
    
    // Verify credit score meets minimum
    sp1_assert!(credit_score >= min_credit_score);
    
    // Calculate debt-to-income ratio (percentage)
    let debt_to_income = (debt * 100) / income;
    
    // Verify debt-to-income ratio is acceptable
    sp1_assert!(debt_to_income <= max_debt_to_income);
    
    // Calculate approved credit line
    let credit_line = if credit_score > 750 {
        income / 3
    } else {
        income / 5
    };
    
    // Output only the approved credit line
    // The private inputs remain confidential
    sp1_output!(credit_line);
}`}
                          </pre>
                        </div>

                        <div className="bg-zinc-950 p-4 rounded-md font-mono text-sm overflow-x-auto">
                          <h4 className="font-bold mb-2 text-violet-400">
                            Solidity Verifier
                          </h4>
                          <pre className="text-zinc-400">
                            {`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SP1CreditVerifier {
    // Mapping of verified credit lines
    mapping(address => uint256) public creditLines;
    
    // Event emitted when a credit line is verified
    event CreditLineVerified(
        address indexed user, 
        uint256 creditLine
    );
    
    // Verify SP1 proof and record credit line
    function verifyCreditLine(
        bytes calldata proof,
        uint256 creditLine
    ) external {
        // Verify the SP1 proof
        // This would call the SP1 verification library
        bool isValid = verifyProof(proof, creditLine);
        require(isValid, "Invalid proof");
        
        // Record the verified credit line
        creditLines[msg.sender] = creditLine;
        
        emit CreditLineVerified(msg.sender, creditLine);
    }
    
    // Generate signature for ZKredit withdrawal
    function approveWithdrawal(
        address user,
        address token,
        uint256 amount,
        address zkredit
    ) external view returns (bytes memory) {
        // Check if user has sufficient credit line
        require(creditLines[user] >= amount, 
            "Insufficient credit line");
        
        // Generate signature...
    }
    
    // Mock function for proof verification
    function verifyProof(
        bytes calldata proof,
        uint256 creditLine
    ) internal pure returns (bool) {
        // In a real implementation, this would
        // verify the SP1 zero-knowledge proof
        return true;
    }
}`}
                          </pre>
                        </div>
                      </div>

                      <div className="flex space-x-4">
                        <Button
                          variant="outline"
                          className="border-zinc-700 text-white hover:bg-zinc-800"
                          onClick={() => setActiveTab("cex-trust")}
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Back to CEX Trust-Us
                        </Button>
                        <Button
                          className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700"
                          onClick={() => setActiveTab("noir-jwt")}
                        >
                          Explore Noir JWT Verification{" "}
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="noir-jwt" className="space-y-4">
                  <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-900/30">
                    <div className="space-y-2 mb-8">
                      <h2 className="text-2xl font-bold">
                        Noir JWT Organization Verification
                      </h2>
                      <p className="text-zinc-400">
                        Prove membership in a Google Workspace group without
                        revealing personal details, perfect for company-wide
                        spending accounts.
                      </p>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-6">
                      <h3 className="text-xl font-bold mb-4">
                        Noir JWT Verification Architecture
                      </h3>
                      <p className="text-zinc-400 mb-6">
                        Noir is a zero-knowledge DSL that can verify JWT tokens
                        from Google Workspace to prove organizational membership
                        without revealing personal information.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-950">
                          <h4 className="font-bold mb-2 text-violet-400">
                            Key Features
                          </h4>
                          <ul className="space-y-2 text-zinc-400">
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Verify Google Workspace membership</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Privacy-preserving verification</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>
                                Prove group membership without revealing
                                identity
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>
                                Integrate with existing organizational systems
                              </span>
                            </li>
                          </ul>
                        </div>

                        <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-950">
                          <h4 className="font-bold mb-2 text-violet-400">
                            How It Works
                          </h4>
                          <ol className="space-y-2 text-zinc-400 list-decimal pl-5">
                            <li>User authenticates with Google Workspace</li>
                            <li>
                              User receives a JWT token with group membership
                              claims
                            </li>
                            <li>
                              Noir circuit verifies JWT signature and claims
                            </li>
                            <li>
                              Circuit outputs proof of membership without
                              revealing the JWT
                            </li>
                            <li>
                              ZKredit contract verifies the proof on-chain
                            </li>
                          </ol>
                        </div>
                      </div>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                      <h3 className="text-xl font-bold mb-4">
                        Noir JWT Verification Implementation
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-zinc-950 p-4 rounded-md font-mono text-sm overflow-x-auto">
                          <h4 className="font-bold mb-2 text-violet-400">
                            Noir Circuit
                          </h4>
                          <pre className="text-zinc-400">
                            {`// Noir JWT verification circuit
fn main(
    jwt_header: [u8; 32],
    jwt_payload: [u8; 256],
    jwt_signature: [u8; 64],
    google_pubkey: [u8; 32],
    expected_domain: [u8; 32],
    expected_group: [u8; 32]
) {
    // Verify JWT signature using Google's public key
    let message_hash = sha256(jwt_header, jwt_payload);
    let is_valid = verify_ecdsa(
        message_hash, 
        jwt_signature, 
        google_pubkey
    );
    constrain is_valid == 1;
    
    // Extract claims from JWT payload
    let domain = extract_claim(jwt_payload, "hd");
    let groups = extract_claim(jwt_payload, "groups");
    
    // Verify domain matches expected domain
    constrain domain == expected_domain;
    
    // Verify group membership
    let is_member = contains(groups, expected_group);
    constrain is_member == 1;
    
    // The proof verifies that the user is a member
    // of the expected group in the expected domain
    // without revealing the actual JWT or user identity
}`}
                          </pre>
                        </div>

                        <div className="bg-zinc-950 p-4 rounded-md font-mono text-sm overflow-x-auto">
                          <h4 className="font-bold mb-2 text-violet-400">
                            Solidity Verifier
                          </h4>
                          <pre className="text-zinc-400">
                            {`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract NoirJWTVerifier {
    // Mapping of verified organizations
    mapping(address => string) public verifiedOrgs;
    
    // Mapping of organization spending limits
    mapping(string => uint256) public orgSpendingLimits;
    
    // Event emitted when a membership is verified
    event MembershipVerified(
        address indexed user, 
        string organization
    );
    
    // Verify Noir proof and record membership
    function verifyMembership(
        bytes calldata proof,
        string calldata organization
    ) external {
        // Verify the Noir proof
        // This would call the Noir verification library
        bool isValid = verifyProof(proof);
        require(isValid, "Invalid proof");
        
        // Record the verified organization
        verifiedOrgs[msg.sender] = organization;
        
        emit MembershipVerified(msg.sender, organization);
    }
    
    // Generate signature for ZKredit withdrawal
    function approveWithdrawal(
        address user,
        address token,
        uint256 amount,
        address zkredit
    ) external view returns (bytes memory) {
        string memory org = verifiedOrgs[user];
        require(bytes(org).length > 0, 
            "Not a verified member");
        
        // Check if amount is within org spending limit
        require(amount <= orgSpendingLimits[org], 
            "Exceeds organization spending limit");
        
        // Generate signature...
    }
    
    // Mock function for proof verification
    function verifyProof(
        bytes calldata proof
    ) internal pure returns (bool) {
        // In a real implementation, this would
        // verify the Noir zero-knowledge proof
        return true;
    }
}`}
                          </pre>
                        </div>
                      </div>

                      <div className="flex space-x-4">
                        <Button
                          variant="outline"
                          className="border-zinc-700 text-white hover:bg-zinc-800"
                          onClick={() => setActiveTab("sp1-credit")}
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Back to SP1 Credit
                        </Button>
                        <Button
                          className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700"
                          onClick={() => setActiveTab("base-contract")}
                        >
                          Return to Base Contract{" "}
                          <ArrowLeft className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="default-spending" className="space-y-4">
                  <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-900/30">
                    <div className="space-y-2 mb-8">
                      <h2 className="text-2xl font-bold">Default Spending</h2>
                      <p className="text-zinc-400">
                        Skip transfers completely and use funds directly from
                        the owner of Account Abstraction wallets.
                      </p>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-6">
                      <h3 className="text-xl font-bold mb-4">
                        Default Spending Architecture
                      </h3>
                      <p className="text-zinc-400 mb-6">
                        Default Spending leverages Account Abstraction to allow
                        direct spending from the owner&apos;s wallet without
                        requiring transfers.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-950">
                          <h4 className="font-bold mb-2 text-violet-400">
                            Key Features
                          </h4>
                          <ul className="space-y-2 text-zinc-400">
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>No pre-funding or transfers required</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Direct spending from owner&apos;s wallet</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>
                                Leverages Account Abstraction (ERC-4337)
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Simplified user experience</span>
                            </li>
                          </ul>
                        </div>

                        <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-950">
                          <h4 className="font-bold mb-2 text-violet-400">
                            How It Works
                          </h4>
                          <ol className="space-y-2 text-zinc-400 list-decimal pl-5">
                            <li>User creates an Account Abstraction wallet</li>
                            <li>
                              User authorizes ZKredit as a spending validator
                            </li>
                            <li>ZKredit verifies the user&apos;s ownership</li>
                            <li>
                              Transactions are executed directly from the
                              owner&apos;s wallet
                            </li>
                            <li>No need to pre-fund or transfer assets</li>
                          </ol>
                        </div>
                      </div>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                      <h3 className="text-xl font-bold mb-4">
                        Default Spending Implementation
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-zinc-950 p-4 rounded-md font-mono text-sm overflow-x-auto">
                          <h4 className="font-bold mb-2 text-violet-400">
                            Account Abstraction Setup
                          </h4>
                          <pre className="text-zinc-400">
                            {`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@account-abstraction/contracts/core/EntryPoint.sol";
import "@account-abstraction/contracts/interfaces/IAccount.sol";

contract ZKreditAAWallet is IAccount {
    address public owner;
    address public zkredit;
    EntryPoint public entryPoint;
    
    constructor(
        address _owner,
        address _zkredit,
        address _entryPoint
    ) {
        owner = _owner;
        zkredit = _zkredit;
        entryPoint = EntryPoint(_entryPoint);
    }
    
    // Validate user operation
    function validateUserOp(
        UserOperation calldata userOp,
        bytes32 userOpHash,
        uint256 missingAccountFunds
    ) external override returns (uint256 validationData) {
        // Verify the operation is from ZKredit
        // or signed by the owner
        if (msg.sender == address(entryPoint)) {
            if (userOp.sender == zkredit) {
                // ZKredit is authorized to spend
                return 0; // Valid
            }
            
            // Verify owner signature
            bytes32 hash = userOpHash;
            bytes memory signature = userOp.signature;
            // Verify signature...
        }
        
        return 1; // Invalid by default
    }
}`}
                          </pre>
                        </div>

                        <div className="bg-zinc-950 p-4 rounded-md font-mono text-sm overflow-x-auto">
                          <h4 className="font-bold mb-2 text-violet-400">
                            ZKredit Default Spending
                          </h4>
                          <pre className="text-zinc-400">
                            {`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@account-abstraction/contracts/core/EntryPoint.sol";

contract ZKreditDefaultSpending {
    EntryPoint public entryPoint;
    
    // Mapping of verified AA wallets
    mapping(address => bool) public verifiedWallets;
    
    constructor(address _entryPoint) {
        entryPoint = EntryPoint(_entryPoint);
    }
    
    // Verify and register an AA wallet
    function verifyWallet(address wallet) external {
        // Verify the wallet is valid
        // and owned by the caller
        // ...
        
        verifiedWallets[wallet] = true;
    }
    
    // Execute a transaction from the AA wallet
    function executeTransaction(
        address wallet,
        address target,
        uint256 value,
        bytes calldata data
    ) external {
        require(verifiedWallets[wallet], 
            "Wallet not verified");
        
        // Create a user operation
        UserOperation memory userOp = UserOperation({
            sender: wallet,
            nonce: entryPoint.getNonce(wallet, 0),
            initCode: bytes(""),
            callData: abi.encodeWithSelector(
                bytes4(keccak256("execute(address,uint256,bytes)")),
                target,
                value,
                data
            ),
            callGasLimit: 2000000,
            verificationGasLimit: 1000000,
            preVerificationGas: 100000,
            maxFeePerGas: tx.gasprice,
            maxPriorityFeePerGas: tx.gasprice,
            paymasterAndData: bytes(""),
            signature: bytes("")
        });
        
        // Execute the operation
        entryPoint.handleOps(
            [userOp],
            payable(msg.sender)
        );
    }
}`}
                          </pre>
                        </div>
                      </div>

                      <div className="flex space-x-4">
                        <Button
                          variant="outline"
                          className="border-zinc-700 text-white hover:bg-zinc-800"
                          onClick={() => setActiveTab("noir-jwt")}
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Back to Noir JWT
                        </Button>
                        <Button
                          className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700"
                          onClick={() => setActiveTab("base-contract")}
                        >
                          Return to Base Contract{" "}
                          <ArrowLeft className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-zinc-900 border-zinc-800 hover:border-violet-500/50 transition-all duration-300">
                <CardHeader>
                  <Code className="h-10 w-10 text-violet-500 mb-2" />
                  <CardTitle className="text-white">
                    Expandable Architecture
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Built for composability
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-zinc-400">
                  <p>
                    ZKredit&apos;s modular design allows for easy integration of new
                    verification methods and use cases.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800 hover:border-violet-500/50 transition-all duration-300">
                <CardHeader>
                  <Shield className="h-10 w-10 text-violet-500 mb-2" />
                  <CardTitle className="text-white">
                    Privacy-Preserving
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Zero-knowledge by design
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-zinc-400">
                  <p>
                    Verify assets and credentials without revealing sensitive
                    information, keeping your financial details private.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800 hover:border-violet-500/50 transition-all duration-300">
                <CardHeader>
                  <Network className="h-10 w-10 text-violet-500 mb-2" />
                  <CardTitle className="text-white">
                    Cross-Chain Ready
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Operate anywhere
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-zinc-400">
                  <p>
                    Use your assets on any blockchain without pre-funding or
                    bridging, maximizing capital efficiency.
                  </p>
                </CardContent>
              </Card>
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
            <p className="text-sm text-zinc-500">
              © 2025 ZKredit. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
