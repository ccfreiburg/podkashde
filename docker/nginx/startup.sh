#!/usr/bin/dumb-init /bin/sh
/usr/sbin/nginx &

clean_up()
{
    echo "Exiting..."
    kill $bePID
    exit
}
# Trigger cleanup on CTRL + C
trap clean_up INT EXIT

env

cd /app/backend
yarn start &
bePID=$!

CHECKBE=""
i=0
while  [ -z "${CHECKBE}" -a $i -lt 20 ];
do
    CHECKBE=`curl -s http://localhost:3003/api/podcasts -I | grep 200`
    sleep 2s
    i=$((i+1))
done

node /app/.output/server/index.mjs 