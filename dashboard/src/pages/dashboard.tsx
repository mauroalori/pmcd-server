"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Gauge } from "@/components/gauge"
import { LineChart } from "@/components/line-chart"
import { Droplets, Thermometer } from "lucide-react"
import mqtt from 'mqtt'

// Tipos para los datos de sensores
type SensorData = {
  value: number
  timestamp: Date
  status: "normal" | "warning" | "critical"
}

type SensorHistory = {
  values: number[]
  timestamps: Date[]
}

// Tipo para los mensajes MQTT
type MQTTSensorMessage = {
  value: number
  timestamp: string
}

export default function Dashboard() {
  // Estado para los datos de sensores en tiempo real
  const [pressureSensors, setPressureSensors] = useState<SensorData[]>([
    { value: 0, timestamp: new Date(), status: "normal" },
    { value: 0, timestamp: new Date(), status: "normal" },
    { value: 0, timestamp: new Date(), status: "normal" },
  ])
  const [humiditySensor, setHumiditySensor] = useState<SensorData>({
    value: 0,
    timestamp: new Date(),
    status: "normal",
  })
  const [temperatureSensor, setTemperatureSensor] = useState<SensorData>({
    value: 0,
    timestamp: new Date(),
    status: "normal",
  })

  // Estado para el historial de datos (para gráficos)
  const [pressureHistory, setPressureHistory] = useState<SensorHistory[]>([
    { values: [], timestamps: [] },
    { values: [], timestamps: [] },
    { values: [], timestamps: [] },
  ])
  const [humidityHistory, setHumidityHistory] = useState<SensorHistory>({
    values: [],
    timestamps: [],
  })
  const [temperatureHistory, setTemperatureHistory] = useState<SensorHistory>({
    values: [],
    timestamps: [],
  })

  // Función para determinar el estado basado en el valor
  const determineStatus = (value: number, type: 'pressure' | 'humidity' | 'temperature'): "normal" | "warning" | "critical" => {
    switch (type) {
      case 'pressure':
        return value > 80 ? "critical" : value > 70 ? "warning" : "normal"
      case 'humidity':
        return value < 20 ? "critical" : value < 30 ? "warning" : "normal"
      case 'temperature':
        return value > 35 ? "critical" : value > 30 ? "warning" : "normal"
      default:
        return "normal"
    }
  }

  // Función para actualizar el historial de datos
  const updateHistory = (
    currentHistory: SensorHistory,
    newValue: number,
    newTimestamp: Date
  ): SensorHistory => {
    const newValues = [...currentHistory.values, newValue]
    const newTimestamps = [...currentHistory.timestamps, newTimestamp]

    // Mantener solo los últimos 20 puntos de datos
    if (newValues.length > 20) {
      newValues.shift()
      newTimestamps.shift()
    }

    return {
      values: newValues,
      timestamps: newTimestamps,
    }
  }

  useEffect(() => {
    // Conectar al broker MQTT
    const client = mqtt.connect('ws://localhost:9001') // Ajusta la URL según tu configuración

    client.on('connect', () => {
      console.log('Conectado al broker MQTT')
      // Suscribirse a los tópicos de los sensores
      client.subscribe('sensor/pressure', (err) => {
        if (err) {
          console.error('Error al suscribirse al tópico:', err)
        } else {
          console.log('Suscripción exitosa al tópico sensor/pressure')
        }
      })
    })

    client.on('message', (topic, message) => {
      
        const data: MQTTSensorMessage = JSON.parse(message.toString())
        const timestamp = new Date(data.timestamp)

        if (topic.startsWith('sensor/pressure')) {
          const status = determineStatus(data.value, 'pressure')
            setPressureSensors(prev => {
              const newSensors = [...prev]
              newSensors[0] = {
                value: data.value,
                timestamp,
                status,
              }
              return newSensors
            })

            setPressureHistory(prev => {
              const newHistory = [...prev]
              newHistory[0] = updateHistory(prev[0], data.value, timestamp)
              return newHistory
            })
        }
      })        

    client.on('error', (error) => {
      console.error('Error en la conexión MQTT:', error)
    })

    // Limpiar la conexión al desmontar el componente
    return () => {
      client.end()
    }
  }, [])

  // Determinar colores basados en el estado
  const getColorForStatus = (status: string) => {
    return status === "critical" ? "#ef4444" : status === "warning" ? "#f59e0b" : "#22c55e"
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Sensores de presión */}
        {pressureSensors.map((sensor, index) => (
          <Card key={`pressure-${index}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Sensor de Presión {index + 1}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <Gauge
                  value={sensor.value}
                  max={100}
                  label="PSI"
                  size="medium"
                  showValue
                  color={getColorForStatus(sensor.status)}
                />
                <div className="mt-4 h-[120px] w-full">
                  <LineChart data={pressureHistory[index].values} color={getColorForStatus(sensor.status)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Card combinada para temperatura y humedad */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Temperatura y Humedad</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Temperatura */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full">
                    <Thermometer className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Temperatura</p>
                    <h3 className="text-2xl font-bold">{temperatureSensor.value.toFixed(1)}°C</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Humedad */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                    <Droplets className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Humedad</p>
                    <h3 className="text-2xl font-bold">{humiditySensor.value.toFixed(1)}%</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
