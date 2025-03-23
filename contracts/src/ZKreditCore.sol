// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";
import {Initializable} from "openzeppelin-contracts-upgradeable/contracts/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "openzeppelin-contracts-upgradeable/contracts/access/OwnableUpgradeable.sol";
import {UUPSUpgradeable} from "openzeppelin-contracts-upgradeable/contracts/proxy/utils/UUPSUpgradeable.sol";
import {IEntryPoint} from "account-abstraction/interfaces/IEntryPoint.sol";

import {IZKreditCore, IZKreditRegistry, IZKreditValidator} from "./interfaces/IZKredit.sol";

/**
 * @title ZKreditCore
 * @notice Core contract for ZKredit that handles deposits, withdrawals, and validation
 * @dev This contract is upgradeable via UUPS proxy pattern
 */
contract ZKreditCore is
    IZKreditCore,
    Initializable,
    UUPSUpgradeable,
    OwnableUpgradeable
{
    using SafeERC20 for IERC20;

    // ============ Constants ============

    /// @notice Current contract version
    uint256 public constant VERSION = 1;

    /// @notice Max gas limit for validation
    uint256 private constant VALIDATION_GAS_LIMIT = 200000;

    // ============ Storage ============

    /// @notice Contract status information
    StatusInfo private _status;

    /// @notice The EntryPoint contract for EIP-4337
    IEntryPoint public entryPoint;

    /// @notice The ZKredit registry that manages validators
    IZKreditRegistry public registry;

    /// @notice Default validator for fallback
    address public defaultValidator;

    /// @notice Balances mapping (depositor => token => amount)
    mapping(address => mapping(address => uint256)) private _balances;

    /// @notice Supported tokens whitelist (token => isSupported)
    mapping(address => bool) public supportedTokens;

    /// @notice Reentrancy guard, locked = 1, unlocked = 2
    uint256 private _reentrancyStatus;

    /// @notice constants for reentrancy guard
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    // ============ Events ============

    /// @notice Emitted when tokens are deposited
    event Deposited(
        address indexed caller,
        address indexed depositor,
        address indexed token,
        uint256 amount
    );

    /// @notice Emitted when tokens are withdrawn
    event Withdrawn(
        address indexed caller,
        address indexed depositor,
        address indexed token,
        address recipient,
        uint256 amount
    );

    /// @notice Emitted when a transaction is pre-funded
    event PreFunded(
        address indexed sender,
        address indexed depositor,
        address indexed token,
        uint256 amount
    );

    /// @notice Emitted when the registry is updated
    event RegistryUpdated(address indexed newRegistry);

    /// @notice Emitted when the default validator is updated
    event DefaultValidatorUpdated(address indexed newValidator);

    /// @notice Emitted when contract is paused or unpaused
    event PauseStateChanged(bool isPaused);

    /// @notice Emitted when a token is added or removed from the whitelist
    event TokenWhitelistChanged(address indexed token, bool isSupported);

    // ============ Modifiers ============

    /**
     * @notice Ensures the contract is not paused
     */
    modifier whenNotPaused() {
        require(!_status.paused, "ZKreditCore: contract is paused");
        _;
    }

    /**
     * @notice Ensures the token is supported
     * @param token The token address to check
     */
    modifier onlySupportedToken(address token) {
        // Native token (ETH) is always supported
        if (token != address(0)) {
            require(supportedTokens[token], "ZKreditCore: token not supported");
        }
        _;
    }

    /**
     * @notice Prevents a contract from calling itself, directly or indirectly.
     */
    modifier nonReentrant() {
        require(_reentrancyStatus != _ENTERED, "ZKreditCore: reentrant call");
        _reentrancyStatus = _ENTERED;
        _;
        _reentrancyStatus = _NOT_ENTERED;
    }

    // ============ Constructor ============

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    // ============ Initializer ============

    /**
     * @notice Initializes the contract (used for proxy pattern)
     * @param _entryPoint The EntryPoint contract address
     * @param _registry The ZKredit registry address
     * @param _defaultValidator The default validator address
     */
    function initialize(
        address _entryPoint,
        address _registry,
        address _defaultValidator,
        address _owner
    ) external initializer {
        __Ownable_init(_owner);
        __UUPSUpgradeable_init();

        entryPoint = IEntryPoint(_entryPoint);
        registry = IZKreditRegistry(_registry);
        defaultValidator = _defaultValidator;

        _status.isInitialized = true;
        _status.paused = false;
        _status.version = VERSION;

        // Initialize reentrancy guard
        _reentrancyStatus = _NOT_ENTERED;

        // Native token (ETH) is always supported
        supportedTokens[address(0)] = true;
    }

    // ============ External View Functions ============

    /**
     * @inheritdoc IZKreditCore
     */
    function getStatus() external view override returns (StatusInfo memory) {
        return _status;
    }

    /**
     * @inheritdoc IZKreditCore
     */
    function getRegistry() external view override returns (address) {
        return address(registry);
    }

    /**
     * @inheritdoc IZKreditCore
     */
    function getEntryPoint() external view override returns (address) {
        return address(entryPoint);
    }

    /**
     * @inheritdoc IZKreditCore
     */
    function balanceOf(
        address depositor,
        address token
    ) external view override returns (uint256) {
        return _balances[depositor][token];
    }

    // ============ External Deposit/Withdraw Functions ============

    /**
     * @inheritdoc IZKreditCore
     */
    function depositNative(
        address depositor
    ) external payable override whenNotPaused {
        require(
            msg.value > 0,
            "ZKreditCore: deposit amount must be greater than zero"
        );

        // Update balance
        _balances[depositor][address(0)] += msg.value;

        emit Deposited(msg.sender, depositor, address(0), msg.value);
    }

    /**
     * @inheritdoc IZKreditCore
     */
    function depositERC20(
        address token,
        uint256 amount,
        address depositor
    ) external override whenNotPaused onlySupportedToken(token) {
        require(
            amount > 0,
            "ZKreditCore: deposit amount must be greater than zero"
        );
        require(
            token != address(0),
            "ZKreditCore: use depositNative for native token"
        );

        // Transfer tokens from sender to this contract
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        // Update balance
        _balances[depositor][token] += amount;

        emit Deposited(msg.sender, depositor, token, amount);
    }

    /**
     * @inheritdoc IZKreditCore
     */
    function withdrawNative(
        address depositor,
        uint256 amount,
        address payable recipient,
        bytes calldata validationData
    ) external override nonReentrant whenNotPaused {
        require(
            amount > 0,
            "ZKreditCore: withdraw amount must be greater than zero"
        );
        require(
            _balances[depositor][address(0)] >= amount,
            "ZKreditCore: insufficient balance"
        );

        // Validate withdrawal
        require(
            _validateWithdrawal(
                msg.sender,
                depositor,
                address(0),
                amount,
                validationData
            ),
            "ZKreditCore: withdrawal validation failed"
        );

        // Update balance
        _balances[depositor][address(0)] -= amount;

        // Transfer ETH to recipient
        (bool success, ) = recipient.call{value: amount}("");
        require(success, "ZKreditCore: native transfer failed");

        emit Withdrawn(msg.sender, depositor, address(0), recipient, amount);
    }

    /**
     * @inheritdoc IZKreditCore
     */
    function withdrawERC20(
        address depositor,
        address token,
        uint256 amount,
        address recipient,
        bytes calldata validationData
    ) external override nonReentrant whenNotPaused onlySupportedToken(token) {
        require(
            amount > 0,
            "ZKreditCore: withdraw amount must be greater than zero"
        );
        require(
            token != address(0),
            "ZKreditCore: use withdrawNative for native token"
        );
        require(
            _balances[depositor][token] >= amount,
            "ZKreditCore: insufficient balance"
        );

        // Validate withdrawal
        require(
            _validateWithdrawal(
                msg.sender,
                depositor,
                token,
                amount,
                validationData
            ),
            "ZKreditCore: withdrawal validation failed"
        );

        // Update balance
        _balances[depositor][token] -= amount;

        // Transfer tokens to recipient
        IERC20(token).safeTransfer(recipient, amount);

        emit Withdrawn(msg.sender, depositor, token, recipient, amount);
    }

    /**
     * @inheritdoc IZKreditCore
     */
    function preTx(
        address sender,
        address depositor,
        address token,
        uint256 amount,
        bytes calldata validationData
    )
        external
        override
        nonReentrant
        whenNotPaused
        onlySupportedToken(token)
        returns (bool)
    {
        require(amount > 0, "ZKreditCore: amount must be greater than zero");
        require(
            _balances[depositor][token] >= amount,
            "ZKreditCore: insufficient balance"
        );

        // Validate withdrawal on behalf of the sender
        bool isValid = _validateWithdrawal(
            sender,
            depositor,
            token,
            amount,
            validationData
        );

        if (!isValid) {
            return false;
        }

        // Update balance
        _balances[depositor][token] -= amount;

        emit PreFunded(sender, depositor, token, amount);

        return true;
    }

    // ============ Admin Functions ============

    /**
     * @notice Updates the registry contract
     * @param _registry The new registry address
     */
    function setRegistry(address _registry) external onlyOwner {
        require(
            _registry != address(0),
            "ZKreditCore: registry cannot be zero address"
        );
        registry = IZKreditRegistry(_registry);
        emit RegistryUpdated(_registry);
    }

    /**
     * @notice Updates the default validator
     * @param _defaultValidator The new default validator address
     */
    function setDefaultValidator(address _defaultValidator) external onlyOwner {
        require(
            _defaultValidator != address(0),
            "ZKreditCore: validator cannot be zero address"
        );
        defaultValidator = _defaultValidator;
        emit DefaultValidatorUpdated(_defaultValidator);
    }

    /**
     * @notice Sets the pause state of the contract
     * @param isPaused Whether the contract should be paused
     */
    function setPaused(bool isPaused) external onlyOwner {
        _status.paused = isPaused;
        emit PauseStateChanged(isPaused);
    }

    /**
     * @notice Updates the token whitelist
     * @param token The token address to update
     * @param isSupported Whether the token should be supported
     */
    function setTokenSupport(
        address token,
        bool isSupported
    ) external onlyOwner {
        require(
            token != address(0),
            "ZKreditCore: cannot modify native token support"
        );
        supportedTokens[token] = isSupported;
        emit TokenWhitelistChanged(token, isSupported);
    }

    /**
     * @notice Batch updates the token whitelist
     * @param tokens Array of token addresses to update
     * @param isSupported Array of support flags corresponding to each token
     */
    function batchSetTokenSupport(
        address[] calldata tokens,
        bool[] calldata isSupported
    ) external onlyOwner {
        require(
            tokens.length == isSupported.length,
            "ZKreditCore: array length mismatch"
        );

        for (uint256 i = 0; i < tokens.length; i++) {
            require(
                tokens[i] != address(0),
                "ZKreditCore: cannot modify native token support"
            );
            supportedTokens[tokens[i]] = isSupported[i];
            emit TokenWhitelistChanged(tokens[i], isSupported[i]);
        }
    }

    /**
     * @notice Withdraw stuck funds (only owner)
     * @param token The token address (address(0) for native token)
     * @param amount The amount to withdraw
     * @param recipient The address to send tokens to
     */
    function rescueFunds(
        address token,
        uint256 amount,
        address payable recipient
    ) external onlyOwner {
        if (token == address(0)) {
            (bool success, ) = recipient.call{value: amount}("");
            require(success, "ZKreditCore: native rescue failed");
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
     * @notice Validates a withdrawal
     * @param caller The address initiating the withdrawal
     * @param depositor The address that deposited the funds
     * @param token The token address (address(0) for native tokens)
     * @param amount The amount to withdraw
     * @param validationData Additional data for validation
     * @return isValid Whether the withdrawal is allowed
     */
    function _validateWithdrawal(
        address caller,
        address depositor,
        address token,
        uint256 amount,
        bytes calldata validationData
    ) internal view returns (bool) {
        // Simple case: caller is the depositor and no validation is needed
        if (caller == depositor && validationData.length == 0) {
            return true;
        }

        // Get the validator for this depositor
        address validatorAddress = registry.getValidatorAddress(depositor);

        // If no validator registered, use the default
        if (validatorAddress == address(0)) {
            validatorAddress = defaultValidator;
        }

        // Skip validation if the validator address is zero (should never happen with proper default)
        if (validatorAddress == address(0)) {
            return false;
        }

        // Interface with the validator
        IZKreditValidator validator = IZKreditValidator(validatorAddress);

        // Forward validation to the validator contract
        try
            validator.validateWithdrawal{gas: VALIDATION_GAS_LIMIT}(
                caller,
                depositor,
                token,
                amount,
                validationData
            )
        returns (bool result) {
            return result;
        } catch {
            // If validation call reverts, consider it a failure
            return false;
        }
    }

    // ============ Fallback Functions ============

    /**
     * @notice Receive function to accept ETH
     */
    receive() external payable {
        // Credit the sender
        _balances[msg.sender][address(0)] += msg.value;
        emit Deposited(msg.sender, msg.sender, address(0), msg.value);
    }
}
