// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import {IZKreditRegistry} from "./interfaces/IZKredit.sol";

/**
 * @title ZKreditRegistry
 * @notice Registry for ZKredit validators and depositor management
 * @dev This contract is upgradeable via UUPS proxy pattern
 */
contract ZKreditRegistry is
    IZKreditRegistry,
    Initializable,
    UUPSUpgradeable,
    Ownable
{
    using EnumerableSet for EnumerableSet.AddressSet;

    // ============ Storage ============

    /// @notice Mapping of depositor address to DepositorInfo
    mapping(address => DepositorInfo) private _depositorInfo;

    /// @notice Set of all registered depositors for enumeration
    EnumerableSet.AddressSet private _depositors;

    /// @notice Mapping of validator address to approved managers (manager => isApproved)
    mapping(address => mapping(address => bool)) private _validatorManagers;

    /// @notice Address of the ZKreditCore contract
    address public zkreditCore;

    // ============ Events ============

    /// @notice Emitted when a depositor is registered
    event DepositorRegistered(
        address indexed depositor,
        address indexed validator,
        bytes metadata
    );

    /// @notice Emitted when a depositor's active status is updated
    event DepositorActiveStatusChanged(
        address indexed depositor,
        bool isActive
    );

    /// @notice Emitted when a validator manager is set
    event ValidatorManagerSet(
        address indexed validator,
        address indexed manager,
        bool isApproved
    );

    /// @notice Emitted when the ZKredit Core address is updated
    event ZKreditCoreUpdated(address indexed newZKreditCore);

    // ============ Modifiers ============

    /**
     * @notice Ensures the caller is authorized for a validator
     * @param validator The validator address to check
     */
    modifier onlyValidatorManagerOrOwner(address validator) {
        require(
            owner() == msg.sender || _validatorManagers[validator][msg.sender],
            "ZKreditRegistry: caller is not authorized"
        );
        _;
    }

    /**
     * @notice Ensures the caller is the ZKredit Core contract
     */
    modifier onlyZKreditCore() {
        require(
            msg.sender == zkreditCore,
            "ZKreditRegistry: caller is not ZKredit Core"
        );
        _;
    }

    // ============ Initializer ============

    /**
     * @notice Initializes the contract (used for proxy pattern)
     */
    function initialize() external initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
    }

    // ============ External View Functions ============

    /**
     * @inheritdoc IZKreditRegistry
     */
    function getValidatorAddress(
        address depositor
    ) external view override returns (address) {
        return _depositorInfo[depositor].validator;
    }

    /**
     * @inheritdoc IZKreditRegistry
     */
    function getDepositorInfo(
        address depositor
    ) external view override returns (DepositorInfo memory) {
        return _depositorInfo[depositor];
    }

    /**
     * @inheritdoc IZKreditRegistry
     */
    function isDepositorActive(
        address depositor
    ) external view override returns (bool) {
        return _depositorInfo[depositor].isActive;
    }

    /**
     * @notice Gets the total number of registered depositors
     * @return The number of depositors
     */
    function getDepositorCount() external view returns (uint256) {
        return _depositors.length();
    }

    /**
     * @notice Gets a depositor by index for enumeration
     * @param index The index to query
     * @return The depositor address at the given index
     */
    function getDepositorAt(uint256 index) external view returns (address) {
        require(
            index < _depositors.length(),
            "ZKreditRegistry: index out of bounds"
        );
        return _depositors.at(index);
    }

    /**
     * @notice Checks if an address is a validator manager
     * @param validator The validator address
     * @param manager The manager address to check
     * @return Whether the address is a manager for the validator
     */
    function isValidatorManager(
        address validator,
        address manager
    ) external view returns (bool) {
        return _validatorManagers[validator][manager];
    }

    // ============ External Management Functions ============

    /**
     * @inheritdoc IZKreditRegistry
     */
    function registerDepositor(
        address depositor,
        address validator,
        bytes calldata metadata
    ) external override onlyValidatorManagerOrOwner(validator) {
        require(
            depositor != address(0),
            "ZKreditRegistry: depositor cannot be zero address"
        );

        // Create or update depositor info
        _depositorInfo[depositor] = DepositorInfo({
            validator: validator,
            isActive: true,
            metadata: metadata
        });

        // Add to enumeration set if not already present
        _depositors.add(depositor);

        emit DepositorRegistered(depositor, validator, metadata);
    }

    /**
     * @inheritdoc IZKreditRegistry
     */
    function setDepositorActive(
        address depositor,
        bool isActive
    )
        external
        override
        onlyValidatorManagerOrOwner(_depositorInfo[depositor].validator)
    {
        require(
            _depositors.contains(depositor),
            "ZKreditRegistry: depositor not registered"
        );

        _depositorInfo[depositor].isActive = isActive;

        emit DepositorActiveStatusChanged(depositor, isActive);
    }

    /**
     * @notice Batch registers multiple depositors with the same validator
     * @param depositors Array of depositor addresses
     * @param validator The validator address
     * @param metadataArray Array of metadata for each depositor
     */
    function batchRegisterDepositors(
        address[] calldata depositors,
        address validator,
        bytes[] calldata metadataArray
    ) external onlyValidatorManagerOrOwner(validator) {
        require(
            depositors.length == metadataArray.length,
            "ZKreditRegistry: array length mismatch"
        );

        for (uint256 i = 0; i < depositors.length; i++) {
            address depositor = depositors[i];
            require(
                depositor != address(0),
                "ZKreditRegistry: depositor cannot be zero address"
            );

            // Create or update depositor info
            _depositorInfo[depositor] = DepositorInfo({
                validator: validator,
                isActive: true,
                metadata: metadataArray[i]
            });

            // Add to enumeration set if not already present
            _depositors.add(depositor);

            emit DepositorRegistered(depositor, validator, metadataArray[i]);
        }
    }

    /**
     * @notice Updates a depositor's metadata
     * @param depositor The depositor address
     * @param metadata The new metadata
     */
    function updateDepositorMetadata(
        address depositor,
        bytes calldata metadata
    )
        external
        onlyValidatorManagerOrOwner(_depositorInfo[depositor].validator)
    {
        require(
            _depositors.contains(depositor),
            "ZKreditRegistry: depositor not registered"
        );

        _depositorInfo[depositor].metadata = metadata;

        emit DepositorRegistered(
            depositor,
            _depositorInfo[depositor].validator,
            metadata
        );
    }

    // ============ Admin Functions ============

    /**
     * @notice Sets a validator manager
     * @param validator The validator address
     * @param manager The manager address
     * @param isApproved Whether the manager is approved
     */
    function setValidatorManager(
        address validator,
        address manager,
        bool isApproved
    ) external onlyOwner {
        require(
            validator != address(0),
            "ZKreditRegistry: validator cannot be zero address"
        );
        require(
            manager != address(0),
            "ZKreditRegistry: manager cannot be zero address"
        );

        _validatorManagers[validator][manager] = isApproved;

        emit ValidatorManagerSet(validator, manager, isApproved);
    }

    /**
     * @notice Batch sets validator managers
     * @param validator The validator address
     * @param managers Array of manager addresses
     * @param isApproved Whether the managers are approved
     */
    function batchSetValidatorManagers(
        address validator,
        address[] calldata managers,
        bool isApproved
    ) external onlyOwner {
        require(
            validator != address(0),
            "ZKreditRegistry: validator cannot be zero address"
        );

        for (uint256 i = 0; i < managers.length; i++) {
            address manager = managers[i];
            require(
                manager != address(0),
                "ZKreditRegistry: manager cannot be zero address"
            );

            _validatorManagers[validator][manager] = isApproved;

            emit ValidatorManagerSet(validator, manager, isApproved);
        }
    }

    /**
     * @notice Sets the ZKredit Core address
     * @param _zkreditCore The new ZKredit Core address
     */
    function setZKreditCore(address _zkreditCore) external onlyOwner {
        require(
            _zkreditCore != address(0),
            "ZKreditRegistry: core cannot be zero address"
        );
        zkreditCore = _zkreditCore;

        emit ZKreditCoreUpdated(_zkreditCore);
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
