"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Gauge } from "@/components/gauge"
import { LineChart } from "@/components/line-chart"
import { Thermometer } from "lucide-react"
import mqtt from 'mqtt'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useConnection } from "@/contexts/connection-context"
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


export default function Dashboard() {
  // Estado para los datos de sensores en tiempo real
  const [pressureSensors, setPressureSensors] = useState<SensorData[]>([
    { value: 0, timestamp: new Date(), status: "normal" }
  ])
  // Estado para el historial de datos (para gráficos)
  const [pressureHistory, setPressureHistory] = useState<SensorHistory[]>([
    { values: [], timestamps: [] }
  ])
  // Estado para la temperatura
  const [temperature, setTemperature] = useState<number>(0)
  // Estado para los límites de presión
  const [pressureLimits, setPressureLimits] = useState({
    min: 0,
    max: 200000
  })
  // Estado de conexión desde el contexto
  const { isConnected, setIsConnected } = useConnection()

  // Función para determinar el estado basado en el valor
  const determineStatus = (value: number, type: 'pressure' | 'humidity' | 'temperature'): "normal" | "warning" | "critical" => {
    switch (type) {
      case 'pressure':
        const range = pressureLimits.max - pressureLimits.min
        const normalizedValue = (value - pressureLimits.min) / range
        return normalizedValue > 0.9 ? "critical" 
             : normalizedValue > 0.8 ? "warning" 
             : "normal"
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
    const brokerHost = import.meta.env.DEV ? 'pmcd.local' : window.location.hostname
    const brokerPort = 30091
    const brokerUrl = `ws://${brokerHost}:${brokerPort}`

    const client = mqtt.connect(brokerUrl)

    client.on('connect', () => {
      console.log('Conectado al broker MQTT')
      setIsConnected(true)
      // Suscribirse a los tópicos de temperatura y presión
      client.subscribe(['temp', 'pamb'], (err) => {
        if (err) {
          console.error('Error al suscribirse a los tópicos:', err)
        } else {
          console.log('Suscripción exitosa a tópicos temp y pamb')
        }
      })
    })

    client.on('close', () => {
      setIsConnected(false)
    })

    client.on('error', (error) => {
      setIsConnected(false)
      console.error('Error en la conexión MQTT:', error)
    })

    client.on('message', (topic, message) => {
      const data = message.toString()
      console.log(topic, data)
      if (topic === 'pamb') {
        const pressureValue = Number(data)
        const status = determineStatus(pressureValue, 'pressure')
        setPressureSensors(prev => {
          const newSensors = [...prev]
          newSensors[0] = {
            value: pressureValue,
            timestamp: new Date(),
            status,
          }
          return newSensors
        })

        setPressureHistory(prev => {
          const newHistory = [...prev]
          newHistory[0] = updateHistory(prev[0], pressureValue, new Date())
          return newHistory
        })
      } else if (topic === 'temp') {
        setTemperature(Number(data))
      }
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
      {/* Indicador de estado de conexión */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm font-medium">
              {isConnected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-4 md:grid-cols-1">
        {/* Sensor de presión */}
        {pressureSensors.map((sensor, index) => (
          <Card key={`pressure-${index}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Sensor de Presión</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <Gauge
                  value={sensor.value}
                  max={pressureLimits.max}
                  label="Pa"
                  size="medium"
                  showValue
                  color={getColorForStatus(sensor.status)}
                />
                <div className="mt-4 h-[120px] w-full">
                  <LineChart data={pressureHistory[index].values} color={getColorForStatus(sensor.status)} />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 w-full">
                  <div className="space-y-2">
                    <Label htmlFor="min-pressure">Presión Mínima (Pa)</Label>
                    <Input
                      id="min-pressure"
                      type="number"
                      value={pressureLimits.min}
                      onChange={(e) => setPressureLimits(prev => ({
                        ...prev,
                        min: Number(e.target.value)
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-pressure">Presión Máxima (Pa)</Label>
                    <Input
                      id="max-pressure"
                      type="number"
                      value={pressureLimits.max}
                      onChange={(e) => setPressureLimits(prev => ({
                        ...prev,
                        max: Number(e.target.value)
                      }))}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Card para temperatura */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Temperatura</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full">
                  <Thermometer className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Temperatura</p>
                  <h3 className="text-2xl font-bold">{temperature}°C</h3>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
