FROM node:16 as builder
LABEL authors="Alex Roehm"
# update dependencies and install curl
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /build

COPY . . 

# update each dependency in package.json to the latest version
RUN yarn install

# If you are building your code for production
RUN yarn build

FROM node:16
WORKDIR /podkashde
COPY --from=builder /build/.output .
RUN chown -R 1000:1000 /podkashde
USER 1000:1000
EXPOSE 3000
CMD [ "node", "server/index.mjs" ]