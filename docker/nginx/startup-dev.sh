#!/usr/bin/dumb-init /bin/sh
/usr/sbin/nginx &
yarn &
yarn dev