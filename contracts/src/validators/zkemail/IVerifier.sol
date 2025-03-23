// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

/**
 * @title EmailProof
 * @notice Structure for ZK email proof data
 */
struct EmailProof {
    string domainName;      // Domain name of the sender's email
    bytes32 publicKeyHash;  // Hash of the DKIM public key used in the email
    uint256 timestamp;      // Timestamp of the email
    string maskedCommand;   // Masked command from the email
    bytes32 emailNullifier; // Nullifier of the email to prevent reuse
    bytes32 accountSalt;    // CREATE2 salt of the account
    bool isCodeExist;       // Check if the account code exists
    bytes proof;            // ZK proof of the email
}

/**
 * @title IVerifier
 * @notice Interface for the ZK email proof verifier
 */
interface IVerifier {
    /**
     * @notice Returns the maximum number of bytes for the command
     * @return uint256 The maximum command bytes
     */
    function commandBytes() external view returns (uint256);
    
    /**
     * @notice Verifies a ZK email proof
     * @param proof The email proof to verify
     * @return bool True if the proof is valid
     */
    function verifyEmailProof(EmailProof memory proof) external view returns (bool);
}
