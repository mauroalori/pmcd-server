"use client"

import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

type GaugeProps = {
  value: number
  max: number
  label?: string
  size?: "small" | "medium" | "large"
  showValue?: boolean
  status?: "normal" | "warning" | "critical"
}

export function Gauge({ value, max, label, size = "medium", showValue = false, status = "normal" }: GaugeProps) {
  const [displayValue, setDisplayValue] = useState(0)

  // Animación del valor
  useEffect(() => {
    const animationDuration = 500 // ms
    const steps = 20
    const stepDuration = animationDuration / steps
    const valueIncrement = (value - displayValue) / steps

    let currentStep = 0
    const interval = setInterval(() => {
      currentStep++
      if (currentStep >= steps) {
        setDisplayValue(value)
        clearInterval(interval)
      } else {
        setDisplayValue((prev) => prev + valueIncrement)
      }
    }, stepDuration)

    return () => clearInterval(interval)
  }, [value])

  // Calcular el porcentaje y el ángulo para el gauge
  const percentage = (displayValue / max) * 100
  const angle = (percentage * 270) / 100 - 135 // -135 a 135 grados

  // Determinar el tamaño basado en la prop size
  const sizeClasses = {
    small: "w-24 h-24",
    medium: "w-32 h-32",
    large: "w-40 h-40",
  }

  // Determinar el color basado en el estado
  const statusColors = {
    normal: {
      text: "text-green-500",
      stroke: "stroke-green-500",
    },
    warning: {
      text: "text-yellow-500",
      stroke: "stroke-yellow-500",
    },
    critical: {
      text: "text-red-500",
      stroke: "stroke-red-500",
    },
  }

  return (
    <div className="flex flex-col items-center">
      <div className={cn("relative flex items-center justify-center", sizeClasses[size])}>
        {/* Fondo del gauge */}
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted/20"
            strokeDasharray="270"
            strokeDashoffset="0"
            strokeLinecap="round"
            transform="rotate(-135 50 50)"
          />
          {/* Indicador del gauge */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            strokeWidth="8"
            className={statusColors[status].stroke}
            strokeDasharray="270"
            strokeDashoffset={270 - (percentage * 270) / 100}
            strokeLinecap="round"
            transform="rotate(-135 50 50)"
          />
        </svg>

        {/* Aguja indicadora */}
        <div
          className="absolute w-1 bg-foreground rounded-full origin-bottom"
          style={{
            height: size === "small" ? "30%" : size === "medium" ? "35%" : "40%",
            transform: `rotate(${angle}deg)`,
            transformOrigin: "bottom center",
            bottom: "50%",
            left: "calc(50% - 1px)",
          }}
        />

        {/* Punto central */}
        <div className="absolute w-3 h-3 bg-foreground rounded-full" />
      </div>

      {/* Valor y etiqueta - ahora fuera del gauge */}
      {showValue && (
        <div className="mt-2 text-center">
          <span
            className={cn(
              "font-bold",
              size === "small" ? "text-sm" : size === "medium" ? "text-xl" : "text-2xl",
              statusColors[status].text,
            )}
          >
            {displayValue.toFixed(1)}
            {label && <span className="ml-1 text-xs">{label}</span>}
          </span>
        </div>
      )}
    </div>
  )
}
