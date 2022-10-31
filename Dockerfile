FROM sendy-docker-local.jfrog.io/node:14-alpine AS BUILD

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
FROM sendy-docker-local.jfrog.io/nginx:base_frontend

COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/src/app

COPY --from=BUILD --chown=sendy:sendy /build/dist/ .

USER sendy:sendy

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]