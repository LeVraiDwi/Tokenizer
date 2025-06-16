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
  TYPE_SIZE,
  LENGTH_SIZE,
  mintTo,
  createMultisig,
} from "@solana/spl-token";
import {
  createInitializeInstruction,
  pack,
  TokenMetadata,
} from "@solana/spl-token-metadata";

console.log("log");
const payer = pg.wallet.keypair;
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
console.log("log");

// Generate new keypair for Mint Account
const mintKeypair = Keypair.generate(); //2eFhhTNjBNrgXw2iVgowMnD3bsewRnUDE8hsqZ8FJ1Gm
// Address for Mint Account
const mint = mintKeypair.publicKey;

// Generate new keypair for the multisign
const ownerOne = Keypair.generate(); //74cLi2c2J7tmyvPgeRVpE1Sy7k4fLidMEAnzBvHWSbk1 / 63,255,185,14,51,179,71,71,79,235,57,101,170,155,6,233,130,163,64,175,201,202,29,182,95,22,70,150,177,159,245,91,90,18,210,163,82,21,59,62,36,100,235,133,218,51,110,167,249,64,149,13,47,247,201,54,126,97,177,106,175,224,86,126
const ownerTwo = Keypair.generate(); //H6TV5wqrVk2wthRezPM8J5ZxvnsTQwRzYsqgHrifSTYn / 25,195,57,121,230,139,246,182,40,69,135,141,252,180,221,216,249,88,225,179,35,160,42,86,147,67,33,21,91,221,237,14,239,32,215,54,205,0,194,46,60,189,87,128,36,217,72,193,158,70,119,217,214,162,191,84,180,93,210,119,191,0,227,3
const ownerThree = Keypair.generate(); //FHwTRGBVqnk5ykJB7nAGv5AMSy3ipDistnERkBJZ7win / 139,28,12,144,29,90,185,93,215,65,224,90,245,233,194,222,232,232,167,156,254,235,49,4,248,246,190,6,148,229,242,6,212,90,123,161,89,130,85,244,98,180,53,171,18,188,105,232,103,123,231,216,224,161,113,181,231,12,53,66,124,158,85,159
const multisigne = Keypair.generate(); //3jD2w4guShaSCoMX2Q7rUVm7cNtBy6JwXruhdv7uZSWK

console.log(`ownerOne: ${ownerOne.publicKey} ${ownerOne.secretKey}`);
console.log(`ownerTwo: ${ownerTwo.publicKey} ${ownerTwo.secretKey}`);
console.log(`ownerThree: ${ownerThree.publicKey} ${ownerThree.secretKey}`);
console.log("before multisign");

// create the contract that manage the multisign
const multiSign = await createMultisig(
  connection,
  payer,
  [ownerOne.publicKey, ownerTwo.publicKey, ownerThree.publicKey],
  2,
  multisigne,
  undefined,
  TOKEN_2022_PROGRAM_ID
);

console.log(`multisigne: ${multisigne.publicKey} ${multisigne.secretKey}`);

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

// create a contract that hold the balance of token
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

console.log(`${associatedTokenAccount.address}`);
try {
  // try to mint some token
  const rep = await mintTo(
    connection,
    payer,
    mint,
    associatedTokenAccount.address,
    multiSign,
    100,
    [ownerOne],
    undefined,
    TOKEN_2022_PROGRAM_ID
  );
  console.log(`${rep}`);
} catch (e) {
  console.log(e);
}

try {
  // try to mint some token
  const rep = await mintTo(
    connection,
    payer,
    mint,
    associatedTokenAccount.address,
    multiSign,
    100,
    [ownerOne, ownerTwo],
    undefined,
    TOKEN_2022_PROGRAM_ID
  );
  console.log(`${rep}`);
} catch (e) {
  console.log(e);
}
