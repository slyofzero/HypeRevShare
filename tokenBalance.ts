import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

const fetchBalances = async (ownerAddress: string, token: string) => {
  const connection = new Connection(clusterApiUrl("mainnet-beta"));
  const ownerPublicKey = new PublicKey(ownerAddress);
  const tokenPublicKey = new PublicKey(token);
  const balance = await connection.getParsedTokenAccountsByOwner(
    ownerPublicKey,
    {
      mint: tokenPublicKey,
    }
  );

  const tokenBalance =
    balance.value[0]?.account.data.parsed.info.tokenAmount.uiAmount;
  return Number(tokenBalance.toFixed(2));
};

fetchBalances(
  "7gdjJU8Rjcc512Lp2EnaZZvuA2hSMDZmwTzSijgHvoL9",
  "A3eME5CetyZPBoWbRUwY3tSe25S6tb18ba9ZPbWk9eFJ"
).then((val) => console.log(val));
