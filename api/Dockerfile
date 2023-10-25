# syntax=docker/dockerfile:1

FROM node:lts-alpine
WORKDIR /gimmekeys/api
COPY ./api ./
COPY ./packages /gimmekeys/packages
RUN mkdir -p /var/www/cdn/gimmekeys/users
RUN mkdir -p /var/www/cdn/gimmekeys/temp/users
RUN mkdir -p /var/www/cdn/gimmekeys/cars
RUN mkdir -p /var/www/cdn/gimmekeys/temp/cars
RUN npm install --omit=dev
CMD [ "npm", "start"]
EXPOSE 4002
