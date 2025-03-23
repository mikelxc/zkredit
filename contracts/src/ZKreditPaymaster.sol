// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";
import {Initializable} from "openzeppelin-contracts-upgradeable/contracts/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "openzeppelin-contracts-upgradeable/contracts/access/OwnableUpgradeable.sol";
import {UUPSUpgradeable} from "openzeppelin-contracts-upgradeable/contracts/proxy/utils/UUPSUpgradeable.sol";
import {IEntryPoint} from "account-abstraction/interfaces/IEntryPoint.sol";
import {PackedUserOperation} from "account-abstraction/interfaces/PackedUserOperation.sol";
import {IPaymaster} from "account-abstraction/interfaces/IPaymaster.sol";

import {IZKreditPaymaster, IZKreditCore} from "./interfaces/IZKredit.sol";

/**
 * @title ZKreditPaymaster
 * @notice Paymaster contract that integrates with ZKreditCore for funding PackedUserOperations
 * @dev This contract is upgradeable via UUPS proxy pattern
 */
contract ZKreditPaymaster is
    IZKreditPaymaster,
    Initializable,
    UUPSUpgradeable,
    OwnableUpgradeable
{
    using SafeERC20 for IERC20;

    // ============ Storage ============

    /// @notice The EntryPoint contract
    IEntryPoint public entryPoint;

    /// @notice The ZKredit core contract
    IZKreditCore public zkreditCore;

    /// @notice Mapping of tokens supported by this paymaster (token => isSupported)
    mapping(address => bool) public supportedTokens;

    /// @notice Whether the paymaster is paused
    bool public paused;

    // ============ Events ============

    /// @notice Emitted when the ZKredit Core address is updated
    event ZKreditCoreUpdated(address indexed newZKreditCore);

    /// @notice Emitted when a token's support status is updated
    event TokenSupportUpdated(address indexed token, bool isSupported);

    /// @notice Emitted when the paymaster is paused or unpaused
    event PauseStateChanged(bool isPaused);

    // ============ Modifiers ============

    /**
     * @notice Ensures the contract is not paused
     */
    modifier whenNotPaused() {
        require(!paused, "ZKreditPaymaster: paused");
        _;
    }

    /**
     * @notice Ensures the caller is the EntryPoint
     */
    modifier onlyEntryPoint() {
        require(
            msg.sender == address(entryPoint),
            "ZKreditPaymaster: caller is not EntryPoint"
        );
        _;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    // ============ Initializer ============

    /**
     * @notice Initializes the contract (used for proxy pattern)
     * @param _entryPoint The EntryPoint contract address
     * @param _zkreditCore The ZKredit core contract address
     * @param _owner The owner address
     */
    function initialize(
        address _entryPoint,
        address _zkreditCore,
        address _owner
    ) external initializer {
        __Ownable_init(_owner);
        __UUPSUpgradeable_init();

        entryPoint = IEntryPoint(_entryPoint);
        zkreditCore = IZKreditCore(_zkreditCore);

        // Native token (ETH) is always supported
        supportedTokens[address(0)] = true;

        paused = false;
    }

    // ============ External View Functions ============

    /**
     * @inheritdoc IZKreditPaymaster
     */
    function getZKreditCore() external view override returns (address) {
        return address(zkreditCore);
    }

    /**
     * @notice Checks if a token is supported
     * @param token The token address
     * @return Whether the token is supported
     */
    function isTokenSupported(address token) external view returns (bool) {
        return supportedTokens[token];
    }

    // ============ IPaymaster Implementation ============

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
    }

    /**
     * @inheritdoc IPaymaster
     */
    /**
     * @inheritdoc IPaymaster
     */
    function postOp(
        IPaymaster.PostOpMode mode,
        bytes calldata context,
        uint256 actualGasCost,
        uint256 actualUserOpFeePerGas
    ) external override onlyEntryPoint {
        // Nothing to do in postOp as ZKreditCore has already handled the balance updates
        // We could potentially implement refunds for unused gas here in the future
    }

    // ============ Admin Functions ============

    /**
     * @inheritdoc IZKreditPaymaster
     */
    function setZKreditCore(address _zkreditCore) external override onlyOwner {
        require(_zkreditCore != address(0), "ZKreditPaymaster: zero address");
        zkreditCore = IZKreditCore(_zkreditCore);
        emit ZKreditCoreUpdated(_zkreditCore);
    }

    /**
     * @notice Updates the supported status of a token
     * @param token The token address
     * @param isSupported Whether the token is supported
     */
    function setTokenSupport(
        address token,
        bool isSupported
    ) external onlyOwner {
        supportedTokens[token] = isSupported;
        emit TokenSupportUpdated(token, isSupported);
    }

    /**
     * @notice Batch updates the supported status of multiple tokens
     * @param tokens Array of token addresses
     * @param isSupported Array of support flags
     */
    function batchSetTokenSupport(
        address[] calldata tokens,
        bool[] calldata isSupported
    ) external onlyOwner {
        require(
            tokens.length == isSupported.length,
            "ZKreditPaymaster: array length mismatch"
        );

        for (uint256 i = 0; i < tokens.length; i++) {
            supportedTokens[tokens[i]] = isSupported[i];
            emit TokenSupportUpdated(tokens[i], isSupported[i]);
        }
    }

    /**
     * @notice Sets the pause state
     * @param isPaused Whether the contract should be paused
     */
    function setPaused(bool isPaused) external onlyOwner {
        paused = isPaused;
        emit PauseStateChanged(isPaused);
    }

    /**
     * @notice Deposits funds to the EntryPoint for gas
     */
    function depositToEntryPoint() external payable onlyOwner {
        entryPoint.depositTo{value: msg.value}(address(this));
    }

    /**
     * @notice Withdraws funds from the EntryPoint
     * @param amount The amount to withdraw
     * @param recipient The recipient address
     */
    function withdrawFromEntryPoint(
        uint256 amount,
        address payable recipient
    ) external onlyOwner {
        entryPoint.withdrawTo(recipient, amount);
    }

    /**
     * @notice Rescues stuck tokens (only owner)
     * @param token The token address (address(0) for native token)
     * @param amount The amount to withdraw
     * @param recipient The recipient address
     */
    function rescueFunds(
        address token,
        uint256 amount,
        address payable recipient
    ) external onlyOwner {
        if (token == address(0)) {
            (bool success, ) = recipient.call{value: amount}("");
            require(success, "ZKreditPaymaster: native transfer failed");
        } else {
            IERC20(token).safeTransfer(recipient, amount);
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

    // ============ Internal Functions ============

    /**
     * @notice Parses paymaster data
     * @param paymasterAndData The paymaster and data field from PackedUserOperation
     * @return token The token address
     * @return depositor The depositor address
     * @return validationData Additional validation data
     */
    function _parsePaymasterData(
        bytes calldata paymasterAndData
    )
        internal
        pure
        returns (address token, address depositor, bytes memory validationData)
    {
        // Ensure the data is properly formatted
        require(
            paymasterAndData.length >= 20,
            "ZKreditPaymaster: invalid data"
        );

        // Skip the first 20 bytes (paymaster address)
        (token, depositor, validationData) = abi.decode(
            paymasterAndData[20:],
            (address, address, bytes)
        );

        return (token, depositor, validationData);
    }

    // ============ Fallback Functions ============

    /**
     * @notice Receive function to accept ETH
     */
    receive() external payable {}
}
