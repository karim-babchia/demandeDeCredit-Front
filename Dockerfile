# Stage 1: Build Angular
FROM node:18-alpine AS build

WORKDIR /app

# Copier package.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le code source
COPY . .

# Build de l'application
RUN npm run build

# Stage 2: Nginx
FROM nginx:alpine

# Supprimer les fichiers par défaut de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copier les fichiers depuis le dossier browser (Angular 17+)
COPY --from=build /app/dist/sakai-ng/browser /usr/share/nginx/html/

# Configuration Nginx pour Angular
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
