### PMCD — Flujo desde ESP‑01 hasta el Dashboard

- **Alcance**: solo se detalla lo que ocurre desde que la Blue Pill envía datos por UART al ESP‑01, hasta que se visualizan en el dashboard, incluyendo transporte, mensajería, persistencia y suscripción.

### Secuencia de comunicación
1. **Envío UART → ESP‑01**
   - La Blue Pill transmite la muestra por **UART** al **ESP‑01** (trama con valores listos para publicar).
2. **Asociación Wi‑Fi**
   - El **ESP‑01** se conecta al **AP** provisto por la Raspberry Pi (SSID “PMCD”).
3. **Publicación por MQTT**
   - El ESP‑01 **publica** cada muestra en MQTT usando tópicos de la forma:
     - `pmcd/pressure/1` (presión en Pa)
     - `pmcd/temp` (temperatura en °C)
   - **Mensaje JSON** mínimo:
```json
{ "value": <numero>, "time": "YYYY-MM-DDTHH:MM:SSZ", "device": "bluepill-1" }
```
   - Se recomienda confirmar entrega con un **QoS** acorde a la criticidad (por ejemplo, 1).
4. **Broker y distribución**
   - El **broker MQTT (Mosquitto)** recibe cada publicación del ESP‑01 y la **redistribuye** a todos los clientes suscritos.
5. **Ingesta y almacenamiento**
   - Un servicio suscriptor valida el JSON y **persiste** en **SQLite** (tabla `measurement`) los campos relevantes (`device_name`, `timestamp`, presiones/temperatura, etc.).
6. **Suscripción del Dashboard**
   - El **dashboard web** se **suscribe** vía **WebSocket** a los mismos tópicos (`pmcd/#`).
   - Con cada mensaje recibido, **actualiza en tiempo real**:
     - Medidor de **presión** (rango configurable con estados normal/advertencia/crítico).
     - Tarjeta de **temperatura**.
   - El histórico queda disponible en **SQLite** para consultas posteriores.

### Vista resumida (texto)
```
Blue Pill (UART) -> ESP‑01 -> Wi‑Fi (AP Raspberry)
ESP‑01 (MQTT pub) -> Broker Mosquitto -> { Ingesta -> SQLite }
                                         -> Dashboard (MQTT WS sub)
```

### Resultado
- Los datos enviados por la Blue Pill llegan al ESP‑01, se publican por MQTT, se almacenan en SQLite mediante el servicio de ingesta y se reflejan en el dashboard de forma inmediata a través de la suscripción por WebSocket.
