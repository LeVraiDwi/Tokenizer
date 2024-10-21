docker stop $(docker container ls -q)
docker image rm $(docker image ls -q)
docker container rm $(docker container ls -q)
docker container rm $(docker container ls -q)
docker image prune
docker container prune