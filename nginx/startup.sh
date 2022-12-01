#!/usr/bin/dumb-init /bin/sh
/usr/sbin/nginx &
runuser -u www-data -g www-data -- node /var/www/server/index.mjs