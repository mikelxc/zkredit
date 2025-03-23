# ZKredit SP1 Validator

This project implements a zero-knowledge proof validator for the ZKredit system using SP1 (Succinct Proof of Validity). The SP1 validator enables verification of credit line claims without revealing sensitive financial data.

## Overview

The `SP1CreditValidator` contract works as follows:

1. A credit provider generates an SP1 zero-knowledge proof that verifies a user has been approved for a certain credit line
2. This proof is verified on-chain when the user tries to withdraw funds from the ZKredit system
3. If the proof is valid, the user can access their credit line without revealing sensitive data

## Components

- **SP1CreditValidator.sol**: The main validator contract that integrates with SP1 proof verification
- **DeploySP1Validator.s.sol**: Foundry script for deploying and registering the validator

## Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- An SP1 proof generation system (refer to SP1 documentation for details)

## Getting Started

### Install Dependencies

```bash
forge install
```

### Configure Environment Variables

Create a `.env` file with the following variables:

```
# SP1 Verification
VERIFIER=0x3B6041173B80E77f038f3F2C0f9744f04837185e  # SP1 verifier address on your chain
PROGRAM_VKEY= # Your program verification key

# Deployment
RPC_URL=https://your-rpc-url.com
PRIVATE_KEY=your_private_key
REGISTRY_ADDRESS=0x0000000000000000000000000000000000000000  # ZKredit registry address
DEPLOYER_ADDRESS=0x0000000000000000000000000000000000000000  # Optional, defaults to sender
TEST_USER=0x0000000000000000000000000000000000000000  # Optional test user
```

### Run Tests

```bash
forge test -vvv
```

### Deploy the Validator

```bash
source .env
forge script script/DeploySP1Validator.s.sol:DeploySP1Validator --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast
```

## Integration with ZKredit System

1. Deploy the `SP1CreditValidator` contract
2. Register the validator with the ZKredit registry
3. Set up credit providers in the validator
4. Generate SP1 proofs off-chain for approved credit lines
5. Users can withdraw funds by providing a valid proof

## How It Works

### Credit Line Proof Structure

The `CreditLineProof` structure contains:
- `user`: User wallet address
- `creditAmount`: Approved credit line amount
- `validUntil`: Timestamp until which the credit is valid
- `provider`: Credit provider address

### Validation Process

1. A user or third-party application submits a withdrawal request with an SP1 proof
2. The validator verifies the proof using the SP1 verifier contract
3. If the proof is valid, the validator checks:
   - The proof is for the correct user
   - The credit line hasn't expired
   - The credit amount is sufficient
   - The credit provider is authorized
4. If all checks pass, the withdrawal is approved

### Creating a Credit Line Proof

You'll need to implement an SP1 circuit that generates proofs with the required public values. Refer to [SP1 documentation](https://github.com/succinctlabs/sp1) for details on creating ZK circuits and proofs.

## Security Considerations

- Only authorized credit providers can issue valid proofs
- Proofs have expiration dates to limit risk
- Each proof can only be used once
- Credit amount limits are enforced on-chain

## License

MIT