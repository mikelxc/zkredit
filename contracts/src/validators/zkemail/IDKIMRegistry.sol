// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

/**
 * @title IDKIMRegistry
 * @notice Interface for the DKIM registry that stores the hash(dkim_public_key) for each domain
 */
interface IDKIMRegistry {
    /**
     * @notice Check if a DKIM public key hash is valid for a specific domain
     * @param domainName The domain name to check
     * @param publicKeyHash The hash of the DKIM public key
     * @return bool True if the public key hash is valid for the domain
     */
    function isDKIMPublicKeyHashValid(
        string memory domainName,
        bytes32 publicKeyHash
    ) external view returns (bool);
    
    /**
     * @notice Set the DKIM public key hash for a domain
     * @param domainName The domain name
     * @param publicKeyHash The hash of the DKIM public key
     */
    function setDKIMPublicKeyHash(
        string memory domainName,
        bytes32 publicKeyHash
    ) external;
    
    /**
     * @notice Set multiple DKIM public key hashes for a domain
     * @param domainName The domain name
     * @param publicKeyHashes Array of DKIM public key hashes
     */
    function setDKIMPublicKeyHashes(
        string memory domainName,
        bytes32[] memory publicKeyHashes
    ) external;
    
    /**
     * @notice Revoke a DKIM public key hash
     * @param publicKeyHash The hash of the DKIM public key to revoke
     */
    function revokeDKIMPublicKeyHash(bytes32 publicKeyHash) external;
}
