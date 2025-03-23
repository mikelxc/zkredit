// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

import {PackedUserOperation} from "account-abstraction/interfaces/PackedUserOperation.sol";
import {IPaymaster} from "account-abstraction/interfaces/IPaymaster.sol";

/**
 * @title IZKreditValidator
 * @notice Interface for validation modules that can approve withdrawals from ZKreditCore
 */
interface IZKreditValidator {
    /**
     * @notice Validates if a withdrawal is allowed
     * @param caller The address initiating the withdrawal
     * @param depositor The address that deposited the funds
     * @param token The token address (address(0) for native tokens)
     * @param amount The amount to withdraw
     * @param data Additional data for validation
     * @return isValid Whether the withdrawal is allowed
     */
    function validateWithdrawal(
        address caller,
        address depositor,
        address token,
        uint256 amount,
        bytes calldata data
    ) external view returns (bool isValid);

    /**
     * @notice Validates a UserOperation for paymaster use
     * @param userOp The UserOperation to validate
     * @param userOpHash The hash of the UserOperation
     * @param maxCost The maximum cost of the operation
     * @param caller The address initiating the operation
     * @param depositor The address that deposited the funds
     * @param token The token to use for payment
     * @param data Additional data for validation
     * @return isValid Whether the operation is allowed
     */
    function validatePaymasterUserOp(
        PackedUserOperation calldata userOp,
        bytes32 userOpHash,
        uint256 maxCost,
        address caller,
        address depositor,
        address token,
        bytes calldata data
    ) external view returns (bool isValid);
}

/**
 * @title IZKreditRegistry
 * @notice Interface for the ZKredit registry that manages validator and depositor relationships
 */
interface IZKreditRegistry {
    /**
     * @notice Struct to hold depositor information
     * @param validator The validator contract for this depositor
     * @param isActive Whether this depositor is active
     * @param metadata Additional metadata about the depositor
     */
    struct DepositorInfo {
        address validator;
        bool isActive;
        bytes metadata;
    }

    /**
     * @notice Gets the validator address for a specific depositor
     * @param depositor The address that deposited funds
     * @return The validator contract address for this depositor
     */
    function getValidatorAddress(
        address depositor
    ) external view returns (address);

    /**
     * @notice Gets the complete depositor information
     * @param depositor The address that deposited funds
     * @return The depositor information struct
     */
    function getDepositorInfo(
        address depositor
    ) external view returns (DepositorInfo memory);

    /**
     * @notice Registers a validator for a depositor
     * @param depositor The address to register the validator for
     * @param validator The validator contract address
     * @param metadata Additional metadata for the depositor
     */
    function registerDepositor(
        address depositor,
        address validator,
        bytes calldata metadata
    ) external;

    /**
     * @notice Check if a depositor is active
     * @param depositor The address to check
     * @return Whether the depositor is active
     */
    function isDepositorActive(address depositor) external view returns (bool);

    /**
     * @notice Updates a depositor's active status
     * @param depositor The depositor address
     * @param isActive Whether the depositor should be active
     */
    function setDepositorActive(address depositor, bool isActive) external;
}

/**
 * @title IZKreditCore
 * @notice Interface for the ZKredit core contract
 */
interface IZKreditCore {
    /**
     * @notice Struct to hold status information
     * @param isInitialized Whether the core contract is initialized
     * @param paused Whether the contract is paused
     * @param version The contract version
     */
    struct StatusInfo {
        bool isInitialized;
        bool paused;
        uint256 version;
    }

    /**
     * @notice Gets the status information of the contract
     * @return status The status information
     */
    function getStatus() external view returns (StatusInfo memory status);

    /**
     * @notice Gets the registry contract address
     * @return The registry address
     */
    function getRegistry() external view returns (address);

    /**
     * @notice Gets the EntryPoint contract address
     * @return The EntryPoint address
     */
    function getEntryPoint() external view returns (address);

    /**
     * @notice Deposits native tokens (ETH) to the contract
     * @param depositor The address to credit the deposit to (usually msg.sender)
     */
    function depositNative(address depositor) external payable;

    /**
     * @notice Deposits ERC20 tokens to the contract
     * @param token The ERC20 token address
     * @param amount The amount to deposit
     * @param depositor The address to credit the deposit to (usually msg.sender)
     */
    function depositERC20(
        address token,
        uint256 amount,
        address depositor
    ) external;

    /**
     * @notice Withdraws native tokens from the contract
     * @param depositor The address that deposited the funds
     * @param amount The amount to withdraw
     * @param recipient The address to send tokens to
     * @param validationData Additional data for validation
     */
    function withdrawNative(
        address depositor,
        uint256 amount,
        address payable recipient,
        bytes calldata validationData
    ) external;

    /**
     * @notice Withdraws ERC20 tokens from the contract
     * @param depositor The address that deposited the funds
     * @param token The ERC20 token address
     * @param amount The amount to withdraw
     * @param recipient The address to send tokens to
     * @param validationData Additional data for validation
     */
    function withdrawERC20(
        address depositor,
        address token,
        uint256 amount,
        address recipient,
        bytes calldata validationData
    ) external;

    /**
     * @notice Gets the balance of a depositor for a specific token
     * @param depositor The address that deposited funds
     * @param token The token address (address(0) for native tokens)
     * @return balance The balance available
     */
    function balanceOf(
        address depositor,
        address token
    ) external view returns (uint256 balance);

    /**
     * @notice Pre-transaction hook to fund a transaction
     * @param sender The sender of the transaction
     * @param depositor The address that deposited the funds
     * @param token The token to use for funding (address(0) for native)
     * @param amount The amount to use
     * @param validationData Additional data for validation
     * @return success Whether the pre-transaction was successful
     */
    function preTx(
        address sender,
        address depositor,
        address token,
        uint256 amount,
        bytes calldata validationData
    ) external returns (bool success);
}

/**
 * @title IZKreditPaymaster
 * @notice Interface for the ZKredit paymaster that extends IPaymaster with ZKredit functionalities
 */
interface IZKreditPaymaster is IPaymaster {
    /**
     * @notice Gets the ZKreditCore contract
     * @return The ZKreditCore address
     */
    function getZKreditCore() external view returns (address);

    /**
     * @notice Sets the ZKreditCore contract
     * @param zkreditCore The new ZKreditCore address
     */
    function setZKreditCore(address zkreditCore) external;
}
