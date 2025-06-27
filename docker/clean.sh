docker stop $(docker container ls -q)
docker image rm -f $(docker image ls -q)
docker container rm -f $(docker container ls -q)
docker container rm -f $(docker container ls -q)
docker image prune
docker container prune