cd backend
yarn
yarn start &
CHECKBE=""
i=0
while  [ -z "${CHECKBE}" -a $i -lt 20 ];
do
    CHECKBE=`curl -s http://localhost:3003/api/podcasts -I | grep 200`
    sleep 2s
    let "(i++)"
done