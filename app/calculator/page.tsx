"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RotateCcw, Delete, History, Sun, Moon } from "lucide-react"
import Link from "next/link"

export default function CalculatorPage() {
  const [display, setDisplay] = useState("0")
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [history, setHistory] = useState<Array<{ expression: string; result: string; time: string }>>([])
  const [isScientific, setIsScientific] = useState(false)
  const [isDark, setIsDark] = useState(true)

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === "0" ? num : display + num)
    }
  }

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.")
      setWaitingForOperand(false)
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".")
    }
  }

  const clear = () => {
    setDisplay("0")
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  const performOperation = (nextOperation: string) => {
    const inputValue = Number.parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)

      setDisplay(String(newValue))
      setPreviousValue(newValue)
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const calculate = (firstOperand: number, secondOperand: number, operation: string): number => {
    switch (operation) {
      case "+":
        return firstOperand + secondOperand
      case "-":
        return firstOperand - secondOperand
      case "*":
        return firstOperand * secondOperand
      case "/":
        return secondOperand !== 0 ? firstOperand / secondOperand : 0
      case "=":
        return secondOperand
      default:
        return secondOperand
    }
  }

  const performCalculation = () => {
    const inputValue = Number.parseFloat(display)

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation)
      const expression = `${previousValue} ${operation} ${inputValue}`

      addToHistory(expression, String(newValue))

      setDisplay(String(newValue))
      setPreviousValue(null)
      setOperation(null)
      setWaitingForOperand(true)
    }
  }

  const addToHistory = (expression: string, result: string) => {
    const newEntry = {
      expression,
      result,
      time: new Date().toLocaleTimeString(),
    }
    setHistory((prev) => [newEntry, ...prev.slice(0, 9)]) // Keep last 10 entries
  }

  const scientificOperation = (func: string) => {
    const inputValue = Number.parseFloat(display)
    let result: number

    switch (func) {
      case "sin":
        result = Math.sin((inputValue * Math.PI) / 180)
        break
      case "cos":
        result = Math.cos((inputValue * Math.PI) / 180)
        break
      case "tan":
        result = Math.tan((inputValue * Math.PI) / 180)
        break
      case "log":
        result = Math.log10(inputValue)
        break
      case "ln":
        result = Math.log(inputValue)
        break
      case "sqrt":
        result = Math.sqrt(inputValue)
        break
      case "square":
        result = inputValue * inputValue
        break
      case "pi":
        result = Math.PI
        break
      case "e":
        result = Math.E
        break
      default:
        result = inputValue
    }

    const expression = `${func}(${inputValue})`
    addToHistory(expression, String(result))
    setDisplay(String(result))
    setWaitingForOperand(true)
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white"
          : "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <div
        className={`border-b backdrop-blur-md ${
          isDark ? "border-white/10 bg-black/20" : "border-gray-200 bg-white/20"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Portfolio
              </Link>
            </Button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Advanced Calculator
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDark(!isDark)}
              className={isDark ? "border-white/20 hover:bg-white/10" : "border-gray-300 hover:bg-gray-100"}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calculator */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card
                className={`backdrop-blur-sm ${isDark ? "bg-white/5 border-white/10" : "bg-white/80 border-gray-200"}`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className={isDark ? "text-white" : "text-gray-900"}>Calculator</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant={isScientific ? "default" : "outline"}
                        size="sm"
                        onClick={() => setIsScientific(false)}
                        className={!isScientific ? "bg-blue-500 hover:bg-blue-600" : ""}
                      >
                        Basic
                      </Button>
                      <Button
                        variant={isScientific ? "default" : "outline"}
                        size="sm"
                        onClick={() => setIsScientific(true)}
                        className={isScientific ? "bg-blue-500 hover:bg-blue-600" : ""}
                      >
                        Scientific
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Display */}
                  <div className={`p-6 rounded-lg text-right ${isDark ? "bg-black/30" : "bg-gray-100"}`}>
                    <div className={`text-4xl font-mono ${isDark ? "text-white" : "text-gray-900"}`}>{display}</div>
                    {operation && previousValue !== null && (
                      <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        {previousValue} {operation}
                      </div>
                    )}
                  </div>

                  {/* Scientific Functions */}
                  {isScientific && (
                    <div className="grid grid-cols-5 gap-2 mb-4">
                      {["sin", "cos", "tan", "log", "ln"].map((func) => (
                        <Button
                          key={func}
                          variant="outline"
                          onClick={() => scientificOperation(func)}
                          className={`h-12 ${
                            isDark
                              ? "bg-purple-500/20 border-purple-500/30 hover:bg-purple-500/30"
                              : "bg-purple-100 border-purple-300 hover:bg-purple-200"
                          }`}
                        >
                          {func}
                        </Button>
                      ))}
                      {["sqrt", "square", "pi", "e", ""].map((func, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          onClick={() => func && scientificOperation(func)}
                          disabled={!func}
                          className={`h-12 ${
                            isDark
                              ? "bg-purple-500/20 border-purple-500/30 hover:bg-purple-500/30"
                              : "bg-purple-100 border-purple-300 hover:bg-purple-200"
                          }`}
                        >
                          {func === "sqrt" ? "√" : func === "square" ? "x²" : func}
                        </Button>
                      ))}
                    </div>
                  )}

                  {/* Main Buttons */}
                  <div className="grid grid-cols-4 gap-3">
                    <Button
                      variant="outline"
                      onClick={clear}
                      className={`h-14 col-span-2 ${
                        isDark
                          ? "bg-red-500/20 border-red-500/30 hover:bg-red-500/30"
                          : "bg-red-100 border-red-300 hover:bg-red-200"
                      }`}
                    >
                      <RotateCcw className="w-5 h-5 mr-2" />
                      Clear
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setDisplay(display.slice(0, -1) || "0")}
                      className={`h-14 ${
                        isDark
                          ? "bg-yellow-500/20 border-yellow-500/30 hover:bg-yellow-500/30"
                          : "bg-yellow-100 border-yellow-300 hover:bg-yellow-200"
                      }`}
                    >
                      <Delete className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => performOperation("/")}
                      className={`h-14 ${
                        isDark
                          ? "bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/30"
                          : "bg-blue-100 border-blue-300 hover:bg-blue-200"
                      }`}
                    >
                      ÷
                    </Button>

                    {/* Number rows */}
                    {[
                      ["7", "8", "9", "*"],
                      ["4", "5", "6", "-"],
                      ["1", "2", "3", "+"],
                    ].map((row, rowIndex) =>
                      row.map((btn, btnIndex) => (
                        <Button
                          key={`${rowIndex}-${btnIndex}`}
                          variant="outline"
                          onClick={() => {
                            if (["+", "-", "*", "/"].includes(btn)) {
                              performOperation(btn)
                            } else {
                              inputNumber(btn)
                            }
                          }}
                          className={`h-14 ${
                            ["+", "-", "*", "/"].includes(btn)
                              ? isDark
                                ? "bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/30"
                                : "bg-blue-100 border-blue-300 hover:bg-blue-200"
                              : isDark
                                ? "bg-white/10 border-white/20 hover:bg-white/20"
                                : "bg-white border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {btn === "*" ? "×" : btn}
                        </Button>
                      )),
                    )}

                    <Button
                      variant="outline"
                      onClick={() => inputNumber("0")}
                      className={`h-14 col-span-2 ${
                        isDark
                          ? "bg-white/10 border-white/20 hover:bg-white/20"
                          : "bg-white border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      0
                    </Button>
                    <Button
                      variant="outline"
                      onClick={inputDecimal}
                      className={`h-14 ${
                        isDark
                          ? "bg-white/10 border-white/20 hover:bg-white/20"
                          : "bg-white border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      .
                    </Button>
                    <Button
                      onClick={performCalculation}
                      className="h-14 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    >
                      =
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* History Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card
              className={`backdrop-blur-sm ${isDark ? "bg-white/5 border-white/10" : "bg-white/80 border-gray-200"}`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className={`flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                    <History className="w-5 h-5" />
                    History
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setHistory([])}
                    className={isDark ? "border-white/20 hover:bg-white/10" : "border-gray-300 hover:bg-gray-100"}
                  >
                    Clear
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {history.length === 0 ? (
                    <p className={`text-center ${isDark ? "text-gray-400" : "text-gray-600"} italic`}>
                      No calculations yet
                    </p>
                  ) : (
                    history.map((entry, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          isDark ? "bg-white/5 hover:bg-white/10" : "bg-gray-50 hover:bg-gray-100"
                        }`}
                        onClick={() => setDisplay(entry.result)}
                      >
                        <div className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                          {entry.expression}
                        </div>
                        <div className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                          = {entry.result}
                        </div>
                        <div className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>{entry.time}</div>
                      </motion.div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card
              className={`mt-6 backdrop-blur-sm ${
                isDark ? "bg-white/5 border-white/10" : "bg-white/80 border-gray-200"
              }`}
            >
              <CardHeader>
                <CardTitle className={isDark ? "text-white" : "text-gray-900"}>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { icon: "🧮", title: "Basic & Scientific", desc: "Switch between calculation modes" },
                    { icon: "📊", title: "History Tracking", desc: "Keep track of all calculations" },
                    { icon: "🎨", title: "Theme Toggle", desc: "Dark and light mode support" },
                    { icon: "⌨️", title: "Keyboard Support", desc: "Use keyboard for input" },
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="text-2xl">{feature.icon}</span>
                      <div>
                        <h4 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{feature.title}</h4>
                        <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
