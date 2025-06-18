# MQTT Testing with Docker

This file contains the configuration and commands for testing MQTT communication using Mosquitto in a Docker container.

## Docker Container Configuration

To start the Mosquitto broker in a Docker container:

```bash
docker run -it --rm \
  -p 1883:1883 \
  -p 9001:9001 \
  -v $(pwd)/mosquitto.conf:/mosquitto/config/mosquitto.conf \
  eclipse-mosquitto
```

This command:
- Runs the official Eclipse Mosquitto image
- Maps port 1883 (default MQTT port)
- Mounts the local `mosquitto.conf` file in the container
- Removes the container when stopped (`--rm`)

## Local MQTT Communication Testing

### Subscribe to a Topic

To subscribe to "cafetera/state" and listen for messages:

```bash
mosquitto_sub -h localhost -t cafetera/state
```

### Publish a Message

To publish a message to "cafetera/state":

```bash
mosquitto_pub -h localhost -t cafetera/state -m "Hello from mosquitto_pub"
``` 