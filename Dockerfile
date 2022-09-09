FROM node:16 as builder
LABEL authors="Alex Roehm"
# update dependencies and install curl

# Create app directory
WORKDIR /build

COPY . . 

# update each dependency in package.json to the latest version
RUN yarn install

# If you are building your code for production
RUN yarn build

FROM node:16
RUN apt-get update && apt-get install -y \
    curl dumb-init\
    && rm -rf /var/lib/apt/lists/*


WORKDIR /podkashde
COPY --from=builder --chown node:node /build/.output .
RUN chown -R 1000:1000 /podkashde
USER 1000:1000
EXPOSE 3000
CMD [ "dumb-init", "node", "server/index.mjs" ]