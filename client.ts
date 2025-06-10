// Client
import {
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  clusterApiUrl,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

import {
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
  createInitializeMintInstruction,
  getMintLen,
  getOrCreateAssociatedTokenAccount,
  getMint,
  getMetadataPointerState,
  getTokenMetadata,
  TYPE_SIZE,
  LENGTH_SIZE,
  createAccount,
  createMint,
  createMultisig,
} from "@solana/spl-token";

console.log("log");
const payer = pg.wallet.keypair;
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
console.log("log");

const ownerOne = Keypair.generate();
const ownerTwo = Keypair.generate();
const ownerThree = Keypair.generate();
console.log(`ownerOne: ${ownerOne.publicKey} ${ownerOne.secretKey}`);
console.log(`ownerTwo: ${ownerTwo.publicKey} ${ownerTwo.secretKey}`);
console.log(`ownerThree: ${ownerThree.publicKey} ${ownerThree.secretKey}`);
console.log("before multisign");

const multiSign = await createMultisig(
  connection,
  payer,
  [ownerOne.publicKey, ownerTwo.publicKey, ownerThree.publicKey],
  2,
  undefined,
  undefined,
  TOKEN_2022_PROGRAM_ID
);
console.log(`multisigne: ${multiSign}`);

const mint = await createMint(
  connection,
  payer,
  multiSign,
  multiSign,
  9,
  undefined,
  undefined,
  TOKEN_2022_PROGRAM_ID
);

console.log(`mint: ${mint}`);

const associatedTokenAccount = await getOrCreateAssociatedTokenAccount(
  connection,
  payer,
  mint,
  ownerOne.publicKey,
  undefined,
  undefined,
  undefined,
  TOKEN_2022_PROGRAM_ID
);

//console.log(`associeted account: ${associatedTokenAccount.address}`);
//
//console.log("log");
//const payer = pg.wallet.keypair;
//const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
//console.log("log");
//
//const ownerOne = Keypair.fromSecretKey(
//  new Uint8Array([
//    79, 0, 206, 62, 48, 217, 148, 71, 2, 18, 89, 216, 10, 10, 107, 131, 130, 54,
//    212, 228, 133, 42, 81, 38, 53, 140, 255, 193, 39, 172, 159, 138, 76, 115,
//    208, 123, 166, 115, 38, 23, 180, 77, 206, 166, 22, 28, 41, 191, 235, 19,
//    242, 6, 181, 81, 8, 146, 128, 206, 31, 248, 114, 83, 3, 201,
//  ])
//);
//const ownerTwo = Keypair.fromSecretKey(
//  new Uint8Array([
//    1, 132, 102, 210, 78, 20, 19, 121, 122, 235, 40, 213, 102, 95, 147, 154,
//    124, 183, 16, 14, 41, 151, 141, 206, 28, 86, 255, 88, 51, 38, 2, 222, 117,
//    172, 218, 136, 34, 177, 159, 252, 161, 85, 4, 149, 169, 222, 224, 165, 199,
//    234, 250, 40, 77, 198, 2, 255, 6, 166, 67, 68, 149, 6, 20, 186,
//  ])
//);
//const ownerThree = Keypair.fromSecretKey(
//  new Uint8Array([
//    59, 236, 135, 70, 173, 155, 169, 204, 121, 4, 244, 29, 236, 160, 101, 221,
//    53, 212, 109, 63, 63, 57, 215, 141, 10, 204, 129, 253, 203, 168, 15, 97,
//    255, 55, 104, 229, 93, 29, 244, 231, 197, 39, 117, 15, 210, 1, 230, 216,
//    251, 180, 198, 40, 185, 174, 128, 156, 65, 0, 142, 82, 206, 206, 194, 237,
//  ])
//);
//console.log(`ownerOne: ${ownerOne.publicKey} ${ownerOne.secretKey}`);
//console.log(`ownerTwo: ${ownerTwo.publicKey} ${ownerTwo.secretKey}`);
//console.log(`ownerThree: ${ownerThree.publicKey} ${ownerThree.secretKey}`);
//console.log("before multisign");
//
//const multiSign = new PublicKey("3W6QYGr4TGdGvKPxgVfqadCKDUJ7R3MCwCjYB7fYMc9Q");
//console.log(`multisigne: ${multiSign}`);
//
//const mint = new PublicKey("uV143R8uKad5DorNieP2rHg18DsEsWP5bFctXbG5CTy");
//
//console.log(`mint: ${mint}`);
//
//const associatedTokenAccount = new PublicKey(
//  "FKMRLx2HfWZmrtt8PxHrUVKTEc9mb57mxT5RJWPD87rT"
//);
//
//console.log(`associeted account: ${associatedTokenAccount}`);
//
//try {
//  const rep = await mintTo(
//    connection,
//    payer,
//    mint,
//    associatedTokenAccount,
//    multiSign,
//    100,
//    [ownerOne],
//    undefined,
//    TOKEN_2022_PROGRAM_ID
//  );
//} catch (e) {
//  console.log(e);
//}
//
//try {
//  const rep = await mintTo(
//    connection,
//    payer,
//    mint,
//    associatedTokenAccount,
//    multiSign,
//    100,
//    [ownerOne, ownerTwo],
//    undefined,
//    TOKEN_2022_PROGRAM_ID
//  );
//} catch (e) {
//  console.log(e);
//}
