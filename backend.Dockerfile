# ------------------------------
# Stage 1: Builder (install deps and build)
# ------------------------------
FROM node:20-alpine
WORKDIR /srv/app
COPY backend/package.json ./
RUN npm install
COPY ./backend ./
ENV NODE_ENV=production
ENV STRAPI_URL=https://econature-caroster2-gth6gfhmgqcwfjg8.francecentral-01.azurewebsites.net
RUN npm run build
EXPOSE 1337
CMD ["npm", "run", "start"]