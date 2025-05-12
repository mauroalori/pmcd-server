# 🔄 Actualización y prueba del Dashboard en Minikube

Este documento describe los pasos para actualizar y probar la aplicación **Dashboard** dentro del clúster de desarrollo local con **Minikube**, una vez que el entorno ya está configurado.


## 🚀 Pasos para actualizar y ver los cambios

1. ### 🔧 Compilar el proyecto

   Generar los archivos de salida (ej. `dist/`):

   ```bash
   pnpm run build
   ```

2. ### 🐳 Buildear la imagen Docker dentro del entorno de Minikube

   Primero, asegurate de que tu terminal use el Docker de Minikube:

   ```bash
   eval $(minikube docker-env)
   ```

   Luego, construí la imagen `dashboard` (reemplazá `.` si tu Dockerfile está en otra ruta):

   ```bash
   docker build -t dashboard .
   ```

3. ### ♻️ Reiniciar el deployment de Kubernetes

   Para que los pods usen la nueva imagen `dashboard` recién construída:

   ```bash
   kubectl rollout restart deployment dashboard
   ```

## ✅ Verificación

   Podés verificar que los pods estén actualizados con:

   ```bash
   kubectl get pods
   kubectl describe deployment dashboard
   ```

   Y acceder al servicio vía:

   ```bash
   minikube service dashboard
   ```


## 📌 Notas

* Asegurate de que el `imagePullPolicy` esté en `IfNotPresent` o no definido para que Kubernetes use la imagen local.
* Si querés ver logs de la app en tiempo real:

  ```bash
  kubectl logs -f deployment/dashboard
  ```
