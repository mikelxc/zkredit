//! ZKredit Asset Claim Circuit
//! This program verifies a user has assets on a source chain without revealing exact details
//! and generates a ZK proof that can be verified on-chain.

// These two lines are necessary for the program to properly compile.
//
// Under the hood, we wrap your main function with some extra code so that it behaves properly
// inside the zkVM.
#![no_main]
sp1_zkvm::entrypoint!(main);

use alloy_sol_types::SolType;
use zkredit_lib::{AssetClaimPublicValues, verify_balance_proof, compute_commitment};

pub fn main() {
    // Read public inputs to the program
    let source_chain_id = sp1_zkvm::io::read::<u64>();
    let asset_address = sp1_zkvm::io::read::<[u8; 32]>();
    let min_balance_threshold = sp1_zkvm::io::read::<u64>();
    let user_address = sp1_zkvm::io::read::<[u8; 20]>();
    let target_chain_id = sp1_zkvm::io::read::<u64>();
    
    // Read private inputs
    let actual_balance = sp1_zkvm::io::read::<u64>();
    
    // Read balance proof signature
    let balance_proof = sp1_zkvm::io::read::<[u8; 64]>();
    
    // Read API key hash (private)
    let api_key_hash = sp1_zkvm::io::read::<[u8; 32]>();
    
    // Verify that actual_balance >= min_balance_threshold
    assert!(actual_balance >= min_balance_threshold, "Insufficient balance");
    
    // Verify balance_proof is valid for this user and asset
    let is_valid = verify_balance_proof(
        &balance_proof,
        &user_address,
        &asset_address,
        actual_balance
    );
    
    // Only proceed if verification is valid
    assert!(is_valid, "Invalid balance proof");
    
    // Generate a commitment that can be used to prevent double-spending
    let nullifier = compute_commitment(
        &user_address,
        &asset_address,
        min_balance_threshold,
        target_chain_id
    );
    
    // Convert to Solidity-compatible types
    let user_addr = alloy_sol_types::private::Address::from(user_address);
    let asset_addr = alloy_sol_types::private::B256::from(asset_address);
    let nullifier_bytes = alloy_sol_types::private::B256::from(nullifier);
    
    // Encode the public values
    let public_values = AssetClaimPublicValues {
        sourceChainId: source_chain_id.into(),
        assetAddress: asset_addr,
        minBalanceThreshold: min_balance_threshold.into(),
        userAddress: user_addr,
        targetChainId: target_chain_id.into(),
        nullifier: nullifier_bytes
    };
    
    let bytes = AssetClaimPublicValues::abi_encode(&public_values);
    
    // Commit to the public values of the program
    sp1_zkvm::io::commit_slice(&bytes);
}
