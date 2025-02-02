// connection.js
const solanaWeb3 = require("@solana/web3.js");

// Create a connection to the Solana Devnet
const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl("devnet"), "confirmed");

async function getBalance(publicKeyStr) {
  const publicKey = new solanaWeb3.PublicKey(publicKeyStr);
  const balance = await connection.getBalance(publicKey);
  console.log(`Balance for ${publicKeyStr}: ${balance / solanaWeb3.LAMPORTS_PER_SOL} SOL`);
}

(async () => {
  // Example usage:
  // Replace with your keypair or test public key
  const myPubkey = "Fte3eao1KhWmqwbjLLMs8BCdLwa2qm5THVzrRvAepncZ";
  await getBalance(myPubkey);
})();
