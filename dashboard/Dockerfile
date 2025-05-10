FROM nginx:latest

# Crear un directorio para la aplicación
WORKDIR /usr/share/nginx/html

# Copiar la build de la aplicación React
COPY ./dist .

# Exponer el puerto 80 (el puerto predeterminado de Nginx)
EXPOSE 80

# Comando para iniciar el servidor Nginx
CMD ["nginx", "-g", "daemon off;"]