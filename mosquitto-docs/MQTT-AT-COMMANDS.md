# MQTT AT Commands Guide

This guide explains the MQTT AT commands used for configuring and controlling MQTT communication with an ESP8266 device.

## WiFi Connection

### 1. WiFi Mode Configuration
```
AT+CWMODE=1
```
- Sets the ESP8266 to Station mode
- Parameter:
  - `1`: Station mode

### 2. Connect to WiFi Network
```
AT+CWJAP="PMCD","pmcd2025"
```
- Connects to the WiFi network
- Parameters:
  - `"PMCD"`: SSID of the network
  - `"pmcd2025"`: Password of the network

Note: These are the default credentials for the Raspberry Pi access point. If the AP was configured differently, use the appropriate SSID and password.

## Command Overview

### 1. MQTT User Configuration
```
AT+MQTTUSERCFG=0,1,"ESP-01","","",0,0,""
```
- Configures the MQTT client settings
- Parameters:
  - `0`: Client ID (0)
  - `1`: Enable MQTT
  - `"ESP-01"`: Client name
  - `""`: Username (empty)
  - `""`: Password (empty)
  - `0`: SSL/TLS disabled
  - `0`: Certificate index
  - `""`: CA certificate (empty)

### 2. MQTT Connection
```
AT+MQTTCONN=0,"10.10.10.1",30883,1
```
- Establishes connection to MQTT broker
- Parameters:
  - `0`: Client ID
  - `"10.10.10.1"`: Broker IP address (Raspberry Pi)
  - `30883`: Broker port
  - `1`: Keep alive time in seconds

### 3. MQTT Subscribe
```
AT+MQTTSUB=0,"pmcd/pressure/1",1
```
- Subscribes to an MQTT topic
- Parameters:
  - `0`: Client ID
  - `"pmcd/pressure/1"`: Topic to subscribe to
  - `1`: QoS (Quality of Service) level

### 4. MQTT Publish
```
AT+MQTTPUB=0,"pmcd/pressure/1","{\"value\": 123456, \"time\": \"2024-03-21T12:34:56Z\"}",1,0
```
- Publishes a message to an MQTT topic
- Parameters:
  - `0`: Client ID
  - `"pmcd/pressure/1"`: Topic to publish to
  - `"{\"value\": 123456, \"time\": \"2024-03-21T12:34:56Z\"}"`: Message content (JSON format)
  - `1`: QoS level
  - `0`: Retain flag (0 = don't retain)

## Usage Notes

1. These commands should be sent sequentially in the order shown above
2. Make sure the ESP8266 is properly connected to the network before sending these commands
3. The broker IP address (10.10.10.1) should be replaced with your actual MQTT broker address
4. The topic "pmcd/pressure/1" can be modified according to your needs. Other available topics include:
   - `pmcd/pressure/1`: Pressure sensor data
   - `pmcd/temp`: Temperature sensor data
5. QoS levels (0,1,2) determine the message delivery guarantee:
   - 0: At most once
   - 1: At least once
   - 2: Exactly once
6. All messages should follow the JSON format:
   ```json
   {
     "value": number,  // numeric sensor value
     "time": string    // ISO timestamp
   }
   ```

## Example Flow

1. First configure the MQTT client
2. Connect to the MQTT broker
3. Subscribe to receive messages
4. Publish messages as needed 