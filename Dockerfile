FROM node:24.3.0-alpine
WORKDIR /app
ENV NODE_ENV=production
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
RUN npm ci
# Bundle app source
COPY . .
CMD [ "npm", "start" ]