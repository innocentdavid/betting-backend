import * as anchor from "@project-serum/anchor";
import { toast } from "react-toastify";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import {
  PublicKey,
  Keypair,
  Connection,
  Transaction,
  clusterApiUrl,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionSignature,
  TransactionInstruction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

import { IDL } from "./idl";

const connection = new Connection(clusterApiUrl("devnet"));

const PROGRAM_ID = "624V3FNs96HeJwHGGNwTPLNRjhkvP48Vj9bgBuV4AZA4";

export const getProgram = (wallet: any) => {
  let provider = new anchor.AnchorProvider(
    connection,
    wallet,
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(IDL, PROGRAM_ID, provider);
  return program;
};

export const transferSol = async (
  wallet: WalletContextState,
  referralKey: string,
  solAmount: number
): Promise<string | null> => {
  if (wallet.publicKey === null || wallet.publicKey === undefined) throw new WalletNotConnectedError();
  console.log("transferSol start!!!!");
  console.log("Sender wallet public key", wallet.publicKey.toBase58());
  const program = getProgram(wallet);
  console.log("Receiver wallet public key", referralKey);
  const tx = new Transaction().add(
    await program.methods
      .transferSol(new anchor.BN(solAmount * LAMPORTS_PER_SOL))
      .accounts({
        from: wallet.publicKey,
        to: referralKey,
        systemProgram: SystemProgram.programId,
      })
      .instruction()
  );
  console.log("transferSol end!!!!");
  // let tx = new Transaction();
  // tx.add(sendIx);
  return await send(connection, wallet, tx);
};

export const showToast = (txt, duration = 5000, ty = 0) => {
  // let type = toast.TYPE.SUCCESS;
  // if (ty === 1) type = toast.TYPE.ERROR;
  // if (ty === 2) type = toast.TYPE.INFO;

  let autoClose = duration;
  // if (duration < 0) {
  //   autoClose = false;
  // }
  return toast.error(txt, {
    position: "bottom-right",
    autoClose,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    // type,
    theme: "colored",
  });
};

async function send(
  connection: Connection,
  wallet: WalletContextState,
  transaction: Transaction
) {
  const txHash = await sendTransaction(connection, wallet, transaction);
  if (txHash != null) {
    let confirming_id = showToast("Confirming Transaction ...", -1, 2);
    let res = await connection.confirmTransaction(txHash);
    console.log(txHash);
    toast.dismiss(confirming_id);
    if (res.value.err) showToast("Transaction Failed", 2000, 1);
    else showToast("Transaction Confirmed", 2000);
  } else {
    showToast("Transaction Failed", 2000, 1);
  }
  return txHash;
}

export async function sendTransaction(
  connection: Connection,
  wallet: WalletContextState,
  transaction: Transaction
) {
  if (wallet.publicKey === null || wallet.signTransaction === undefined)
    return null;
  try {
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;
    transaction.feePayer = wallet.publicKey;
    const signedTransaction = await wallet.signTransaction(transaction);
    const rawTransaction = signedTransaction.serialize();

    showToast("Sending Transaction ...", 500);
    // notify({
    //   message: "Transaction",
    //   description: "Sending Transaction ...",
    //   duration: 0.5,
    // });

    const txid: TransactionSignature = await connection.sendRawTransaction(
      rawTransaction,
      {
        skipPreflight: true,
        preflightCommitment: "processed",
      }
    );
    return txid;
  } catch (e) {
    console.log("tx e = ", e);
    return null;
  }
}

