// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {NoirJWTValidator} from "../src/NoirJWTValidator.sol";
import {ZKreditRegistry} from "../src/ZKreditRegistry.sol";

/**
 * @title DeployNoirJWTValidator
 * @notice Deployment script for NoirJWTValidator and ZKredit registry setup
 * @dev Run with: forge script script/DeployNoirJWTValidator.s.sol:DeployNoirJWTValidator --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast
 */
contract DeployNoirJWTValidator is Script {
    function run() public {
        console.log("Deploying NoirJWTValidator and integrating with ZKredit...");

        // Get configuration from environment variables
        address noirVerifierAddress = vm.envOr("NOIR_VERIFIER_ADDRESS", address(0));
        address registryAddress = vm.envOr("REGISTRY_ADDRESS", address(0));
        address deployerAddress = vm.envOr("DEPLOYER_ADDRESS", msg.sender);
        
        require(noirVerifierAddress != address(0), "NOIR_VERIFIER_ADDRESS not set");

        console.log("Using Noir verifier address:", noirVerifierAddress);
        
        vm.startBroadcast();

        // Deploy NoirJWTValidator
        NoirJWTValidator noirValidator = new NoirJWTValidator(
            noirVerifierAddress,
            deployerAddress // owner
        );
        
        console.log("NoirJWTValidator deployed to:", address(noirValidator));

        // Configure authorized issuers and groups for testing
        bytes32 googleIssuer = bytes32("https://accounts.google.com");
        bytes32 workspaceGroup = bytes32("company-workspace-group");
        
        noirValidator.setIssuerAuthorization(googleIssuer, true);
        noirValidator.setGroupAuthorization(workspaceGroup, true);
        
        console.log("Authorized Google issuer and workspace group");

        // If registry address is provided, register as a validator
        if (registryAddress != address(0)) {
            ZKreditRegistry registry = ZKreditRegistry(registryAddress);
            
            console.log("Setting up validator in ZKredit Registry at:", registryAddress);
            
            // Set the validator manager permissions
            registry.setValidatorManager(address(noirValidator), deployerAddress, true);
            console.log("Validator manager set successfully");
            
            // Add test user (optional)
            address testUser = vm.envOr("TEST_USER", address(0));
            if (testUser != address(0)) {
                bytes32 userSubject = bytes32("test.user@company.com");
                bytes memory metadata = abi.encode(userSubject, workspaceGroup);
                
                registry.registerDepositor(testUser, address(noirValidator), metadata);
                noirValidator.setDepositorSubject(testUser, userSubject);
                
                console.log("Test user registered successfully with subject");
            }
        } else {
            console.log("REGISTRY_ADDRESS not provided. Skipping registry setup.");
        }

        vm.stopBroadcast();
    }
}
