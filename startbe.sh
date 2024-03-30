#!/usr/bin/bash
function clean_up()
{
    echo "Exiting..."
    kill $bePID
    exit
}
# Trigger cleanup on CTRL + C
trap clean_up SIGINT EXIT

cd backend
yarn
yarn start &
bePID=$!
CHECKBE=""
i=0
while  [ -z "${CHECKBE}" -a $i -lt 20 ];
do
    CHECKBE=`curl -s http://localhost:3003/api/podcasts -I | grep 200`
    sleep 2s
    let "(i++)"
done

trap clean_up ERR
