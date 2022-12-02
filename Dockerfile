FROM sendy-docker-local.jfrog.io/node:14-alpine AS BUILD

USER root

WORKDIR /build

COPY package*.json ./

RUN npm install

COPY . .

ARG ENV=$ENV

RUN if [ "$ENV" = "testing" ]; \
        then npm run staging; \
        elif [ "$ENV" = "beta" ]; \
        then npm run beta; \
        else npm run build; \
        fi

#####################
FROM sendy-docker-local.jfrog.io/distroless-nginx-base

USER root

WORKDIR /usr/src/app

COPY --from=BUILD /build/dist/ .

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]