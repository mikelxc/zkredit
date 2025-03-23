// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

import {ECDSA} from "openzeppelin-contracts/contracts/utils/cryptography/ECDSA.sol";
import {MessageHashUtils} from "openzeppelin-contracts/contracts/utils/cryptography/MessageHashUtils.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";
import {PackedUserOperation} from "account-abstraction/interfaces/PackedUserOperation.sol";
import {IZKreditValidator} from "./interfaces/IZKredit.sol";
import {INoirVerifier} from "./interfaces/INoirVerifier.sol";

/**
 * @title NoirJWTValidator
 * @notice Validator that verifies withdrawals using Noir-verified JWTs
 * @dev Implements the IZKreditValidator interface for ZKredit system integration
 */
contract NoirJWTValidator is IZKreditValidator, Ownable {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    // ============ Constants ============

    /// @notice Current contract version
    uint256 public constant VERSION = 1;

    // ============ Storage ============

    /// @notice The Noir verifier contract for JWT proofs
    INoirVerifier public noirVerifier;

    /// @notice Mapping of authorized JWT issuers (issuer => isAuthorized)
    mapping(bytes32 => bool) public authorizedIssuers;

    /// @notice Mapping of depositor to JWT subject claim
    mapping(address => bytes32) public depositorSubjects;

    /// @notice Mapping of group IDs to authorization status
    mapping(bytes32 => bool) public authorizedGroups;

    /// @notice Mapping to track used proofs (proofHash => isUsed)
    mapping(bytes32 => bool) public usedProofs;

    /// @notice Mapping of withdrawal requests (hash => isApproved)
    mapping(bytes32 => bool) public approvedWithdrawals;

    // ============ Structs ============

    /**
     * @notice JWT proof public inputs structure
     * @dev These are the values that the Noir circuit will expose as public inputs
     */
    struct JWTPublicInputs {
        bytes32 issuer;      // "iss" claim in JWT
        bytes32 subject;     // "sub" claim in JWT
        bytes32 audience;    // "aud" claim in JWT
        uint256 expiration;  // "exp" claim in JWT
        uint256 notBefore;   // "nbf" claim in JWT
        uint256 issuedAt;    // "iat" claim in JWT
        bytes32 jwtId;       // "jti" claim in JWT
        bytes32 groupId;     // Custom claim for group membership
    }

    // ============ Events ============

    /// @notice Emitted when a proof is used
    event ProofUsed(bytes32 indexed proofHash);

    /// @notice Emitted when an issuer's authorization status is updated
    event IssuerAuthorizationChanged(bytes32 indexed issuer, bool isAuthorized);

    /// @notice Emitted when a depositor's subject is set
    event DepositorSubjectSet(address indexed depositor, bytes32 subject);

    /// @notice Emitted when a group's authorization status is updated
    event GroupAuthorizationChanged(bytes32 indexed groupId, bool isAuthorized);

    /// @notice Emitted when a withdrawal is approved via JWT
    event WithdrawalApproved(
        address indexed caller,
        address indexed depositor,
        address indexed token,
        uint256 amount,
        bytes32 withdrawalHash
    );

    // ============ Errors ============

    error InvalidNoirProof();
    error ProofAlreadyUsed();
    error UnauthorizedIssuer();
    error UnauthorizedGroup();
    error SubjectMismatch();
    error JWTExpired();
    error JWTNotYetValid();
    error WithdrawalNotApproved();

    // ============ Constructor ============

    constructor(
        address _noirVerifier,
        address initialOwner
    ) Ownable(initialOwner) {
        require(_noirVerifier != address(0), "NoirJWTValidator: verifier cannot be zero address");
        
        noirVerifier = INoirVerifier(_noirVerifier);
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

        // Create a hash of the withdrawal details
        bytes32 withdrawalHash = keccak256(
            abi.encodePacked(
                caller,
                depositor,
                token,
                amount
            )
        );

        // Check if the withdrawal has been approved via JWT
        return approvedWithdrawals[withdrawalHash];
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
        return validateWithdrawal(
            caller,
            depositor,
            token,
            maxCost,
            data
        );
    }

    /**
     * @notice Process a JWT proof for withdrawal approval
     * @param publicInputs The JWT public inputs
     * @param proof The Noir proof
     * @param caller The address initiating the withdrawal
     * @param depositor The address that deposited the funds
     * @param token The token address (address(0) for native tokens)
     * @param amount The amount to withdraw
     */
    function processJWTProof(
        JWTPublicInputs calldata publicInputs,
        bytes calldata proof,
        address caller,
        address depositor,
        address token,
        uint256 amount
    ) external {
        // Create unique hash for this proof
        bytes32 proofHash = keccak256(abi.encodePacked(proof, publicInputs.jwtId));
        
        // Check if proof already used
        if (usedProofs[proofHash]) {
            revert ProofAlreadyUsed();
        }

        // Verify issuer authorization
        if (!authorizedIssuers[publicInputs.issuer]) {
            revert UnauthorizedIssuer();
        }

        // Verify group authorization
        if (!authorizedGroups[publicInputs.groupId]) {
            revert UnauthorizedGroup();
        }

        // Verify subject matches depositor
        if (depositorSubjects[depositor] != publicInputs.subject) {
            revert SubjectMismatch();
        }

        // Verify JWT time validity
        uint256 currentTime = block.timestamp;
        if (publicInputs.expiration < currentTime) {
            revert JWTExpired();
        }
        if (publicInputs.notBefore > currentTime) {
            revert JWTNotYetValid();
        }

        // Pack the public inputs into the format expected by the Noir verifier
        bytes32[] memory formattedPublicInputs = formatPublicInputs(publicInputs);
        
        // Verify the Noir proof
        bool isValid = noirVerifier.verify(proof, formattedPublicInputs);
        if (!isValid) {
            revert InvalidNoirProof();
        }

        // Mark proof as used
        usedProofs[proofHash] = true;
        
        // Create a hash of the withdrawal details
        bytes32 withdrawalHash = keccak256(
            abi.encodePacked(
                caller,
                depositor,
                token,
                amount
            )
        );

        // Approve the withdrawal
        approvedWithdrawals[withdrawalHash] = true;

        emit ProofUsed(proofHash);
        emit WithdrawalApproved(caller, depositor, token, amount, withdrawalHash);
    }

    // ============ External Management Functions ============

    /**
     * @notice Sets the subject for a depositor
     * @param depositor The depositor address
     * @param subject The JWT subject claim
     */
    function setDepositorSubject(address depositor, bytes32 subject) external {
        // Check if caller is owner or the depositor themselves
        require(
            msg.sender == owner() || msg.sender == depositor,
            "NoirJWTValidator: not authorized"
        );

        depositorSubjects[depositor] = subject;
        
        emit DepositorSubjectSet(depositor, subject);
    }

    /**
     * @notice Sets the authorization status of a JWT issuer
     * @param issuer The JWT issuer
     * @param isAuthorized Whether the issuer is authorized
     */
    function setIssuerAuthorization(bytes32 issuer, bool isAuthorized) external onlyOwner {
        authorizedIssuers[issuer] = isAuthorized;
        
        emit IssuerAuthorizationChanged(issuer, isAuthorized);
    }

    /**
     * @notice Sets the authorization status of a group
     * @param groupId The group ID
     * @param isAuthorized Whether the group is authorized
     */
    function setGroupAuthorization(bytes32 groupId, bool isAuthorized) external onlyOwner {
        authorizedGroups[groupId] = isAuthorized;
        
        emit GroupAuthorizationChanged(groupId, isAuthorized);
    }

    /**
     * @notice Updates the Noir verifier contract
     * @param _noirVerifier The new verifier address
     */
    function updateNoirVerifier(address _noirVerifier) external onlyOwner {
        require(_noirVerifier != address(0), "NoirJWTValidator: verifier cannot be zero address");
        noirVerifier = INoirVerifier(_noirVerifier);
    }

    // ============ Internal Functions ============

    /**
     * @notice Formats public inputs for the Noir verifier
     * @param publicInputs The JWT public inputs
     * @return bytes32[] The formatted public inputs
     */
    function formatPublicInputs(
        JWTPublicInputs memory publicInputs
    ) internal pure returns (bytes32[] memory) {
        bytes32[] memory formattedInputs = new bytes32[](8);
        
        formattedInputs[0] = publicInputs.issuer;
        formattedInputs[1] = publicInputs.subject;
        formattedInputs[2] = publicInputs.audience;
        formattedInputs[3] = bytes32(publicInputs.expiration);
        formattedInputs[4] = bytes32(publicInputs.notBefore);
        formattedInputs[5] = bytes32(publicInputs.issuedAt);
        formattedInputs[6] = publicInputs.jwtId;
        formattedInputs[7] = publicInputs.groupId;
        
        return formattedInputs;
    }
}
