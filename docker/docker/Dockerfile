From ubuntu:latest

RUN apt-get update && \
	apt-get install -y vim git clang make valgrind curl zsh && \ 
	apt-get upgrade -y

RUN curl https://get.starkli.sh | zsh
RUN . /root/.starkli/env
RUN starkliup

RUN export STARKNET_ACCOUNT=./starkli-wallets/deployer/account.json
RUN export STARKNET_KEYSTORE=./starkli-wallets/deployer/keystore.json

RUN export PATH="$PATH:$HOME/.local/bin"
RUN curl --proto '=https' --tlsv1.2 -sSf https://docs.swmansion.com/scarb/install.sh | zsh

WORKDIR /Shared

VOLUME /Shared