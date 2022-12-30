#!/usr/bin/dumb-init /bin/sh
/usr/sbin/nginx &
node /var/www/server/index.mjs