// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

import {EmailProof} from "./IVerifier.sol";

/**
 * @title Email Authentication Message
 * @notice Struct to hold the email authentication/authorization message
 */
struct EmailAuthMsg {
    /// @notice The ID of the command template that the command in the email body should satisfy
    uint256 templateId;
    /// @notice The parameters in the command of the email body, which should match the specified command template
    bytes[] commandParams;
    /// @notice The number of skipped bytes in the command
    uint256 skippedCommandPrefix;
    /// @notice The email proof containing the zk proof and other necessary information
    EmailProof proof;
}

/**
 * @title IEmailAuth
 * @notice Interface for the Email Authentication contract
 */
interface IEmailAuth {
    /**
     * @notice Authenticate the email sender and authorize the message
     * @param emailAuthMsg The email auth message containing all necessary information
     */
    function authEmail(EmailAuthMsg calldata emailAuthMsg) external;
    
    /**
     * @notice Get the account salt used for CREATE2 address derivation
     * @return bytes32 The account salt
     */
    function accountSalt() external view returns (bytes32);
    
    /**
     * @notice Get the controller address
     * @return address The controller address
     */
    function controller() external view returns (address);
    
    /**
     * @notice Get the DKIM registry address
     * @return address The DKIM registry address
     */
    function dkimRegistryAddr() external view returns (address);
    
    /**
     * @notice Get the verifier address
     * @return address The verifier address
     */
    function verifierAddr() external view returns (address);
    
    /**
     * @notice Get a command template by its ID
     * @param _templateId The ID of the command template
     * @return string[] The command template as an array of strings
     */
    function getCommandTemplate(uint256 _templateId) external view returns (string[] memory);
    
    /**
     * @notice Insert a new command template
     * @param _templateId The ID for the new command template
     * @param _commandTemplate The command template as an array of strings
     */
    function insertCommandTemplate(uint256 _templateId, string[] memory _commandTemplate) external;
    
    /**
     * @notice Update an existing command template
     * @param _templateId The ID of the template to update
     * @param _commandTemplate The new command template as an array of strings
     */
    function updateCommandTemplate(uint256 _templateId, string[] memory _commandTemplate) external;
    
    /**
     * @notice Delete an existing command template
     * @param _templateId The ID of the command template to be deleted
     */
    function deleteCommandTemplate(uint256 _templateId) external;
}
