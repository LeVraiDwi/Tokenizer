#!/bin/bash

curl https://get.starkli.sh | zsh
. /root/.starkli/env
starkliup

export STARKNET_ACCOUNT=./starkli-wallets/deployer/account.json
export STARKNET_ACCOUNT=./starkli-wallets/deployer/account.json

export PATH="$PATH:$HOME/.local/bin"
curl --proto '=https' --tlsv1.2 -sSf https://docs.swmansion.com/scarb/install.sh | zsh