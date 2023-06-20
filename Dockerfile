FROM node:18.16-alpine

ENV TZ=Asia/Tokyo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN apk add --update tzdata 
RUN apk add curl

WORKDIR /app/front
COPY . ./

COPY package.json /front/package.json
COPY package-lock.json /front/package-lock.json

RUN apk update && apk add --no-cache npm
RUN npm install
EXPOSE 3000
RUN npm run build
CMD ["npm","run","start"]