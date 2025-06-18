# MQTT Broker on Raspberry Pi

This file contains the configuration and commands for using the MQTT broker installed on a Raspberry Pi.

## Requirements

- Raspberry Mosquitto MQTT Broker
- MQTT Client (mosquitto_pub, mosquitto_sub)
- Node.js (for the dashboard)

## Install Mosquitto Clients

```bash
sudo apt-get install mosquitto-clients
```

## Publish Data

### Pressure Sensor
```bash
mosquitto_pub -h 10.10.10.1 -p 30883 -t "pmcd/pressure/1" -m '{"value": 123456, "time": "2024-03-21T12:34:56Z"}'
```

### Temperature
```bash
mosquitto_pub -h 10.10.10.1 -p 30883 -t "pmcd/temp" -m '{"value": 25.5, "time": "2024-03-21T12:34:56Z"}'
```

## Subscribe to Data

### Using mosquitto_sub
```bash
# Subscribe to all PMCD topics
mosquitto_sub -h 10.10.10.1 -p 30883 -t "pmcd/#"

# Subscribe to specific topics
mosquitto_sub -h 10.10.10.1 -p 30883 -t "pmcd/pressure/1"
mosquitto_sub -h 10.10.10.1 -p 30883 -t "pmcd/temp"
```

### Using the Dashboard

The dashboard automatically subscribes to the required topics when started. To test:

1. Start the dashboard:
```bash
cd dashboard
npm run dev
```

2. Publish test data:
```bash
# In another terminal
mosquitto_pub -h 10.10.10.1 -p 30883 -t "pmcd/pressure/1" -m '{"value": 150000, "time": "2024-03-21T12:34:56Z"}'
mosquitto_pub -h 10.10.10.1 -p 30883 -t "pmcd/temp" -m '{"value": 25.5, "time": "2024-03-21T12:34:56Z"}'
```

## Message Format

All messages must follow the JSON format:
```json
{
  "value": number,  // numeric sensor value
  "time": string    // ISO timestamp
}
```