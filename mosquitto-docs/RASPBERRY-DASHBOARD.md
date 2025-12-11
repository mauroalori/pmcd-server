# Reiniciar el Dashboard

Para actualizar el dashboard con la última versión disponible en Docker Hub:

1. **Antes de borrar el dashboard**, construir y subir la imagen para Raspberry Pi:

```bash
cd dashboard
pnpm run build-pi3
```

Este comando compila el dashboard, construye la imagen Docker para la plataforma ARM v7 (Raspberry Pi) y la sube a Docker Hub.

2. Eliminar el pod actual:

```bash
sudo kubectl delete pod -l app=dashboard
```

El pod se recreará automáticamente con la nueva imagen desde Docker Hub.