FROM ubuntu:latest

RUN apt-get update && \
	apt-get install -y vim git clang make valgrind curl zsh && \ 
	apt-get upgrade -y

WORKDIR /home

COPY share/setup.sh ./

RUN chmod 777 ./setup.sh

RUN [ "sh" , "./setup.sh"]

ENV PATH="$PATH:/root/.local/bin:/root/.starkli/bin"