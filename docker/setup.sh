#!bin/sh

cd docker

docker build -t name_latest . 

docker run -it --name name_container -v `pwd`/..:/Shared name_latest