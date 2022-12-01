FROM node:16 as builder
LABEL authors="Alex Roehm"
# update dependencies and install curl

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
    curl dumb-init nginx\
    && rm -rf /var/lib/apt/lists/*

COPY --chown=www-data:www-data ./nginx/startup.sh /nginx/startup.sh
RUN chmod u+x /nginx/startup.sh

COPY --chown=www-data:www-data ./nginx/default /etc/nginx/sites-available/default
COPY --chown=www-data:www-data ./nginx/nginx.conf /etc/nginx/nginx.conf

WORKDIR /var/www
COPY --from=builder --chown=www-data:www-data /build/.output .

EXPOSE 80

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD [ "/nginx/startup.sh" ]