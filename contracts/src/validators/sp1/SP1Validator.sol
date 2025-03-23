// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

import {ISP1Verifier} from "@sp1-contracts/ISP1Verifier.sol";
import {ECDSA} from "openzeppelin-contracts/contracts/utils/cryptography/ECDSA.sol";
import {MessageHashUtils} from "openzeppelin-contracts/contracts/utils/cryptography/MessageHashUtils.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";
import {PackedUserOperation} from "account-abstraction/interfaces/PackedUserOperation.sol";
import {IZKreditValidator} from "../../interfaces/IZKredit.sol";

/**
 * @title SP1CreditValidator
 * @notice Validator that verifies credit line claims using SP1 ZK proofs
 */
contract SP1CreditValidator is IZKreditValidator, Ownable {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    // ============ Constants ============

    /// @notice Current contract version
    uint256 public constant VERSION = 1;

    // ============ Storage ============

    /// @notice The SP1 verifier contract address
    address public verifier;

    /// @notice The verification key for the credit line program
    bytes32 public creditProgramVKey;

    /// @notice Mapping to track used proof hashes (proofHash => isUsed)
    mapping(bytes32 => bool) public usedProofs;

    /// @notice Mapping of authorized credit providers (provider => isAuthorized)
    mapping(address => bool) public authorizedProviders;

    // ============ Structs ============

    /// @notice Structure for public values from the SP1 proof
    struct CreditLineProof {
        address user; // User wallet address
        uint256 creditAmount; // Approved credit line amount
        uint256 validUntil; // Timestamp until which the credit is valid
        address provider; // Credit provider address
    }

    // ============ Events ============

    /// @notice Emitted when a proof is used
    event ProofUsed(bytes32 indexed proofHash);

    /// @notice Emitted when a provider's authorization status is updated
    event ProviderAuthorizationChanged(
        address indexed provider,
        bool isAuthorized
    );

    /// @notice Emitted when the verification key is updated
    event VerificationKeyUpdated(bytes32 newVKey);

    // ============ Constructor ============

    constructor(
        address _verifier,
        bytes32 _creditProgramVKey,
        address initialOwner
    ) Ownable(initialOwner) {
        verifier = _verifier;
        creditProgramVKey = _creditProgramVKey;
    }

    // ============ External Functions ============

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

        // Decode proof data from the calldata
        (bytes memory publicValues, bytes memory proofBytes) = abi.decode(
            data,
            (bytes, bytes)
        );

        // Create a unique hash for this proof
        bytes32 proofHash = keccak256(abi.encodePacked(proofBytes));

        // Check if proof has been used
        if (usedProofs[proofHash]) {
            return false;
        }

        try
            ISP1Verifier(verifier).verifyProof(
                creditProgramVKey,
                publicValues,
                proofBytes
            )
        {
            // Decode public values
            CreditLineProof memory creditProof = abi.decode(
                publicValues,
                (CreditLineProof)
            );

            // Validate the proof is for the correct user and has not expired
            if (
                creditProof.user != depositor ||
                creditProof.validUntil < block.timestamp ||
                creditProof.creditAmount < amount ||
                !authorizedProviders[creditProof.provider]
            ) {
                return false;
            }

            // Proof is valid
            return true;
        } catch {
            // Proof verification failed
            return false;
        }
    }

    /**
     * @inheritdoc IZKreditValidator
     */
    function validatePaymasterUserOp(
        PackedUserOperation calldata userOp,
        bytes32 userOpHash,
        uint256 maxCost,
        address caller,
        address depositor,
        address token,
        bytes calldata data
    ) external view override returns (bool) {
        // Reuse the same validation logic as withdrawals
        return validateWithdrawal(caller, depositor, token, maxCost, data);
    }

    // ============ External Management Functions ============

    /**
     * @notice Marks a proof as used
     * @param proofHash The hash of the proof to mark as used
     */
    function useProof(bytes32 proofHash) external onlyOwner {
        usedProofs[proofHash] = true;
        emit ProofUsed(proofHash);
    }

    /**
     * @notice Sets the authorization status of a credit provider
     * @param provider The provider address
     * @param isAuthorized Whether the provider is authorized
     */
    function setAuthorizedProvider(
        address provider,
        bool isAuthorized
    ) external onlyOwner {
        require(
            provider != address(0),
            "SP1CreditValidator: provider cannot be zero address"
        );

        authorizedProviders[provider] = isAuthorized;

        emit ProviderAuthorizationChanged(provider, isAuthorized);
    }

    /**
     * @notice Batch sets the authorization status of multiple providers
     * @param providers Array of provider addresses
     * @param isAuthorized Whether the providers are authorized
     */
    function batchSetAuthorizedProviders(
        address[] calldata providers,
        bool isAuthorized
    ) external onlyOwner {
        for (uint256 i = 0; i < providers.length; i++) {
            address provider = providers[i];
            require(
                provider != address(0),
                "SP1CreditValidator: provider cannot be zero address"
            );

            authorizedProviders[provider] = isAuthorized;

            emit ProviderAuthorizationChanged(provider, isAuthorized);
        }
    }

    /**
     * @notice Updates the verification key for the credit program
     * @param _creditProgramVKey The new verification key
     */
    function updateVerificationKey(
        bytes32 _creditProgramVKey
    ) external onlyOwner {
        creditProgramVKey = _creditProgramVKey;
        emit VerificationKeyUpdated(_creditProgramVKey);
    }

    /**
     * @notice Updates the SP1 verifier contract address
     * @param _verifier The new verifier address
     */
    function updateVerifier(address _verifier) external onlyOwner {
        require(
            _verifier != address(0),
            "SP1CreditValidator: verifier cannot be zero address"
        );
        verifier = _verifier;
    }
}
