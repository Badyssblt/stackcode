FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier uniquement les fichiers nécessaires pour installer les dépendances
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm ci

# Copier le reste du projet
COPY . .

# Variables d'environnement pour Nuxt
ENV PORT=3000
ENV HOST=0.0.0.0
EXPOSE 3000

# Lancer Nuxt en mode dev
CMD ["npm", "run", "dev"]
