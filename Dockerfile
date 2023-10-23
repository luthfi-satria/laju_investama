FROM node:16.15.1-alpine

WORKDIR /app

# EXPOSE 3001

COPY package.json .

#RUN npm install glob rimraf
RUN npm install

COPY . .
COPY .env.local .env

ENV NODE_ENV=development
CMD ["npm", "run", "dev"]
