// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

import {ECDSA} from "openzeppelin-contracts/contracts/utils/cryptography/ECDSA.sol";
import {MessageHashUtils} from "openzeppelin-contracts/contracts/utils/cryptography/MessageHashUtils.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";
import {PackedUserOperation} from "account-abstraction/interfaces/PackedUserOperation.sol";
import {IZKreditValidator} from "./interfaces/IZKredit.sol";
import {EmailProof} from "./interfaces/IVerifier.sol";
import {IVerifier} from "./interfaces/IVerifier.sol";
import {EmailAuthMsg} from "./interfaces/IEmailAuth.sol";
import {IDKIMRegistry} from "./interfaces/IDKIMRegistry.sol";
import {TrustedForwarder} from "./utils/TrustedForwarder.sol";

/**
 * @title ZKEmailValidator
 * @notice Validator that verifies withdrawals using ZK email proofs
 * @dev Implements the IZKreditValidator interface for ZKredit system integration
 */
contract ZKEmailValidator is IZKreditValidator, Ownable, TrustedForwarder {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    // ============ Constants ============

    /// @notice Current contract version
    uint256 public constant VERSION = 1;

    // ============ Storage ============

    /// @notice The ZK Email verifier contract
    IVerifier public verifier;

    /// @notice The DKIM registry contract
    IDKIMRegistry public dkimRegistry;

    /// @notice Mapping to track used nullifiers (nullifier => isUsed)
    mapping(bytes32 => bool) public usedNullifiers;

    /// @notice Mapping of authorized domains (domain => isAuthorized)
    mapping(string => bool) public authorizedDomains;

    /// @notice Mapping of depositor to email domain
    mapping(address => string) public depositorDomains;

    /// @notice Mapping of withdrawal requests (hash => isApproved)
    mapping(bytes32 => bool) public approvedWithdrawals;

    /// @notice Command templates for withdrawal verification
    string[][] private withdrawalTemplates;

    // ============ Events ============

    /// @notice Emitted when a nullifier is used
    event NullifierUsed(bytes32 indexed nullifier);

    /// @notice Emitted when a domain's authorization status is updated
    event DomainAuthorizationChanged(string indexed domain, bool isAuthorized);

    /// @notice Emitted when a depositor's domain is set
    event DepositorDomainSet(address indexed depositor, string domain);

    /// @notice Emitted when a withdrawal is approved via email
    event WithdrawalApproved(
        address indexed caller,
        address indexed depositor,
        address indexed token,
        uint256 amount,
        bytes32 withdrawalHash
    );

    // ============ Errors ============

    error InvalidEmailProof();
    error NullifierAlreadyUsed();
    error UnauthorizedDomain();
    error DomainMismatch();
    error WithdrawalNotApproved();

    // ============ Constructor ============

    constructor(
        address _verifier,
        address _dkimRegistry,
        address initialOwner
    ) Ownable(initialOwner) {
        require(_verifier != address(0), "ZKEmailValidator: verifier cannot be zero address");
        require(_dkimRegistry != address(0), "ZKEmailValidator: DKIM registry cannot be zero address");
        
        verifier = IVerifier(_verifier);
        dkimRegistry = IDKIMRegistry(_dkimRegistry);
        
        // Initialize withdrawal templates
        initializeWithdrawalTemplates();
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

        // Check if the withdrawal has been approved via email
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
     * @notice Process an email authentication for withdrawal approval
     * @param emailAuthMsg The email authentication message
     * @param templateIdx The index of the withdrawal template to use
     * @param caller The address initiating the withdrawal
     * @param depositor The address that deposited the funds
     * @param token The token address (address(0) for native tokens)
     * @param amount The amount to withdraw
     */
    function processEmailAuth(
        EmailAuthMsg calldata emailAuthMsg,
        uint256 templateIdx,
        address caller,
        address depositor,
        address token,
        uint256 amount
    ) external {
        // Verify template index
        require(templateIdx < withdrawalTemplates.length, "ZKEmailValidator: invalid template index");
        
        // Check nullifier not already used
        if (usedNullifiers[emailAuthMsg.proof.emailNullifier]) {
            revert NullifierAlreadyUsed();
        }

        // Verify domain authorization
        if (!authorizedDomains[emailAuthMsg.proof.domainName]) {
            revert UnauthorizedDomain();
        }

        // Verify domain matches depositor
        if (keccak256(bytes(depositorDomains[depositor])) != keccak256(bytes(emailAuthMsg.proof.domainName))) {
            revert DomainMismatch();
        }

        // Verify DKIM public key hash
        require(
            dkimRegistry.isDKIMPublicKeyHashValid(
                emailAuthMsg.proof.domainName,
                emailAuthMsg.proof.publicKeyHash
            ),
            "ZKEmailValidator: invalid DKIM public key hash"
        );

        // Verify the expected command matches the template
        verifyCommand(emailAuthMsg, templateIdx, caller, depositor, token, amount);

        // Verify email proof
        if (!verifier.verifyEmailProof(emailAuthMsg.proof)) {
            revert InvalidEmailProof();
        }

        // Mark nullifier as used
        usedNullifiers[emailAuthMsg.proof.emailNullifier] = true;
        
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

        emit NullifierUsed(emailAuthMsg.proof.emailNullifier);
        emit WithdrawalApproved(caller, depositor, token, amount, withdrawalHash);
    }

    // ============ External Management Functions ============

    /**
     * @notice Sets the domain for a depositor
     * @param depositor The depositor address
     * @param domain The email domain
     */
    function setDepositorDomain(address depositor, string calldata domain) external {
        // Check if caller is owner or the depositor themselves
        require(
            msg.sender == owner() || msg.sender == depositor || _getAccount() == depositor,
            "ZKEmailValidator: not authorized"
        );

        depositorDomains[depositor] = domain;
        
        emit DepositorDomainSet(depositor, domain);
    }

    /**
     * @notice Sets the authorization status of a domain
     * @param domain The domain
     * @param isAuthorized Whether the domain is authorized
     */
    function setDomainAuthorization(string calldata domain, bool isAuthorized) external onlyOwner {
        authorizedDomains[domain] = isAuthorized;
        
        emit DomainAuthorizationChanged(domain, isAuthorized);
    }

    /**
     * @notice Batch sets the authorization status of multiple domains
     * @param domains Array of domains
     * @param isAuthorized Whether the domains are authorized
     */
    function batchSetDomainAuthorization(
        string[] calldata domains,
        bool isAuthorized
    ) external onlyOwner {
        for (uint256 i = 0; i < domains.length; i++) {
            authorizedDomains[domains[i]] = isAuthorized;
            
            emit DomainAuthorizationChanged(domains[i], isAuthorized);
        }
    }

    /**
     * @notice Updates the verifier contract
     * @param _verifier The new verifier address
     */
    function updateVerifier(address _verifier) external onlyOwner {
        require(_verifier != address(0), "ZKEmailValidator: verifier cannot be zero address");
        verifier = IVerifier(_verifier);
    }

    /**
     * @notice Updates the DKIM registry contract
     * @param _dkimRegistry The new DKIM registry address
     */
    function updateDKIMRegistry(address _dkimRegistry) external onlyOwner {
        require(_dkimRegistry != address(0), "ZKEmailValidator: DKIM registry cannot be zero address");
        dkimRegistry = IDKIMRegistry(_dkimRegistry);
    }

    // ============ Internal Functions ============

    /**
     * @notice Initialize withdrawal templates
     * @dev Sets up the standard templates for withdrawal commands
     */
    function initializeWithdrawalTemplates() internal {
        // Template 0: Standard withdrawal approval
        string[] memory template0 = new string[](5);
        template0[0] = "I approve withdrawal of ";
        template0[1] = "{amount}";
        template0[2] = " tokens from address ";
        template0[3] = "{depositor}";
        template0[4] = " to caller {caller}.";
        
        // Template 1: Alternative withdrawal approval
        string[] memory template1 = new string[](7);
        template1[0] = "Please approve a withdrawal request for ";
        template1[1] = "{amount}";
        template1[2] = " of token ";
        template1[3] = "{token}";
        template1[4] = " from my account ";
        template1[5] = "{depositor}";
        template1[6] = ".";

        // Add templates to the array
        withdrawalTemplates = new string[][](2);
        withdrawalTemplates[0] = template0;
        withdrawalTemplates[1] = template1;
    }

    /**
     * @notice Verify command matches the expected template
     * @param emailAuthMsg The email authentication message
     * @param templateIdx The index of the withdrawal template to use
     * @param caller The address initiating the withdrawal
     * @param depositor The address that deposited the funds
     * @param token The token address
     * @param amount The amount to withdraw
     */
    function verifyCommand(
        EmailAuthMsg calldata emailAuthMsg,
        uint256 templateIdx,
        address caller,
        address depositor,
        address token,
        uint256 amount
    ) internal view {
        // Get the template
        string[] memory template = withdrawalTemplates[templateIdx];
        
        // Build the expected command by replacing the placeholders
        string memory expectedCommand = "";
        for (uint256 i = 0; i < template.length; i++) {
            if (i % 2 == 0) {
                // Fixed string
                expectedCommand = string(abi.encodePacked(expectedCommand, template[i]));
            } else {
                // Parameter placeholder
                if (keccak256(bytes(template[i])) == keccak256(bytes("{amount}"))) {
                    expectedCommand = string(abi.encodePacked(expectedCommand, toString(amount)));
                } else if (keccak256(bytes(template[i])) == keccak256(bytes("{depositor}"))) {
                    expectedCommand = string(abi.encodePacked(expectedCommand, toHexString(depositor)));
                } else if (keccak256(bytes(template[i])) == keccak256(bytes("{caller}"))) {
                    expectedCommand = string(abi.encodePacked(expectedCommand, toHexString(caller)));
                } else if (keccak256(bytes(template[i])) == keccak256(bytes("{token}"))) {
                    expectedCommand = string(abi.encodePacked(expectedCommand, toHexString(token)));
                }
            }
        }
        
        // Compare the masked command with the expected command
        require(
            keccak256(bytes(emailAuthMsg.proof.maskedCommand)) == keccak256(bytes(expectedCommand)),
            "ZKEmailValidator: command mismatch"
        );
    }

    /**
     * @notice Converts a uint256 to a string
     * @param value The value to convert
     * @return The string representation
     */
    function toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        
        uint256 temp = value;
        uint256 digits;
        
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        
        return string(buffer);
    }

    /**
     * @notice Converts an address to a hexadecimal string
     * @param addr The address to convert
     * @return The hexadecimal string representation
     */
    function toHexString(address addr) internal pure returns (string memory) {
        bytes memory buffer = new bytes(42);
        buffer[0] = "0";
        buffer[1] = "x";
        
        for (uint256 i = 0; i < 20; i++) {
            uint8 b = uint8(uint160(addr) / (2**(8 * (19 - i))));
            uint8 hi = b / 16;
            uint8 lo = b - 16 * hi;
            buffer[2 + i * 2] = char(hi);
            buffer[3 + i * 2] = char(lo);
        }
        
        return string(buffer);
    }

    /**
     * @notice Converts a value to a character
     * @param b The value to convert
     * @return The character representation
     */
    function char(uint8 b) internal pure returns (bytes1) {
        if (b < 10) {
            return bytes1(uint8(b + 48));
        } else {
            return bytes1(uint8(b + 87));
        }
    }
}
