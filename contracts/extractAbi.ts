// export-deployments.js
import fs from "fs";
import path from "path";

// Find the latest broadcast file
function findLatestBroadcast() {
  const broadcastDir = path.join(__dirname, "broadcast");
  const allFiles = fs.readdirSync(broadcastDir, { recursive: true });

  const runLatestFiles = allFiles.filter(
    (file) => typeof file === "string" && file.endsWith("run-latest.json")
  );

  if (runLatestFiles.length === 0) {
    throw new Error("No broadcast files found");
  }

  // Sort by modification time to get the latest
  return path.join(broadcastDir, String(runLatestFiles[0]));
}

// Extract contract data from broadcast file
function extractContractData(broadcastFile) {
  const data = JSON.parse(fs.readFileSync(broadcastFile, "utf8"));
  const contracts = {};

  for (const tx of data.transactions) {
    if (tx.transactionType === "CREATE" || tx.transactionType === "CREATE2") {
      contracts[tx.contractName] = {
        address: tx.contractAddress,
        deployer: tx.from,
      };
    }
  }

  return contracts;
}

// Extract ABIs from compiler output
function extractAbis(contracts) {
  const outDir = path.join(__dirname, "out");
  const deploymentDir = path.join(__dirname, "deployments");

  // Create output directory
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir);
  }
  if (!fs.existsSync(path.join(deploymentDir, "abis"))) {
    fs.mkdirSync(path.join(deploymentDir, "abis"));
  }

  // Process each contract
  Object.keys(contracts).forEach((contractName) => {
    // Find contract artifact
    const artifactPath = findArtifact(outDir, contractName);
    if (!artifactPath) {
      console.warn(`ABI not found for ${contractName}`);
      return;
    }

    // Extract ABI
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    fs.writeFileSync(
      path.join(deploymentDir, "abis", `${contractName}.json`),
      JSON.stringify(artifact.abi, null, 2)
    );

    // Add ABI reference to contract data
    contracts[contractName].abi = `abis/${contractName}.json`;
  });

  // Save deployment info
  fs.writeFileSync(
    path.join(deploymentDir, "deployments.json"),
    JSON.stringify(
      {
        timestamp: Date.now(),
        contracts,
      },
      null,
      2
    )
  );

  console.log(`Deployment data exported to ${deploymentDir}`);
}

// Helper to find artifact file
function findArtifact(outDir, contractName) {
  const files = fs.readdirSync(outDir, { recursive: true });
  const artifactFile = files.find(
    (file) =>
      typeof file === "string" &&
      file.endsWith(`${contractName}.json`) &&
      !file.includes("test")
  );

  return artifactFile ? path.join(outDir, String(artifactFile)) : null;
}

// Main execution
try {
  const broadcastFile = findLatestBroadcast();
  const contracts = extractContractData(broadcastFile);
  extractAbis(contracts);
} catch (error) {
  console.error("Error:", error.message);
}
