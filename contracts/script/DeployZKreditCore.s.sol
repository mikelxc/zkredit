// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

import "forge-std/Script.sol";
import {ERC1967Proxy} from "openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {IEntryPoint} from "account-abstraction/interfaces/IEntryPoint.sol";
import {ZKreditCore} from "../src/ZKreditCore.sol";
import {ZKreditRegistry} from "../src/ZKreditRegistry.sol";
import {DefaultValidator} from "../src/DefaultValidator.sol";

/**
 * @title DeployZKreditCore
 * @notice Deployment script for ZKredit core contracts using deterministic addresses
 */
contract DeployZKreditCore is Script {
    // 0.7.0 EntryPoint address
    address constant ENTRY_POINT_ADDRESS =
        0x0000000071727De22E5E9d8BAf0edAc6f37da032;

    // Salts for deterministic deployment
    bytes32 constant REGISTRY_SALT = bytes32(uint256(0x01));
    bytes32 constant DEFAULT_VALIDATOR_SALT = bytes32(uint256(0x02));
    bytes32 constant CORE_SALT = bytes32(uint256(0x03));

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerPrivateKey);

        console.log("Deploying ZKredit core contracts");
        console.log("Deployer address: ", deployerAddress);
        console.log("EntryPoint address: ", ENTRY_POINT_ADDRESS);

        vm.startBroadcast(deployerPrivateKey);

        // Deploy implementation contracts first using normal CREATE

        // Deploy Registry implementation
        ZKreditRegistry implementation_registry = new ZKreditRegistry();
        console.log(
            "ZKreditRegistry implementation deployed at:",
            address(implementation_registry)
        );

        // Deploy DefaultValidator implementation
        DefaultValidator implementation_defaultValidator = new DefaultValidator();
        console.log(
            "DefaultValidator implementation deployed at:",
            address(implementation_defaultValidator)
        );

        // Deploy Core implementation
        ZKreditCore implementation_core = new ZKreditCore();
        console.log(
            "ZKreditCore implementation deployed at:",
            address(implementation_core)
        );

        // Now deploy proxies using CREATE2 with Foundry's built-in salt feature

        // 1. Prepare initialization data for Registry
        bytes memory registry_initData = abi.encodeWithSelector(
            implementation_registry.initialize.selector,
            deployerAddress
        );

        // Deploy Registry proxy with CREATE2
        ERC1967Proxy registryProxy = new ERC1967Proxy{salt: REGISTRY_SALT}(
            address(implementation_registry),
            registry_initData
        );
        address proxy_registry = address(registryProxy);
        console.log("ZKreditRegistry proxy deployed at:", proxy_registry);

        // 2. Prepare initialization data for DefaultValidator
        bytes memory defaultValidator_initData = abi.encodeWithSelector(
            implementation_defaultValidator.initialize.selector,
            deployerAddress
        );

        // Deploy DefaultValidator proxy with CREATE2
        ERC1967Proxy defaultValidatorProxy = new ERC1967Proxy{
            salt: DEFAULT_VALIDATOR_SALT
        }(address(implementation_defaultValidator), defaultValidator_initData);
        address proxy_defaultValidator = address(defaultValidatorProxy);
        console.log(
            "DefaultValidator proxy deployed at:",
            proxy_defaultValidator
        );

        // 3. Prepare initialization data for Core
        bytes memory core_initData = abi.encodeWithSelector(
            implementation_core.initialize.selector,
            ENTRY_POINT_ADDRESS,
            proxy_registry,
            proxy_defaultValidator,
            deployerAddress
        );

        // Deploy Core proxy with CREATE2
        ERC1967Proxy coreProxy = new ERC1967Proxy{salt: CORE_SALT}(
            address(implementation_core),
            core_initData
        );
        address proxy_core = address(coreProxy);
        console.log("ZKreditCore proxy deployed at:", proxy_core);

        // Link contracts together
        // Set ZKreditCore in Registry
        ZKreditRegistry(proxy_registry).setZKreditCore(proxy_core);
        console.log("Registry linked to Core");

        vm.stopBroadcast();

        console.log("ZKredit core deployment completed successfully!");
        console.log("");
        console.log("====== DEPLOYMENT SUMMARY ======");
        console.log("ZKreditRegistry: ", proxy_registry);
        console.log("DefaultValidator: ", proxy_defaultValidator);
        console.log("ZKreditCore: ", proxy_core);
        console.log("==============================");
    }
}
