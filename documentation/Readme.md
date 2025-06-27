# How to use the Token

## mint
You can use the following methode to mint token.

```
    mintTo(connection: Connection, payer: Signer, mint: PublicKey, destination: PublicKey, authority: Signer | PublicKey, amount: number | bigint, multiSigners?: Signer[], confirmOptions?: ConfirmOptions, programId?: PublicKey): Promise<TransactionSignature>
```

## transfert
You can use the following methode to transfer token from a contract to another.

```
    function transfer(connection: Connection, payer: Signer, source: PublicKey, destination: PublicKey, owner: Signer | PublicKey, amount: number | bigint, multiSigners?: Signer[], confirmOptions?: ConfirmOptions, programId?: PublicKey): Promise<TransactionSignature>
```

## burn
You can use the following methode to burn token.

```
    burn(connection: Connection, payer: Signer, account: PublicKey, mint: PublicKey, owner: Signer | PublicKey, amount: number | bigint, multiSigners?: Signer[], confirmOptions?: ConfirmOptions, programId?: PublicKey): Promise<TransactionSignature>
```

## close
You can use the following methode to close a account and get back part of the lamport.

```
    closeAccount(connection: Connection, payer: Signer, account: PublicKey, destination: PublicKey, authority: Signer | PublicKey, multiSigners?: Signer[], confirmOptions?: ConfirmOptions, programId?: PublicKey): Promise<TransactionSignature>
```