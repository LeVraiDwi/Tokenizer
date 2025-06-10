FROM ubuntu:latest

RUN apt-get update && \
	apt-get install -y vim curl && \ 
	apt-get upgrade -y

WORKDIR /home

COPY share/setup.sh ./

RUN chmod 777 ./setup.sh

RUN sh ./setup.sh
ENV PATH="/root/.local/share/solana/install/active_release/bin:${PATH}"
CMD ["solana-test-validator"]