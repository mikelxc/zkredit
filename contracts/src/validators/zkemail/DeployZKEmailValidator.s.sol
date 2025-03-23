// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {ZKEmailValidator} from "../src/ZKEmailValidator.sol";
import {ZKreditRegistry} from "../src/ZKreditRegistry.sol";

/**
 * @title DeployZKEmailValidator
 * @notice Deployment script for ZKEmailValidator and ZKredit registry setup
 * @dev Run with: forge script script/DeployZKEmailValidator.s.sol:DeployZKEmailValidator --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast
 */
contract DeployZKEmailValidator is Script {
    function run() public {
        console.log("Deploying ZKEmailValidator and integrating with ZKredit...");

        // Get configuration from environment variables
        address verifierAddress = vm.envOr("VERIFIER_ADDRESS", address(0));
        address dkimRegistryAddress = vm.envOr("DKIM_REGISTRY_ADDRESS", address(0));
        address registryAddress = vm.envOr("REGISTRY_ADDRESS", address(0));
        address deployerAddress = vm.envOr("DEPLOYER_ADDRESS", msg.sender);
        
        require(verifierAddress != address(0), "VERIFIER_ADDRESS not set");
        require(dkimRegistryAddress != address(0), "DKIM_REGISTRY_ADDRESS not set");

        console.log("Using verifier address:", verifierAddress);
        console.log("Using DKIM registry address:", dkimRegistryAddress);
        
        vm.startBroadcast();

        // Deploy ZKEmailValidator
        ZKEmailValidator zkEmailValidator = new ZKEmailValidator(
            verifierAddress,
            dkimRegistryAddress,
            deployerAddress // owner
        );
        
        console.log("ZKEmailValidator deployed to:", address(zkEmailValidator));

        // Set up domains for testing
        string memory testDomain = "example.com";
        zkEmailValidator.setDomainAuthorization(testDomain, true);
        console.log("Authorized test domain:", testDomain);

        // If registry address is provided, register as a validator
        if (registryAddress != address(0)) {
            ZKreditRegistry registry = ZKreditRegistry(registryAddress);
            
            console.log("Setting up validator in ZKredit Registry at:", registryAddress);
            
            // Set the validator manager permissions
            registry.setValidatorManager(address(zkEmailValidator), deployerAddress, true);
            console.log("Validator manager set successfully");
            
            // Add test user (optional)
            address testUser = vm.envOr("TEST_USER", address(0));
            if (testUser != address(0)) {
                bytes memory metadata = abi.encode(testDomain, "ZKEmail User");
                registry.registerDepositor(testUser, address(zkEmailValidator), metadata);
                zkEmailValidator.setDepositorDomain(testUser, testDomain);
                console.log("Test user registered successfully with domain:", testDomain);
            }
        } else {
            console.log("REGISTRY_ADDRESS not provided. Skipping registry setup.");
        }

        vm.stopBroadcast();
    }
}
