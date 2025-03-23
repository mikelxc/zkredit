"use client";
import { useState } from "react";
import { ArrowLeft, ChevronRight, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
                  <TabsTrigger value="base-contract">Core Contract</TabsTrigger>
                  <TabsTrigger value="registry">Registry</TabsTrigger>
                  <TabsTrigger value="default-validator">Default Validator</TabsTrigger>
                  <TabsTrigger value="paymaster">Paymaster</TabsTrigger>
                  <TabsTrigger value="sp1-credit">SP1 Credit</TabsTrigger>
                  <TabsTrigger value="noir-jwt">Noir JWT</TabsTrigger>
                </TabsList>

                <TabsContent value="base-contract" className="space-y-4">
                  <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-900/30">
                    <div className="space-y-2 mb-8">
                      <h2 className="text-2xl font-bold">
                        ZKredit Core Contract
                      </h2>
                      <p className="text-zinc-400">
                        The foundation of ZKredit is a smart contract that handles deposits, withdrawals, 
                        and validates operations through a registry of validators.
                      </p>
                      <p className="text-sm text-violet-400 mt-2">
                        Deployed at: 0x4d967ae3e0ccb462582b46891d92f0d7efe5e522
                      </p>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-6">
                      <h3 className="text-xl font-bold mb-4">
                        Contract Architecture
                      </h3>
                      <p className="text-zinc-400 mb-6">
                        ZKreditCore implements a robust system for asset handling with validator-based 
                        approval flow, ERC-4337 compatibility, and upgradability.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-950">
                          <h4 className="font-bold mb-2 text-violet-400">
                            Key Features
                          </h4>
                          <ul className="space-y-2 text-zinc-400">
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Deposits for ETH and ERC20 tokens</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>
                                Validator-based approval system
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>ERC-4337 account abstraction integration</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>UUPS upgradable contract architecture</span>
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
                            <li>Withdrawal requires validation (user or validator)</li>
                            <li>
                              Validator evaluates withdrawal requests
                            </li>
                            <li>
                              Contract completes transfer to recipient
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
pragma solidity ^0.8.29;

contract ZKreditCore is
    IZKreditCore,
    Initializable,
    UUPSUpgradeable,
    OwnableUpgradeable
{
    // Balances mapping (depositor => token => amount)
    mapping(address => mapping(address => uint256)) private _balances;

    // Deposit ETH
    function depositNative(
        address depositor
    ) external payable override whenNotPaused {
        require(
            msg.value > 0,
            "ZKreditCore: deposit amount must be greater than zero"
        );

        // Update balance
        _balances[depositor][address(0)] += msg.value;

        emit Deposited(msg.sender, depositor, address(0), msg.value);
    }

    // Withdraw ETH
    function withdrawNative(
        address depositor,
        uint256 amount,
        address payable recipient,
        bytes calldata validationData
    ) external override nonReentrant whenNotPaused {
        require(
            amount > 0,
            "ZKreditCore: withdraw amount must be greater than zero"
        );
        require(
            _balances[depositor][address(0)] >= amount,
            "ZKreditCore: insufficient balance"
        );

        // Validate withdrawal
        require(
            _validateWithdrawal(
                msg.sender,
                depositor,
                address(0),
                amount,
                validationData
            ),
            "ZKreditCore: withdrawal validation failed"
        );

        // Update balance
        _balances[depositor][address(0)] -= amount;

        // Transfer ETH to recipient
        (bool success, ) = recipient.call{value: amount}("");
        require(success, "ZKreditCore: native transfer failed");

        emit Withdrawn(msg.sender, depositor, address(0), recipient, amount);
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
                        ZKredit Registry
                      </h2>
                      <p className="text-zinc-400">
                        Registry contract that manages depositors and their associated validators,
                        enabling granular control over validator access.
                      </p>
                      <p className="text-sm text-violet-400 mt-2">
                        Deployed at: 0x4b2c79367e640f537e823cb14683256a5de4cf83
                      </p>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-6">
                      <h3 className="text-xl font-bold mb-4">
                        Registry Architecture
                      </h3>
                      <p className="text-zinc-400 mb-6">
                        The registry contract provides a directory of depositors, associating them with
                        specific validators that control access to their funds.
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
                                Register depositors with validators
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>
                                Assign managers to validators
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Control depositor active status</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>
                                Store custom metadata per depositor
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
                                Organizations with multiple validators
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>
                                Delegated management of validators
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>
                                Tracking active vs. inactive depositors
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>
                                Batch operations for efficient management
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
pragma solidity ^0.8.29;

contract ZKreditRegistry is
    IZKreditRegistry,
    Initializable,
    UUPSUpgradeable,
    OwnableUpgradeable
{
    // Mapping of depositor address to DepositorInfo
    mapping(address => DepositorInfo) private _depositorInfo;

    // Set of all registered depositors for enumeration
    EnumerableSet.AddressSet private _depositors;

    // Mapping of validator address to approved managers (manager => isApproved)
    mapping(address => mapping(address => bool)) private _validatorManagers;

    /**
     * @inheritdoc IZKreditRegistry
     */
    function registerDepositor(
        address depositor,
        address validator,
        bytes calldata metadata
    ) external override onlyValidatorManagerOrOwner(validator) {
        require(
            depositor != address(0),
            "ZKreditRegistry: depositor cannot be zero address"
        );

        // Create or update depositor info
        _depositorInfo[depositor] = DepositorInfo({
            validator: validator,
            isActive: true,
            metadata: metadata
        });

        // Add to enumeration set if not already present
        _depositors.add(depositor);

        emit DepositorRegistered(depositor, validator, metadata);
    }

    /**
     * @inheritdoc IZKreditRegistry
     */
    function setDepositorActive(
        address depositor,
        bool isActive
    )
        external
        override
        onlyValidatorManagerOrOwner(_depositorInfo[depositor].validator)
    {
        require(
            _depositors.contains(depositor),
            "ZKreditRegistry: depositor not registered"
        );

        _depositorInfo[depositor].isActive = isActive;

        emit DepositorActiveStatusChanged(depositor, isActive);
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
                          Back to Core Contract
                        </Button>
                        <Button
                          className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700"
                          onClick={() => setActiveTab("default-validator")}
                        >
                          Explore Default Validator{" "}
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="default-validator" className="space-y-4">
                  <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-900/30">
                    <div className="space-y-2 mb-8">
                      <h2 className="text-2xl font-bold">
                        Default Validator
                      </h2>
                      <p className="text-zinc-400">
                        The default validator verifies signatures for withdrawals and manages authorization of signers.
                      </p>
                      <p className="text-sm text-violet-400 mt-2">
                        Deployed at: 0x817c41d4dd5bca085f31251da0c5d086fd9cc6e8
                      </p>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-6">
                      <h3 className="text-xl font-bold mb-4">
                        Validator Architecture
                      </h3>
                      <p className="text-zinc-400 mb-6">
                        The DefaultValidator implements signature-based verification for withdrawals and paymaster
                        operations, with nonce tracking to prevent replay attacks.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-950">
                          <h4 className="font-bold mb-2 text-violet-400">
                            Key Features
                          </h4>
                          <ul className="space-y-2 text-zinc-400">
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Cryptographic signature verification</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Nonce tracking to prevent replay attacks</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Management of authorized signers</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>ERC-4337 account abstraction support</span>
                            </li>
                          </ul>
                        </div>

                        <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-950">
                          <h4 className="font-bold mb-2 text-violet-400">
                            How It Works
                          </h4>
                          <ol className="space-y-2 text-zinc-400 list-decimal pl-5">
                            <li>User or application submits withdrawal request</li>
                            <li>Request includes depositor signature or validator signature</li>
                            <li>Contract verifies signatures and nonces</li>
                            <li>Successful validation allows withdrawal</li>
                            <li>Same flow applies to ERC-4337 paymaster operations</li>
                          </ol>
                        </div>
                      </div>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                      <h3 className="text-xl font-bold mb-4">
                        Default Validator Code
                      </h3>
                      <div className="bg-zinc-950 p-4 rounded-md font-mono text-sm overflow-x-auto mb-4">
                        <pre className="text-zinc-400">
                          {`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

contract DefaultValidator is
    IZKreditValidator,
    Initializable,
    UUPSUpgradeable,
    OwnableUpgradeable
{
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    // Mapping to track used nonces (nonce => isUsed)
    mapping(bytes32 => bool) public usedNonces;

    // Mapping of authorized admin signers (signer => isAuthorized)
    mapping(address => bool) public authorizedSigners;

    /**
     * @inheritdoc IZKreditValidator
     */
    function validateWithdrawal(
        address caller,
        address depositor,
        address token,
        uint256 amount,
        bytes calldata data
    ) external view override returns (bool) {
        // If caller is the depositor, always allow
        if (caller == depositor) {
            return true;
        }

        // If no data provided, reject for non-depositor callers
        if (data.length == 0) {
            return false;
        }

        // Decode signature data
        (bytes memory signature, bytes32 nonce) = abi.decode(
            data,
            (bytes, bytes32)
        );

        // Check if nonce has been used
        if (usedNonces[nonce]) {
            return false;
        }

        // Hash the withdrawal data
        bytes32 messageHash = keccak256(
            abi.encodePacked(
                caller,
                depositor,
                token,
                amount,
                nonce,
                block.chainid
            )
        );

        // Prefix the hash (EIP-191)
        bytes32 prefixedHash = messageHash.toEthSignedMessageHash();

        // Recover signer
        address signer = ECDSA.recover(prefixedHash, signature);

        // If the signer is the depositor, allow the withdrawal
        if (signer == depositor) {
            return true;
        }

        // If the signer is an authorized admin, also allow
        return authorizedSigners[signer];
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
                          onClick={() => setActiveTab("paymaster")}
                        >
                          Explore Paymaster Integration{" "}
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="paymaster" className="space-y-4">
                  <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-900/30">
                    <div className="space-y-2 mb-8">
                      <h2 className="text-2xl font-bold">
                        ZKredit Paymaster
                      </h2>
                      <p className="text-zinc-400">
                        The paymaster contract enables ZKredit funds to be used for gas fees via ERC-4337 account abstraction.
                      </p>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-6">
                      <h3 className="text-xl font-bold mb-4">
                        Paymaster Architecture
                      </h3>
                      <p className="text-zinc-400 mb-6">
                        ZKreditPaymaster integrates with the ERC-4337 EntryPoint contract to allow users to spend their deposited funds for transaction gas fees.
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
                                ERC-4337 account abstraction support
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>
                                Pay gas fees with ZKredit deposits
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>Support for multiple token types</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>
                                Authorized validator-based approval flow
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
                              User initiates UserOperation with ZKredit paymaster
                            </li>
                            <li>Paymaster validates the operation</li>
                            <li>
                              ZKredit core verifies user has sufficient funds
                            </li>
                            <li>
                              Validator approves spending from user&apos;s deposits
                            </li>
                            <li>
                              Transaction completes with gas fees covered by ZKredit
                            </li>
                          </ol>
                        </div>
                      </div>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                      <h3 className="text-xl font-bold mb-4">
                        Paymaster Code
                      </h3>
                      <div className="bg-zinc-950 p-4 rounded-md font-mono text-sm overflow-x-auto mb-4">
                        <pre className="text-zinc-400">
                          {`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

contract ZKreditPaymaster is
    IZKreditPaymaster,
    Initializable,
    UUPSUpgradeable,
    OwnableUpgradeable
{
    using SafeERC20 for IERC20;

    // The EntryPoint contract
    IEntryPoint public entryPoint;

    // The ZKredit core contract
    IZKreditCore public zkreditCore;

    // Mapping of tokens supported by this paymaster (token => isSupported)
    mapping(address => bool) public supportedTokens;

    /**
     * @inheritdoc IPaymaster
     */
    function validatePaymasterUserOp(
        PackedUserOperation calldata userOp,
        bytes32 userOpHash,
        uint256 maxCost
    )
        external
        override
        onlyEntryPoint
        whenNotPaused
        returns (bytes memory context, uint256 validationData)
    {
        // Extract paymaster data
        (
            address token,
            address depositor,
            bytes memory validationBytes
        ) = _parsePaymasterData(userOp.paymasterAndData);

        require(
            supportedTokens[token],
            "ZKreditPaymaster: token not supported"
        );

        // Check if depositor has enough balance
        require(
            zkreditCore.balanceOf(depositor, token) >= maxCost,
            "ZKreditPaymaster: insufficient depositor balance"
        );

        // Try to pre-fund the transaction using ZKreditCore
        bool success = zkreditCore.preTx(
            userOp.sender,
            depositor,
            token,
            maxCost,
            validationBytes
        );

        require(success, "ZKreditPaymaster: preTx failed");

        // Encode context for postOp
        context = abi.encode(userOp.sender, depositor, token, maxCost);

        // No deadline (validUntil/validAfter) or aggregator
        validationData = 0;

        return (context, validationData);
    }`}
                        </pre>
                      </div>

                      <div className="flex space-x-4">
                        <Button
                          variant="outline"
                          className="border-zinc-700 text-white hover:bg-zinc-800"
                          onClick={() => setActiveTab("default-validator")}
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Back to Default Validator
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
                      <p className="text-sm text-amber-400 mt-2">
                        Coming Soon - Integration in Progress
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
                            Planned Features
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
                                Prove credit-worthiness without revealing details
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>
                                Integration with ZKredit validation system
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>
                                Custom validator implementation for SP1 proofs
                              </span>
                            </li>
                          </ul>
                        </div>

                        <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-950">
                          <h4 className="font-bold mb-2 text-violet-400">
                            Implementation Status
                          </h4>
                          <div className="space-y-4 text-zinc-400">
                            <p>
                              The SP1 credit verification is currently under development. 
                              It will extend the ZKredit validator system with SP1-specific 
                              proof verification.
                            </p>
                            <p>
                              This validator will accept zero-knowledge proofs generated off-chain
                              that demonstrate a user&apos;s credit-worthiness without revealing
                              sensitive financial details.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-4 justify-end">
                      <Button
                        variant="outline"
                        className="border-zinc-700 text-white hover:bg-zinc-800"
                        onClick={() => setActiveTab("paymaster")}
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Paymaster
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
                      <p className="text-sm text-amber-400 mt-2">
                        Coming Soon - Integration in Progress
                      </p>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-6">
                      <h3 className="text-xl font-bold mb-4">
                        Noir JWT Verification Architecture
                      </h3>
                      <p className="text-zinc-400 mb-6">
                        This implementation uses Noir to verify JWT tokens from 
                        identity providers like Google, allowing users to prove 
                        organizational membership without revealing personal details.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-950">
                          <h4 className="font-bold mb-2 text-violet-400">
                            Planned Features
                          </h4>
                          <ul className="space-y-2 text-zinc-400">
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>
                                Privacy-preserving organization membership verification
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>
                                Support for Google Workspace and other identity providers
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>
                                Custom Noir circuits for JWT validation
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>
                                Integration with ZKredit validator system
                              </span>
                            </li>
                          </ul>
                        </div>

                        <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-950">
                          <h4 className="font-bold mb-2 text-violet-400">
                            Implementation Status
                          </h4>
                          <div className="space-y-4 text-zinc-400">
                            <p>
                              The Noir JWT verification is under active development. 
                              It will allow users to generate proofs from their 
                              organizational JWT tokens and use these proofs with ZKredit.
                            </p>
                            <p>
                              This validator will enable corporate treasuries to manage 
                              spend limits for members without requiring each member to 
                              have upfront funds.
                            </p>
                          </div>
                        </div>
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
                        variant="outline"
                        className="border-zinc-700 text-white hover:bg-zinc-800"
                        onClick={() => setActiveTab("base-contract")}
                      >
                        Return to Core Contract{" "}
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </section>
        </main>
      </PageTransition>
    </div>
  );
}
