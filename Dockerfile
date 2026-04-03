FROM node:16-alpine

WORKDIR /app

COPY package.json .

RUN npm install -f

COPY . .

RUN npm run build

EXPOSE 9000

CMD npm start