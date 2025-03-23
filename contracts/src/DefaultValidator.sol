// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

import {ECDSA} from "openzeppelin-contracts/contracts/utils/cryptography/ECDSA.sol";
import {Initializable} from "openzeppelin-contracts-upgradeable/contracts/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "openzeppelin-contracts-upgradeable/contracts/access/OwnableUpgradeable.sol";
import {UUPSUpgradeable} from "openzeppelin-contracts-upgradeable/contracts/proxy/utils/UUPSUpgradeable.sol";
import {PackedUserOperation} from "account-abstraction/interfaces/PackedUserOperation.sol";
import {MessageHashUtils} from "openzeppelin-contracts/contracts/utils/cryptography/MessageHashUtils.sol";

import {IZKreditValidator} from "./interfaces/IZKredit.sol";

/**
 * @title DefaultValidator
 * @notice Default validator that verifies signatures for withdrawals
 * @dev This contract is upgradeable via UUPS proxy pattern
 */
contract DefaultValidator is
    IZKreditValidator,
    Initializable,
    UUPSUpgradeable,
    OwnableUpgradeable
{
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    // ============ Storage ============

    /// @notice Mapping to track used nonces (nonce => isUsed)
    mapping(bytes32 => bool) public usedNonces;

    /// @notice Mapping of authorized admin signers (signer => isAuthorized)
    mapping(address => bool) public authorizedSigners;

    // ============ Events ============

    /// @notice Emitted when a nonce is marked as used
    event NonceUsed(bytes32 indexed nonce);

    /// @notice Emitted when a signer's authorization status is updated
    event SignerAuthorizationChanged(address indexed signer, bool isAuthorized);

    // ============ Initializer ============

    /**
     * @notice Initializes the contract (used for proxy pattern)
     */
    // ============ Constructor ============

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    // ============ Initializer ============

    /**
     * @notice Initializes the contract (used for proxy pattern)
     */
    function initialize(address _owner) external initializer {
        __Ownable_init(_owner);
        __UUPSUpgradeable_init();

        // Add owner as an authorized signer by default
        authorizedSigners[_owner] = true;
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

        // Hash the operation data
        bytes32 messageHash = keccak256(
            abi.encodePacked(
                userOpHash,
                caller,
                depositor,
                token,
                maxCost,
                nonce,
                block.chainid
            )
        );

        // Prefix the hash (EIP-191)
        bytes32 prefixedHash = messageHash.toEthSignedMessageHash();

        // Recover signer
        address signer = ECDSA.recover(prefixedHash, signature);

        // If the signer is the depositor, allow the operation
        if (signer == depositor) {
            return true;
        }

        // If the signer is an authorized admin, also allow
        return authorizedSigners[signer];
    }

    // ============ External Management Functions ============

    /**
     * @notice Marks a nonce as used
     * @param nonce The nonce to mark as used
     */
    function useNonce(bytes32 nonce) external onlyOwner {
        usedNonces[nonce] = true;
        emit NonceUsed(nonce);
    }

    /**
     * @notice Sets the authorization status of a signer
     * @param signer The signer address
     * @param isAuthorized Whether the signer is authorized
     */
    function setAuthorizedSigner(
        address signer,
        bool isAuthorized
    ) external onlyOwner {
        require(
            signer != address(0),
            "DefaultValidator: signer cannot be zero address"
        );

        authorizedSigners[signer] = isAuthorized;

        emit SignerAuthorizationChanged(signer, isAuthorized);
    }

    /**
     * @notice Batch sets the authorization status of multiple signers
     * @param signers Array of signer addresses
     * @param isAuthorized Whether the signers are authorized
     */
    function batchSetAuthorizedSigners(
        address[] calldata signers,
        bool isAuthorized
    ) external onlyOwner {
        for (uint256 i = 0; i < signers.length; i++) {
            address signer = signers[i];
            require(
                signer != address(0),
                "DefaultValidator: signer cannot be zero address"
            );

            authorizedSigners[signer] = isAuthorized;

            emit SignerAuthorizationChanged(signer, isAuthorized);
        }
    }

    /**
     * @notice Implementation of _authorizeUpgrade for UUPS pattern
     * @param newImplementation The new implementation address
     */
    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {
        // Upgrade authorization logic
    }
}
