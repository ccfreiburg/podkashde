FROM node:16 as builder
LABEL authors="Alex Roehm"
# update dependencies and install curl
ARG BAKE_FILE
RUN printenv
RUN echo ${BAKE_FILE}

# Create app directory
WORKDIR /build

COPY . . 

# update each dependency in package.json to the latest version
RUN yarn

# If you are building your code for production
RUN yarn build

FROM node:16
LABEL authors="Alex Roehm"

RUN apt-get update && apt-get install -y \
    curl dumb-init logrotate nginx\
    && rm -rf /var/lib/apt/lists/*

COPY ./docker/nginx/startup.sh /startup.sh
RUN chmod u+x /startup.sh

COPY ./docker/nginx/default /etc/nginx/sites-available/default
COPY ./docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/nginx/logrotate /etc/logrotate/nginx

COPY --from=builder --chown=node:node /build/.output /var/www
RUN chmod go-w /etc/logrotate/nginx
RUN chown -R node:node /var/www /etc/nginx /var/log/nginx /var/lib/nginx 
RUN chmod a+w /run

WORKDIR /var/www
USER node

EXPOSE 80

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD [ "/startup.sh" ]