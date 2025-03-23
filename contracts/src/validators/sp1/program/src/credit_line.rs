//! ZKredit Credit Line Circuit
//! This program verifies a user has an approved credit line without revealing exact details
//! and generates a ZK proof that can be verified on-chain.

#![no_main]
sp1_zkvm::entrypoint!(main);

use alloy_sol_types::SolType;
use zkredit_lib::{CreditLinePublicValues, verify_credit_approval, compute_commitment};

pub fn main() {
    // Read public inputs to the program
    let credit_provider = sp1_zkvm::io::read::<[u8; 32]>();
    let min_credit_amount = sp1_zkvm::io::read::<u64>();
    let user_address = sp1_zkvm::io::read::<[u8; 20]>();
    let target_chain_id = sp1_zkvm::io::read::<u64>();
    
    // Read private inputs
    let actual_credit_limit = sp1_zkvm::io::read::<u64>();
    
    // Read credit approval signature
    let credit_approval = sp1_zkvm::io::read::<[u8; 64]>();
    
    // Read credit terms hash (private)
    let credit_terms_hash = sp1_zkvm::io::read::<[u8; 32]>();
    
    // Verify that actual_credit_limit >= min_credit_amount
    assert!(actual_credit_limit >= min_credit_amount, "Insufficient credit limit");
    
    // Verify credit approval is valid for this user and provider
    let is_valid = verify_credit_approval(
        &credit_approval,
        &user_address,
        &credit_provider,
        actual_credit_limit
    );
    
    // Only proceed if verification is valid
    assert!(is_valid, "Invalid credit approval");
    
    // Generate a commitment that can be used to prevent double-spending
    let nullifier = compute_commitment(
        &user_address,
        &credit_provider,
        min_credit_amount,
        target_chain_id
    );
    
    // Convert to Solidity-compatible types
    let user_addr = alloy_sol_types::private::Address::from(user_address);
    let provider_bytes = alloy_sol_types::private::B256::from(credit_provider);
    let nullifier_bytes = alloy_sol_types::private::B256::from(nullifier);
    
    // Encode the public values
    let public_values = CreditLinePublicValues {
        creditProvider: provider_bytes,
        minCreditAmount: min_credit_amount.into(),
        userAddress: user_addr,
        targetChainId: target_chain_id.into(),
        nullifier: nullifier_bytes
    };
    
    let bytes = CreditLinePublicValues::abi_encode(&public_values);
    
    // Commit to the public values of the program
    sp1_zkvm::io::commit_slice(&bytes);
}
