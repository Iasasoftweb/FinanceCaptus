FROM node:20-alpine as build

WORKDIR /app



# Instalamos pnpm globalmente
RUN npm install -g pnpm


RUN apk add --no-cache python3 make g++ libc6-compat

# Copiamos archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalamos dependencias
RUN pnpm install

# Copiamos el resto del código
COPY . .

# Añadimos dependencias necesarias para compilación en Alpine


# Ejecutamos build de Vite
#RUN pnpm run build

# Etapa de producción con Nginx
#FROM nginx:alpine
#COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 3000

#CMD ["nginx", "-g", "daemon off;"]

CMD ["pnpm", "dev"]
