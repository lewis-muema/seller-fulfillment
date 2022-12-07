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
FROM sendy-docker-local.jfrog.io/nginx:base

COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/src/app
RUN chown -R sendy:sendy /usr/src/app && \
    chown sendy:sendy /etc/nginx/nginx.conf && \
        chown sendy:sendy /etc/nginx/conf.d/default.conf
COPY --from=BUILD --chown=sendy:sendy /build/dist/ .

USER sendy:sendy

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]