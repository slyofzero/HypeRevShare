import {
  NATIVE_MINT,
  closeAccount,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import web3, { Connection, PublicKey } from "@solana/web3.js";
import crypto from "crypto";

function decrypt(encryptedItem: string) {
  const decipher = crypto.createDecipher(
    "aes-256-ctr",
    'Pj]xsGe%7&8y=b";-Z6D^*'
  );
  const decryptedPrivateKey = Buffer.concat([
    decipher.update(Buffer.from(encryptedItem, "hex")),
    decipher.final(),
  ]).toString();

  return decryptedPrivateKey;
}

const RPC_ENDPOINT = "https://api.mainnet-beta.solana.com";
const connection = new Connection(RPC_ENDPOINT || "");
const encryptedSecretKey =
  "15fc9fe9808c4bc7112ce31667a908c006d3344f774729a722d516ee160788e5ff22d7d0cffa638dac56634a9f6026c2e55ed81a2b4179fe482e6802473aac976075d4970e996cf08be1ed4a4fc1ad62d8bdc10908f4b725ec2cac868c8ecf29b71531a527082fcb8d6d644328bbbd359d4b7b39e83ee4d65c53e35e1a9d5e167db59dd450693f08490630b0ba72d574b2bae35f514f14dd234c6cd803c46e53f5746988c95ebb3522628db368213d3e97704520f0c4c336bd20509b0e967b43e3cf1e309cf919b1b946e4c9c1e39fe9a52ad5bf027f99db0e31cc6c6c6a8a";

(async () => {
  const secretKey = decrypt(encryptedSecretKey);
  const secretKeyArray = new Uint8Array(JSON.parse(secretKey));
  const wallet = web3.Keypair.fromSecretKey(secretKeyArray);
  const balance = await connection.getBalance(wallet.publicKey);
  const toPubkey = new PublicKey(
    "973oWq77yqvMnvR95qviBJ38Lm5PQZLvEoGZJaMxHLwF"
  );

  const associatedTokenAccount = await getAssociatedTokenAddress(
    NATIVE_MINT,
    wallet.publicKey
  );

  const walletBalance = await connection.getBalance(wallet.publicKey);
  console.log(`Balance before unwrapping 1 WSOL: ${walletBalance}`);

  await closeAccount(
    connection,
    wallet,
    associatedTokenAccount,
    wallet.publicKey,
    wallet
  );

  const walletBalancePostClose = await connection.getBalance(wallet.publicKey);
  console.log(`Balance after unwrapping 1 WSOL: ${walletBalancePostClose}`);

  // const { lamportsPerSignature } = (
  //   await solanaConnection.getRecentBlockhash("confirmed")
  // ).feeCalculator;
  // console.log(account.publicKey.toString(), toPubkey.toString(), balance);

  // const transaction = new web3.Transaction().add(
  //   web3.SystemProgram.transfer({
  //     fromPubkey: account.publicKey,
  //     toPubkey,
  //     lamports: balance - lamportsPerSignature,
  //   })
  // );
  // const signature = await web3.sendAndConfirmTransaction(
  //   solanaConnection,
  //   transaction,
  //   [account]
  // );
  // console.log(signature);
})();
