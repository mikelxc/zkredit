// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

import "forge-std/Script.sol";
import {ERC1967Proxy} from "openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {IEntryPoint} from "account-abstraction/interfaces/IEntryPoint.sol";
import {ZKreditPaymaster} from "../src/ZKreditPaymaster.sol";

/**
 * @title DeployZKreditPaymaster
 * @notice Deployment script for ZKredit Paymaster using deterministic deployment
 */
contract DeployZKreditPaymaster is Script {
    // Sepolia EntryPoint address
    address constant ENTRY_POINT_ADDRESS =
        0x0000000071727De22E5E9d8BAf0edAc6f37da032;

    // Salt for deterministic deployment
    bytes32 constant PAYMASTER_SALT = bytes32(uint256(0x04));

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerPrivateKey);

        // Address of the ZKreditCore contract - this should be set to your deployed contract
        address zkreditCore = vm.envAddress("ZKREDIT_CORE_ADDRESS");
        require(zkreditCore != address(0), "ZKreditCore address not provided");

        console.log("Deploying ZKredit Paymaster");
        console.log("Deployer address: ", deployerAddress);
        console.log("ZKredit Core address: ", zkreditCore);

        vm.startBroadcast(deployerPrivateKey);

        // Deploy implementation contract using normal CREATE
        ZKreditPaymaster implementation = new ZKreditPaymaster();
        console.log(
            "ZKreditPaymaster implementation deployed at:",
            address(implementation)
        );

        // Prepare initialization data
        bytes memory initData = abi.encodeWithSelector(
            implementation.initialize.selector,
            ENTRY_POINT_ADDRESS,
            zkreditCore,
            deployerAddress
        );

        // Deploy proxy using Foundry's CREATE2 feature
        ERC1967Proxy paymasterProxy = new ERC1967Proxy{salt: PAYMASTER_SALT}(
            address(implementation),
            initData
        );

        address deployedProxyAddress = address(paymasterProxy);
        console.log(
            "ZKreditPaymaster proxy deployed at:",
            deployedProxyAddress
        );

        // Fund the paymaster with ETH if needed
        uint256 fundAmount = vm.envUint("FUND_AMOUNT");
        if (fundAmount > 0) {
            ZKreditPaymaster(payable(deployedProxyAddress)).depositToEntryPoint{
                value: fundAmount
            }();
            console.log("Funded paymaster with", fundAmount, "wei");
        }

        vm.stopBroadcast();

        console.log("ZKredit paymaster deployment completed successfully!");
    }
}
