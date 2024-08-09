#!/usr/bin/dumb-init /bin/sh
/usr/sbin/nginx &

function clean_up()
{
    echo "Exiting..."
    kill $fePID
    kill $bePID
    exit
}
# Trigger cleanup on CTRL + C
trap clean_up SIGINT EXIT

cd backend
yarn
yarn dev &
CHECKBE=""
i=0
while  [ -z "${CHECKBE}" -a $i -lt 20 ];
do
    CHECKBE=`curl -s http://localhost:3003/api/podcasts -I | grep 200`
    sleep 2s
    let "(i++)"
done

cd ..
yarn
yarn dev &
fePID=$!
CHECKFE=""
i=0
while  [ -z "${CHECKFE}" -a $i -lt 20 ];
do
    CHECKFE=`curl -s http://localhost:3000/podcasts -I | grep 200`
    sleep 2s
    let "(i++)"
done

trap clean_up ERR