# Tokenizer
Projet réalisé dans le cadre de mes études à 42

## Blockchain
Une blockchain est un ensemble de données représentant des transactions, stockées sur plusieurs ordinateurs au sein d'un réseau. Chaque nouvel ensemble de transactions ajouté à la chaîne est appelé un bloc.

## Preuve de Travail (Proof of Work)
La preuve de travail est une opération nécessitant beaucoup de ressources de calcul, mais facile à vérifier (ex. : double conversion d'un header en SHA-256 pour le Bitcoin). Cette opération permet de déterminer quel opérateur peut modifier la blockchain et de vérifier que le bloc ajouté n'est pas falsifié.

## Preuve d’Enjeu (Proof of Stake)
La preuve d'enjeu est un algorithme permettant d'atteindre le consensus sur un réseau distribué. Elle nécessite peu de calcul, mais un certain montant de cryptomonnaie (l'enjeu) pour participer à la création d'un bloc.

## Delegated Proof of Stake
Les détenteurs de jetons élisent des délégués qui sont responsables de la validation des transactions.

## Proof of Authority
Des autorités de confiance sont choisies pour valider les transactions.

## Ethereum
Ethereum est un réseau de machines (nœuds) qui communiquent via le protocole Ethereum. N'importe qui peut rejoindre le réseau, et toute personne peut participer à la vérification des transactions à condition de déposer 32 ETH (la cryptomonnaie liée à Ethereum). Les smart contracts sont des programmes qui composent la blockchain et sont activés par les transactions des utilisateurs. Lorsqu'un contrat est publié, il ne peut être modifié ou supprimé ; il fait partie de la blockchain à jamais.

## Starknet
Starknet est une surcouche basée sur le layer 2 d'Ethereum, visant à permettre d'effectuer plus de transactions, plus rapidement, afin d'améliorer la scalabilité d'Ethereum. Agir au layer 2 d'Ethereum permet également de créer des smart contracts plus complexes et de limiter les coûts.

## Pourquoi Starknet ?
Starknet permet de :
    Effectuer plus de transactions à moindre coût.
    Gérer des contrats plus complexes.
    Utiliser Ethereum, qui est moins polluant.
    Utiliser le langage Cairo pour ses contrats.
    Avoir un système de preuve intégré qui vérifie l'intégrité des blocs avant de les pousser sur Ethereum.
    Avoir un séquenceur qui permet de déterminer quelle transaction dans un bloc est fausse.

## Que faire de ce token ?
Le smart contract que j'ai créé permet de générer des tokens qui serviront de monnaie dans un jeu. Le contrat constitue le portefeuille du joueur, tandis que les tokens représentent la monnaie.


# Tokenizer
Project completed as part of my studies at 42

## Blockchain
A blockchain is a set of data representing transactions, stored on multiple computers within a network. Each new set of transactions added to the chain is called a block.

## Proof of Work
Proof of Work is an operation requiring a lot of computational resources but is easy to verify (e.g., double hashing a header in SHA-256 for Bitcoin). This operation determines which operator can modify the blockchain and verifies that the added block is not falsified.

## Proof of Stake
Proof of Stake is an algorithm that allows consensus to be reached on a distributed network. It requires little computation but a certain amount of cryptocurrency (the stake) to participate in the creation of a block.

## Delegated Proof of Stake
Token holders elect delegates who are responsible for validating transactions.

## Proof of Authority
Trusted authorities are chosen to validate transactions.

## Ethereum
Ethereum is a network of machines (nodes) that communicate via the Ethereum protocol. Anyone can join the network, and anyone can participate in transaction verification as long as they deposit 32 ETH (the cryptocurrency linked to Ethereum). Smart contracts are programs that make up the blockchain and are activated by user transactions. Once a contract is published, it cannot be modified or deleted; it is part of the blockchain forever.

## Starknet
Starknet is a layer 2 scaling solution for Ethereum, designed to enable more transactions to be processed more quickly, improving Ethereum's scalability. Operating at layer 2 also allows for the creation of more complex smart contracts and reduces costs.

## Why Starknet?
Starknet allows:
    More transactions to be processed at a lower cost.
    Management of more complex contracts.
    Use of Ethereum, which is less polluting.
    Utilization of the Cairo language for its contracts.
    An integrated proof system that verifies the integrity of blocks before pushing them to Ethereum.
    A sequencer that determines which transaction in a block is false.

## What to do with this token?
The smart contract I created allows for the generation of tokens that will serve as currency in a game. The contract acts as the player's wallet, while the tokens represent the currency.

# Create the Tokken:

## Setup

Run:
```
curl https://get.starkli.sh | zsh
. /root/.starkli/env
starkliup
```

Run:
```
export STARKNET_ACCOUNT=./starkli-wallets/deployer/account.json
export STARKNET_ACCOUNT=./starkli-wallets/deployer/account.json
```

Run:
```
export PATH="$PATH:$HOME/.local/bin"
curl --proto '=https' --tlsv1.2 -sSf https://docs.swmansion.com/scarb/install.sh | zsh
```

## Account and api key
### Add the addr to API services
Run:
```
export STARKNET_RCP=https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_7/[secretToken]
```

### fetch account

Run:
```
starkli signer keystore from-key ./starkli-wallets/deployer/keystore.json
```

Run:

```
starkli account fetch [accountAddr] --output ./starkli-wallets/deployer/account.json --rpc=$STARKNET_RCP
```

2 file should be create in ./starkli-wallets/deployer/
account.json and keystore.json

### deploy account

Run:
```
starkli account deploy ./starkli-wallets/deployer/account.json
```

## Create and deploy Smart contract
### Build
Run:
```
scarb build
```

### RPC
To interact with the Starknet network, you need to set an RPC endpoint within Starkli. in our case we use Alchemy.

### Declaring the smart contract
Declaring the class of your contract, sending your contract’s code to the network.

Run:
```
starkli declare target/dev/contract.json --rpc=$STARKNET_RCP --compiler-version=2.8.2
```

output:
```Declaring Cairo 1 class: 0x014f310dedff23e6cb8a0e7473776d7d2e84ace3a7d3872002ff33adff0da68a
Compiling Sierra class to CASM with compiler version 2.8.2...
CASM class hash: 0x0085eab342912fc68924eddf62ccf68a822f82eb795d3329261388782e2f1fb8
Contract declaration transaction: 0x07701519b1faed147c1c56f8f32da442aca24cb76e69d6f2a23baa6bc916f1ef
Class hash declared:
0x014f310dedff23e6cb8a0e7473776d7d2e84ace3a7d3872002ff33adff0da68a
```

### Deploying a smart contract
Deploying a contract, i.e. creating an instance of the code you previously declared.

Get the name and symbol of theo tokken:
```
python3 -i ./src/util.py
>>> str_to_felt("42GoldenPocketToken")
1164018672775343672315887991257447216970425710
>>> str_to_felt("42GoldenPocket")
1058668815653930935073629362939252
```

Run:
```
starkli deploy <YOUR_CLASS_HASH> <SMART_WALLET_ADDRESS> <NameHex> <SymboleHex> <decimal> <TotalSuplie> <salt>
```

with the precedent output:
```
starkli deploy --rpc=$STARKNET_RCP 0x014f310dedff23e6cb8a0e7473776d7d2e84ace3a7d3872002ff33adff0da68a 0x05216E78D8D4A1B33c08AFCF39cE666FEEDef9A189eE418FBB2c4DDBfd09B065 1164018672775343672315887991257447216970425710 1058668815653930935073629362939252 15 1000000 0
```

output:
```
Deploying class 0x014f310dedff23e6cb8a0e7473776d7d2e84ace3a7d3872002ff33adff0da68a with salt 0x03655ef959bc7708a8c7986e113e7be106d1c6c621b086c5a354ca54b3350793...
The contract will be deployed at address 0x06b0b8c0cb6b228942212a074ca4eaf036379dce58eac1d17ab4b56af4bcfc9b
Contract deployment transaction: 0x07d2d3ae8c5d6e8d46c04c2ce07484cb67a08ab80c848e8a229a511813ec56ee
Contract deployed:
0x06b0b8c0cb6b228942212a074ca4eaf036379dce58eac1d17ab4b56af4bcfc9b
```