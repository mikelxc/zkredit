// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

/**
 * @title INoirVerifier
 * @notice Interface for the Noir proof verifier
 */
interface INoirVerifier {
    /**
     * @notice Verifies a Noir proof with the given public inputs
     * @param proof The proof data
     * @param publicInputs The public inputs to the proof
     * @return isValid Whether the proof is valid
     */
    function verify(
        bytes calldata proof,
        bytes32[] memory publicInputs
    ) external view returns (bool isValid);
}
