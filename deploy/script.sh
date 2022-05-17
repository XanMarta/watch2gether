#!/bin/bash

# $1: SSH_HOST
# $2: SSH_USER
# $3: SSH_PRIVATE_KEY
# $4: DOCKERHUB_USERNAME
# $5: DOCKERHUB_TOKEN
# $6: TAG


mkdir -p ~/.ssh/
echo "$3" > ~/.ssh/keys
chmod 600 ~/.ssh/keys

ssh -o StrictHostKeychecking=no -i ~/.ssh/keys $2@$1 rm -rf /home/$2/w2g
scp -o StrictHostKeychecking=no -i ~/.ssh/keys -r $(dirname $(realpath $0))/script $2@$1:/home/$2/w2g
ssh -o StrictHostKeychecking=no -i ~/.ssh/keys $2@$1 bash /home/$2/w2g/start.sh $4 $5 $6
