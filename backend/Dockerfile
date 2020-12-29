FROM node:12.18.3

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY ./ ./

EXPOSE 5000

RUN npm install

CMD ["npm","start"]
