FROM node:22.6-slim
WORKDIR /usr/src/app
COPY . .
RUN npm i
EXPOSE 3000
ENTRYPOINT [ "node", "index.js" ]