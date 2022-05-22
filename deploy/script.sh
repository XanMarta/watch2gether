#!/bin/bash

# $1: SSH_HOST
# $2: SSH_USER
# $3: DOCKERHUB_USERNAME
# $4: DOCKERHUB_TOKEN
# $5: TAG
# $6: KEY_PATH


ssh -o StrictHostKeychecking=no -i "$6" $2@$1 rm -rf /home/$2/w2g
scp -o StrictHostKeychecking=no -i "$6" -r $(dirname $(realpath $0))/script $2@$1:/home/$2/w2g
ssh -o StrictHostKeychecking=no -i "$6" $2@$1 bash /home/$2/w2g/start.sh $3 $4 $5
