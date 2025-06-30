# Reiniciar el Dashboard

Para actualizar el dashboard con la última versión disponible en Docker Hub:

1. Eliminar el pod actual:

```bash
kubectl delete pod -l app=dashboard
```