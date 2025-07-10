FROM node:22 
LABEL authors="Alex Roehm"
ARG VERSION
ARG BUILDTIME
ARG REVISION
ARG NUXT_PUBLIC_UMAMI_HOST
ARG NUXT_PUBLIC_UMAMI_ID

ENV DATABASE_PATH=/data
ENV DATABASE_FILE=podcasts.sqlite
ENV DATA_PATH=/var/www

ENV NUXT_PUBLIC_UMAMI_HOST ${NUXT_PUBLIC_UMAMI_HOST}
ENV NUXT_PUBLIC_UMAMI_ID ${NUXT_PUBLIC_UMAMI_ID}

RUN apt-get update && apt-get install -y \
    curl dumb-init logrotate nginx vim \
    && rm -rf /var/lib/apt/lists/*

# prepare nginx
COPY ./docker/nginx/default /etc/nginx/sites-available/default
COPY ./docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/nginx/logrotate /etc/logrotate/nginx

RUN chown -R node:node /etc/nginx /var/log/nginx /var/lib/nginx 
RUN chmod go-w /etc/logrotate/nginx
RUN chmod a+w /run

WORKDIR /data
RUN chown node:node .

WORKDIR /app
RUN chown node:node .
COPY --chown=node:node . . 
USER node

# install startup script
RUN cp docker/nginx/startup.sh .
RUN chmod a+x startup.sh

# prepare backend
RUN cd ./backend && yarn 

# Prepare Versioning
RUN printf 'export const BUILDTIME= "'$BUILDTIME'"\n' > version.ts
RUN printf 'export const REVISION= "'$REVISION'"\n' >> version.ts
RUN printf 'export const VERSION = "'$VERSION'"\n' >> version.ts

# update each dependency in package.json to the latest version
RUN yarn 
RUN yarn build

EXPOSE 80

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD [ "./startup.sh" ]