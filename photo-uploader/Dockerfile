FROM node:18

WORKDIR /usr/src/app/photo-uploader

COPY package*.json ./

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]