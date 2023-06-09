FROM node:alpine

WORKDIR /chat-app/

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "run", "start"]
