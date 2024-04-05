import { Connection } from "@solana/web3.js";

const RPC_ENDPOINT =
  "https://solana-mainnet.core.chainstack.com/35bccaccd6024f7394a27e6450b2f3a5";
const solanaConnection = new Connection(RPC_ENDPOINT || "", {
  wsEndpoint:
    "wss://solana-mainnet.core.chainstack.com/ws/35bccaccd6024f7394a27e6450b2f3a5",
});

// // Function to fetch the latest blocks
// const indexedSlots = new Set();

// async function getLatestBlocks() {
//   try {
//     // Get the latest block
//     solanaConnection
//       .getSlot()
//       .then((slot) => {
//         if (!indexedSlots.has(slot)) {
//           indexedSlots.add(slot);
//           return solanaConnection.getBlock(slot, {
//             maxSupportedTransactionVersion: 0,
//           });
//         }
//       })
//       .then((block) => {
//         if (block) {
//           console.log(block?.parentSlot);
//         }
//       });

//     setTimeout(() => getLatestBlocks(), 50);
//   } catch (error) {
//     console.error("Error:", error);
//   }
// }

// // Call the function to fetch the latest blocks
// getLatestBlocks();

// async function getBlock(blockNumber: number) {
//   // Connect to the Solana cluster
//   const connection = new Connection("https://api.mainnet-beta.solana.com");

//   // Get the block information
//   const block = await connection.getBlock(blockNumber, {
//     maxSupportedTransactionVersion: 0,
//   });

//   return block;
// }

const lookFor =
  "23AG65Yy9YnnPSyod1SrfKyHixKYy97jdbxZg95HnnYqDcgxyo7jKzvsFwWCth4VWABQ4K3eNtdDmjLc7ipLac1a";

// // Usage example
// getBlock(252598125)
//   .then((block) => {
//     console.log(
//       JSON.stringify(
//         block?.transactions.filter(({ transaction }) =>
//           transaction.signatures.includes(lookFor)
//         )
//       )
//     );
//   })
//   .catch((error) => {
//     console.error(error);
//   });

solanaConnection
  .getParsedTransaction(lookFor, {
    commitment: "confirmed",
    maxSupportedTransactionVersion: 0,
  })
  .then((txn) => {
    console.log(JSON.stringify(txn));
  });
