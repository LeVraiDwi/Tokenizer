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
  createInitializeMetadataPointerInstruction,
  getMint,
  getMetadataPointerState,
  getTokenMetadata,
  TYPE_SIZE,
  LENGTH_SIZE,
  createAccount,
  createMint,
  createMultisig,
} from "@solana/spl-token";
import {
  createInitializeInstruction,
  createUpdateFieldInstruction,
  createRemoveKeyInstruction,
  pack,
  TokenMetadata,
} from "@solana/spl-token-metadata";

console.log("log");
const payer = pg.wallet.keypair;
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
console.log("log");
// Generate new keypair for Mint Account
const mintKeypair = Keypair.generate();
// Address for Mint Account
const mint = mintKeypair.publicKey;

const ownerOne = Keypair.fromSecretKey(
  new Uint8Array([
    147, 32, 106, 116, 155, 158, 124, 25, 106, 16, 15, 47, 223, 183, 56, 218,
    90, 68, 58, 190, 163, 54, 221, 136, 237, 202, 141, 50, 221, 53, 6, 112, 72,
    33, 14, 80, 214, 150, 57, 196, 135, 131, 163, 144, 237, 82, 76, 124, 180,
    47, 177, 77, 139, 180, 29, 115, 147, 0, 240, 132, 200, 149, 79, 135,
  ])
); //5rZbAcF4TQdowbCUTfSAM7MNYQEFudsx3BkiMJYvhTS6
const ownerTwo = Keypair.fromSecretKey(
  new Uint8Array([
    162, 209, 167, 165, 173, 237, 210, 210, 123, 189, 190, 94, 199, 93, 75, 54,
    130, 99, 217, 225, 205, 89, 143, 66, 178, 115, 177, 139, 250, 183, 193, 63,
    183, 214, 128, 163, 254, 242, 92, 220, 205, 170, 110, 137, 32, 168, 126, 4,
    134, 196, 153, 69, 72, 192, 109, 19, 244, 166, 58, 232, 122, 16, 98, 167,
  ])
); //DNdKKKaQHVn3Qg9PwdYmqEAGtYpKVYueoiBi64WFvaLn
const ownerThree = Keypair.fromSecretKey(
  new Uint8Array([
    246, 233, 57, 40, 127, 182, 234, 142, 135, 108, 192, 159, 48, 38, 218, 221,
    123, 62, 30, 75, 107, 159, 223, 33, 229, 73, 95, 91, 55, 216, 187, 200, 210,
    141, 240, 71, 5, 213, 69, 219, 84, 12, 22, 117, 77, 172, 99, 186, 217, 55,
    57, 108, 199, 199, 65, 73, 117, 172, 13, 212, 161, 147, 117, 254,
  ])
); //FAv9ZyTATm86etFXT6bj2M8G3K6j5C5JmMRTvMGFTTj3
const multisigne = Keypair.fromSecretKey(
  new Uint8Array([
    52, 153, 131, 151, 1, 220, 48, 71, 63, 141, 207, 166, 200, 245, 114, 83,
    114, 91, 183, 115, 82, 126, 3, 198, 68, 174, 9, 141, 9, 158, 208, 170, 105,
    52, 38, 4, 126, 134, 157, 34, 6, 67, 57, 133, 232, 88, 136, 183, 204, 98,
    161, 234, 177, 35, 45, 117, 130, 222, 161, 219, 54, 72, 125, 92,
  ])
); //85fvs3HTG51ADso1zEyXuRCxzT2CnWqibNRJMiGHsLrf
console.log(`ownerOne: ${ownerOne.publicKey} ${ownerOne.secretKey}`);
console.log(`ownerTwo: ${ownerTwo.publicKey} ${ownerTwo.secretKey}`);
console.log(`ownerThree: ${ownerThree.publicKey} ${ownerThree.secretKey}`);
console.log("before multisign");

//const multiSign = await createMultisig(
//  connection,
//  payer,
//  [ownerOne.publicKey, ownerTwo.publicKey, ownerThree.publicKey],
//  2,
//  multisigne,
//  undefined,
//  TOKEN_2022_PROGRAM_ID
//);
console.log(`multisigne: ${multisigne.publicKey} ${multisigne.secretKey}`);
const multiSign = multisigne.publicKey;
// Transaction to send
let transaction: Transaction;
// Transaction signature returned from sent transaction
let transactionSignature: string;

// Metadata to store in Mint Account
const metaData: TokenMetadata = {
  updateAuthority: multiSign,
  mint: mint,
  name: "42Health",
  symbol: "FTH",
  uri: "https://raw.githubusercontent.com/LeVraiDwi/Tokenizer/refs/heads/solana/metadata.json",
  additionalMetadata: [
    ["description", "Token that represente amount of data share"],
  ],
};

// Size of MetadataExtension 2 bytes for type, 2 bytes for length
const metadataExtension = TYPE_SIZE + LENGTH_SIZE;

// Size of metadata
const metadataLen = pack(metaData).length;

// Size of Mint Account with extension
const mintLen = getMintLen([ExtensionType.MetadataPointer]);

// Minimum lamports required for Mint Account
const lamports = await connection.getMinimumBalanceForRentExemption(
  mintLen + metadataExtension + metadataLen
);

console.log(`mint: ${mint}`);

// Instruction to invoke System Program to create new account
const createAccountInstruction = SystemProgram.createAccount({
  fromPubkey: payer.publicKey, // Account that will transfer lamports to created account
  newAccountPubkey: mint, // Address of the account to create
  space: mintLen, // Amount of bytes to allocate to the created account
  lamports, // Amount of lamports transferred to created account
  programId: TOKEN_2022_PROGRAM_ID, // Program assigned as owner of created account
});

// Instruction to initialize the MetadataPointer Extension
const initializeMetadataPointerInstruction =
  createInitializeMetadataPointerInstruction(
    mint, // Mint Account address
    multiSign, // Authority that can set the metadata address
    mint, // Account address that holds the metadata
    TOKEN_2022_PROGRAM_ID
  );

// Instruction to initialize Mint Account data
const initializeMintInstruction = createInitializeMintInstruction(
  mint, // Mint Account Address
  9, // Decimals of Mint
  multiSign, // Designated Mint Authority
  null, // Optional Freeze Authority
  TOKEN_2022_PROGRAM_ID // Token Extension Program ID
);

// Instruction to initialize Metadata Account data
const initializeMetadataInstruction = createInitializeInstruction({
  programId: TOKEN_2022_PROGRAM_ID, // Token Extension Program as Metadata Program
  metadata: mint, // Account address that holds the metadata
  updateAuthority: multiSign, // Authority that can update the metadata
  mint: mint, // Mint Account address
  mintAuthority: multiSign, // Designated Mint Authority
  name: metaData.name,
  symbol: metaData.symbol,
  uri: metaData.uri,
});

// Add instructions to new transaction
transaction = new Transaction().add(
  createAccountInstruction,
  initializeMetadataPointerInstruction,
  // note: the above instructions are required before initializing the mint
  initializeMintInstruction,
  initializeMetadataInstruction
);

// Send transaction
transactionSignature = await sendAndConfirmTransaction(
  connection,
  transaction,
  [payer, mintKeypair, multisigne] // Signers
);

console.log(
  "\nCreate Mint Account:",
  `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`
);


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
// try {
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
//  console.log(`${rep}`);
// } catch (e) {
//  console.log(e);
// }

// try {
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
//  console.log(`${rep}`);
// } catch (e) {
//  console.log(e);
// }
