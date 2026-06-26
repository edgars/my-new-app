FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm install --ignore-scripts && npx prisma generate && npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app ./
EXPOSE 3000
CMD ["sh", "-c", "npx prisma db push --skip-generate --accept-data-loss && npm start"]
