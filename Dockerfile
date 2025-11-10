FROM node:20-alpine

# Installer Python + pip + dépendances de build nécessaires
RUN apk add --no-cache python3 py3-pip git \
    build-base libffi-dev openssl-dev cargo

# Installer Semgrep sans virtualenv
RUN pip install --no-cache-dir --break-system-packages semgrep

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci
COPY . .

ENV PORT=3000
ENV HOST=0.0.0.0
EXPOSE 3000

CMD ["npm", "run", "dev"]
