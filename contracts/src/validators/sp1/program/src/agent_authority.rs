//! ZKredit Agent Authority Circuit
//! This program verifies an agent has been authorized by a user to perform certain operations
//! and generates a ZK proof that can be verified on-chain.

#![no_main]
sp1_zkvm::entrypoint!(main);

use alloy_sol_types::SolType;
use zkredit_lib::{AgentAuthorityPublicValues, verify_agent_auth, compute_commitment, get_current_time};

pub fn main() {
    // Read public inputs to the program
    let agent_id = sp1_zkvm::io::read::<[u8; 32]>();
    let user_address = sp1_zkvm::io::read::<[u8; 20]>();
    let max_spending_limit = sp1_zkvm::io::read::<u64>();
    let target_chain_id = sp1_zkvm::io::read::<u64>();
    
    // Read private inputs
    let auth_signature = sp1_zkvm::io::read::<[u8; 64]>();
    let permissions_bitmap = sp1_zkvm::io::read::<u32>();
    let expiration_time = sp1_zkvm::io::read::<u64>();
    
    // Verify the authorization signature
    let is_valid = verify_agent_auth(
        &auth_signature,
        &user_address,
        &agent_id,
        max_spending_limit
    );
    
    // Only proceed if verification is valid
    assert!(is_valid, "Invalid agent authorization");
    
    // Check that authorization hasn't expired
    let current_time = get_current_time();
    assert!(current_time <= expiration_time, "Authorization expired");
    
    // Generate a commitment that can be used as agent identity proof
    let nullifier = compute_commitment(
        &user_address,
        &agent_id,
        max_spending_limit,
        target_chain_id
    );
    
    // Convert to Solidity-compatible types
    let user_addr = alloy_sol_types::private::Address::from(user_address);
    let agent_bytes = alloy_sol_types::private::B256::from(agent_id);
    let nullifier_bytes = alloy_sol_types::private::B256::from(nullifier);
    
    // Encode the public values
    let public_values = AgentAuthorityPublicValues {
        agentId: agent_bytes,
        userAddress: user_addr,
        maxSpendingLimit: max_spending_limit.into(),
        targetChainId: target_chain_id.into(),
        nullifier: nullifier_bytes
    };
    
    let bytes = AgentAuthorityPublicValues::abi_encode(&public_values);
    
    // Commit to the public values of the program
    sp1_zkvm::io::commit_slice(&bytes);
}
