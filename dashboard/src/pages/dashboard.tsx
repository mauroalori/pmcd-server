"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Gauge } from "@/components/gauge"
import { LineChart } from "@/components/line-chart"
import { Droplets, Thermometer } from "lucide-react"

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

  // Función para generar datos aleatorios de sensores
  const generateRandomSensorData = () => {
    // Generar datos para sensores de presión
    const newPressureSensors = pressureSensors.map((sensor) => {
      // Simular fluctuaciones alrededor del valor actual
      let newValue = sensor.value
      if (newValue === 0) {
        // Valor inicial
        newValue = 50 + Math.random() * 30
      } else {
        // Fluctuación aleatoria
        newValue = Math.max(0, Math.min(100, newValue + (Math.random() - 0.5) * 5))
      }

      // Determinar estado basado en el valor
      let status: "normal" | "warning" | "critical" = "normal"
      if (newValue > 80) status = "critical"
      else if (newValue > 70) status = "warning"

      return {
        value: newValue,
        timestamp: new Date(),
        status,
      }
    })

    // Generar datos para sensor de humedad
    const newHumidityValue = Math.max(
      0,
      Math.min(
        100,
        humiditySensor.value === 0 ? 40 + Math.random() * 20 : humiditySensor.value + (Math.random() - 0.5) * 3,
      ),
    )
    const newHumidityStatus = newHumidityValue < 20 ? "critical" : newHumidityValue < 30 ? "warning" : "normal"

    // Generar datos para sensor de temperatura
    const newTempValue = Math.max(
      0,
      Math.min(
        50,
        temperatureSensor.value === 0 ? 20 + Math.random() * 10 : temperatureSensor.value + (Math.random() - 0.5) * 2,
      ),
    )
    const newTempStatus = newTempValue > 35 ? "critical" : newTempValue > 30 ? "warning" : "normal"

    // Actualizar estados
    setPressureSensors(newPressureSensors)
    setHumiditySensor({
      value: newHumidityValue,
      timestamp: new Date(),
      status: newHumidityStatus,
    })
    setTemperatureSensor({
      value: newTempValue,
      timestamp: new Date(),
      status: newTempStatus,
    })

    // Actualizar historiales para gráficos
    setPressureHistory(
      pressureHistory.map((history, index) => {
        const newValues = [...history.values, newPressureSensors[index].value]
        const newTimestamps = [...history.timestamps, new Date()]

        // Mantener solo los últimos 20 puntos de datos
        if (newValues.length > 20) {
          newValues.shift()
          newTimestamps.shift()
        }

        return {
          values: newValues,
          timestamps: newTimestamps,
        }
      }),
    )

    setHumidityHistory({
      values: [...humidityHistory.values, newHumidityValue].slice(-20),
      timestamps: [...humidityHistory.timestamps, new Date()].slice(-20),
    })

    setTemperatureHistory({
      values: [...temperatureHistory.values, newTempValue].slice(-20),
      timestamps: [...temperatureHistory.timestamps, new Date()].slice(-20),
    })
  }

  // Efecto para simular actualizaciones en tiempo real
  useEffect(() => {
    const interval = setInterval(generateRandomSensorData, 2000)
    return () => clearInterval(interval)
  }, [pressureSensors, humiditySensor, temperatureSensor, pressureHistory, humidityHistory, temperatureHistory])

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
