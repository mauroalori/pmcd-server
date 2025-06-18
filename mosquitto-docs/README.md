# MQTT Broker Configuration and Usage

## Requirements

- Mosquitto MQTT Broker
- MQTT Client (mosquitto_pub, mosquitto_sub)
- Node.js (for dashboard)
- pnpm (package manager)

## Broker Configuration

1. Install Mosquitto:
```bash
sudo apt-get install mosquitto mosquitto-clients
```

2. Configure broker for WebSocket:
Edit `/etc/mosquitto/mosquitto.conf`:
```
listener 1883
protocol mqtt

listener 9001
protocol websockets
```

3. Restart service:
```bash
sudo systemctl restart mosquitto
```

## MQTT Topics and Messages

### Topics Structure
- `pmcd/pressure/1`: Pressure sensor data
- `pmcd/temp`: Temperature data

### Message Format
All messages must follow the JSON format:
```json
{
  "value": number,  // sensor numeric value
  "time": string    // ISO timestamp
}
```

### Example Messages
```json
// Pressure sensor message
{
  "value": 123456,  // value in pascals
  "time": "2024-03-21T12:34:56Z"
}

// Temperature message
{
  "value": 25.5,    // value in Celsius
  "time": "2024-03-21T12:34:56Z"
}
```

## Publishing Data

### Using mosquitto_pub
```bash
# Publish pressure data
mosquitto_pub -t "pmcd/pressure/1" -m '{"value": 123456, "time": "2024-03-21T12:34:56Z"}'

# Publish temperature data
mosquitto_pub -t "pmcd/temp" -m '{"value": 25.5, "time": "2024-03-21T12:34:56Z"}'
```

## Subscribing to Data

### Using mosquitto_sub
```bash
# Subscribe to all PMCD topics
mosquitto_sub -t "pmcd/#"

# Subscribe to specific topic
mosquitto_sub -t "pmcd/pressure/1"
mosquitto_sub -t "pmcd/temp"
```

### Using the Dashboard

The dashboard automatically subscribes to required topics on startup. To test:

1. Start the dashboard:
```bash
cd dashboard
pnpm install
pnpm run dev
```

2. Publish test data:
```bash
# In another terminal
mosquitto_pub -t "pmcd/pressure/1" -m '{"value": 150000, "time": "2024-03-21T12:34:56Z"}'
mosquitto_pub -t "pmcd/temp" -m '{"value": 25.5, "time": "2024-03-21T12:34:56Z"}'
```

## Connection Verification

To verify the broker is running:
```bash
# Check service status
sudo systemctl status mosquitto

# Check used ports
sudo netstat -tuln | grep -E '1883|9001'
```

## Dashboard Integration

The dashboard connects to the MQTT broker using WebSocket (port 9001). Make sure to:

1. Configure the environment variable in `.env.local`:
```
NEXT_PUBLIC_MQTT_BROKER=ws://localhost:9001
```

2. Build and run the dashboard:
```bash
cd dashboard
pnpm install
pnpm run build
pnpm start
```

## Troubleshooting

1. If the broker fails to start:
```bash
# Check logs
sudo journalctl -u mosquitto

# Verify configuration
sudo mosquitto -c /etc/mosquitto/mosquitto.conf -v
```

2. If the dashboard can't connect:
- Verify the broker is running
- Check WebSocket port (9001) is open
- Verify the environment variable is set correctly
- Check browser console for connection errors 