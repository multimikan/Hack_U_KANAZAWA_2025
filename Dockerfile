FROM node:18-alpine
WORKDIR /usr/src/app
COPY hacku_kanazawa_2025_app/package*.json ./
RUN npm ci
COPY hacku_kanazawa_2025_app/ ./
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
