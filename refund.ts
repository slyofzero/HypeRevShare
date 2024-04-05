import web3, { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { log } from "console";
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

const splitPaymentsWith = {
  dev: {
    address: "Cd4qPLh7UAfKog5EyHv7ZXPyPCWuuyWbqk3LxRzpC1u4",
    share: 0.4,
  },
  me: {
    address: "ELMXLPCtKjDVSTgNXdHBM7kHhC9yUzxBZYpmGfLsaGVC",
    share: 0.3,
  },
  mario: {
    address: "JAefeLFopjVGnFbwRbs29PEbmHNzWMpSsq5dE7cz2Evy",
    share: 0.3,
  },
  // neo: {
  //   address: "Aq8bbkfMtsVbTnJvkdU1ktib2ftfuHXzEbswDD7xM3LW",
  //   share: 0.3,
  // },
};

const RPC_ENDPOINT = "https://api.mainnet-beta.solana.com";
const solanaConnection = new Connection(RPC_ENDPOINT || "");

async function sendTransaction(secretKey: string, amount: number, to?: string) {
  try {
    if (!to) {
      return false;
    }

    const secretKeyArray = new Uint8Array(JSON.parse(secretKey));
    const account = web3.Keypair.fromSecretKey(secretKeyArray);
    const toPubkey = new PublicKey(to);

    const { lamportsPerSignature } = (
      await solanaConnection.getRecentBlockhash("confirmed")
    ).feeCalculator;

    const transaction = new web3.Transaction().add(
      web3.SystemProgram.transfer({
        fromPubkey: account.publicKey,
        toPubkey,
        lamports: amount - lamportsPerSignature,
      })
    );

    const signature = await web3.sendAndConfirmTransaction(
      solanaConnection,
      transaction,
      [account]
    );

    log(`Fees of ${amount} lamports sent to account ${to}`);

    return signature;
  } catch (error) {
    const err = error as Error;
    console.log(err.message);
    log(`No transaction for ${amount} to ${to}`);
  }
}

(async () => {
  const encryptedSecretKey =
    "15fc9fe9808c4bc7152ffe0f66b711c61cca35556f4b36ba23d408f3120e88e0f73fced5dbef6296b554795f967c2fd9f05cc30226596cf351376f185a3faf976477c88e0d8375f29ff8e85f57cdb57bdaa5d80811edb630f420b79f8d92ca3cae1a24bc23102cd784787c423db8a135824a633df639fdd64257fc5e069446197db699d8506f3c1754063ea4a577c96ab3bbfc4055510fdd3a4b72c001d06f4beb746593d75fbd35246897a6663926328c6d4d2feed9c42dbb38518f1392775cfacc033789e41cb1a25be5c9d5fc9bf5ac32dca70a13";

  const secretKey = decrypt(encryptedSecretKey);
  const secretKeyArray = new Uint8Array(JSON.parse(secretKey));
  const account = web3.Keypair.fromSecretKey(secretKeyArray);
  const totalPaymentAmount = await solanaConnection.getBalance(
    account.publicKey
  );

  // sendTransaction(
  //   secretKey,
  //   totalPaymentAmount,
  //   "973oWq77yqvMnvR95qviBJ38Lm5PQZLvEoGZJaMxHLwF"
  // ).then(() =>
  //   log(
  //     `Fees of ${totalPaymentAmount} lamports sent to account 973oWq77yqvMnvR95qviBJ38Lm5PQZLvEoGZJaMxHLwF`
  //   )
  // );

  const { dev, me, mario } = splitPaymentsWith;

  const myShare = Math.floor(me.share * totalPaymentAmount);
  const marioShare = Math.floor(mario.share * totalPaymentAmount);
  const devShare = totalPaymentAmount - (myShare + marioShare);

  sendTransaction(secretKey, myShare, me.address);
  sendTransaction(secretKey, marioShare, mario.address);
  sendTransaction(secretKey, devShare, dev.address);

  // sendTransaction(secretKey, neoShare, neo.address).then(() =>
  //   log(`Fees of ${neoShare} lamports sent to account ${neo.address}`)
  // );
})();
