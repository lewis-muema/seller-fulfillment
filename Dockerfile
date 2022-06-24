FROM sendy-docker-local.jfrog.io/node:14-alpine AS BUILD

WORKDIR /build

COPY package*.json ./

RUN npm install

COPY . .

RUN echo "$DOCKER_ENV"

RUN if [ "$DOCKER_ENV" = "testing" ]; \
        then npm run staging; \
        elif [ "$DOCKER_ENV" = "beta" ]; \
        then npm run beta; \
        else npm run build; \
        fi

#####################
FROM sendy-docker-local.jfrog.io/nginx:stable-alpine

RUN adduser -D sendy

WORKDIR /usr/src/app

RUN mkdir -p /var/run/nginx /var/tmp/nginx \
&& chown -R sendy:sendy /usr/share/nginx/ /var/run/ /var/tmp/nginx /etc/nginx 


# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log

COPY  nginx/default.conf  /etc/nginx/conf.d/
COPY  nginx/nginx.conf /etc/nginx/nginx.conf

COPY --from=BUILD --chown=sendy:sendy /build/dist ./

USER sendy:sendy

EXPOSE 8080 

CMD ["nginx", "-g", "daemon off;"]
