# Configuración de Ambiente K3s en Raspberry Pi

## Comando de Instalación Completa

```bash
curl -sfL https://get.k3s.io | sh - && sudo kubectl apply -f k3s/dashboard.yaml && sudo kubectl apply -f k3s/mqtt-broker.yaml
```

## Explicación Detallada del Comando

### 1. Instalación de K3s
```bash
curl -sfL https://get.k3s.io | sh -
```
- **Descarga e instala K3s**: Una versión ligera de Kubernetes optimizada para dispositivos con recursos limitados
- **Flags utilizados**:
  - `-s`: Modo silencioso (no muestra progreso)
  - `-f`: Falla silenciosamente en errores HTTP
  - `-L`: Sigue redirecciones
- **K3s**: Perfecto para Raspberry Pi por su bajo consumo de recursos y compatibilidad con ARM

### 2. Despliegue del Dashboard
```bash
sudo kubectl apply -f k3s/dashboard.yaml
```
- **Instala Kubernetes Dashboard**: Interfaz web para administrar el cluster
- **Funcionalidades**:
  - Visualización de pods, servicios y recursos
  - Gestión de aplicaciones desplegadas
  - Monitoreo del estado del cluster

### 3. Despliegue del Broker MQTT
```bash
sudo kubectl apply -f k3s/mqtt-broker.yaml
```
- **Instala un broker MQTT**: Protocolo para comunicación IoT
- **Propósito**: Permite la comunicación entre dispositivos IoT y aplicaciones

## Acceso a los Servicios

### Dashboard Web
- **URL**: `pmcd.local:30080`
- **Nota**: `pmcd` es el hostname de tu Raspberry Pi

### Broker MQTT
El broker MQTT está disponible en dos puertos diferentes:

#### 1. Puerto MQTT Estándar
- **URL**: `pmcd.local:30883`
- **Uso**: Conexiones MQTT tradicionales entre dispositivos IoT
- **Protocolo**: MQTT puro

#### 2. Puerto WebSocket
- **URL**: `pmcd.local:30091`
- **Uso**: Conexiones MQTT a través de navegadores web
- **Protocolo**: MQTT sobre WebSockets
- **Ventaja**: Permite conectar aplicaciones web directamente al broker

## Ventajas de este Setup

### Para Raspberry Pi
- **Bajo consumo de recursos**: K3s está optimizado para dispositivos ARM
- **Configuración automática**: Todo se instala y configura con un solo comando
- **Escalabilidad**: Puedes agregar más nodos fácilmente

### Para Desarrollo
- **Entorno completo**: Dashboard + Broker MQTT listos para usar
- **Ideal para IoT**: Perfecto para proyectos de Internet de las Cosas
- **Desarrollo local**: Cluster Kubernetes funcional en tu dispositivo

## Verificación de la Instalación

Para verificar que todo funciona correctamente:

```bash
# Verificar que K3s está corriendo
sudo systemctl status k3s

# Verificar los pods desplegados
sudo kubectl get pods --all-namespaces

# Verificar los servicios expuestos
sudo kubectl get services --all-namespaces
```

## Notas Importantes

- Asegúrate de que tu Raspberry Pi tenga suficiente espacio en disco
- El primer despliegue puede tomar varios minutos
- Los puertos mencionados deben estar disponibles en tu red local
- El hostname `pmcd` debe resolverse correctamente en tu red
