"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  RefreshCw,
  TrendingUp,
  Users,
  Zap,
  BarChart3,
  Activity,
  DollarSign,
  Eye,
  MousePointer,
  Clock,
  Target,
  Settings,
  Save,
  Upload,
  Download,
  Plus,
  Minus,
  Edit3,
  Trash2,
} from "lucide-react"
import Link from "next/link"

interface BusinessMetrics {
  revenue: number
  users: number
  performance: number
  growth: number
  profit: number
  expenses: number
  conversion: number
  churn: number
}

interface ChartData {
  value: number
  revenue: number
  month: string
  profit?: number
  expenses?: number
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<BusinessMetrics>({
    revenue: 0,
    users: 0,
    performance: 0,
    growth: 0,
    profit: 0,
    expenses: 0,
    conversion: 0,
    churn: 0,
  })

  const [isRefreshing, setIsRefreshing] = useState(false)
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [customData, setCustomData] = useState<BusinessMetrics>({
    revenue: 0,
    users: 0,
    performance: 0,
    growth: 0,
    profit: 0,
    expenses: 0,
    conversion: 0,
    churn: 0,
  })

  const generateRandomData = () => {
    const newMetrics: BusinessMetrics = {
      revenue: Math.floor(Math.random() * 500000) + 100000,
      users: Math.floor(Math.random() * 10000) + 2000,
      performance: Math.floor(Math.random() * 40) + 60,
      growth: Math.floor(Math.random() * 80) + 10,
      profit: Math.floor(Math.random() * 200000) + 50000,
      expenses: Math.floor(Math.random() * 300000) + 80000,
      conversion: Math.round((Math.random() * 8 + 2) * 100) / 100,
      churn: Math.round((Math.random() * 15 + 5) * 100) / 100,
    }
    setMetrics(newMetrics)
  }

  const refreshData = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      generateRandomData()
      setIsRefreshing(false)
    }, 1000)
  }

  const saveCustomData = () => {
    setMetrics(customData)
    setIsEditing(false)
  }

  const resetToRandom = () => {
    generateRandomData()
    setIsEditing(false)
  }

  const exportData = () => {
    const dataStr = JSON.stringify(metrics, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'business-metrics.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          setMetrics(data)
          setCustomData(data)
        } catch (error) {
          alert('Invalid file format. Please upload a valid JSON file.')
        }
      }
      reader.readAsText(file)
    }
  }

  useEffect(() => {
    generateRandomData()
    const interval = setInterval(generateRandomData, 30000) // Auto-refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const set = () => setReducedMotion(media.matches)
    set()
    media.addEventListener?.("change", set)

    const onResize = () => setIsMobile(window.innerWidth < 640)
    onResize()
    window.addEventListener("resize", onResize, { passive: true })
    return () => {
      media.removeEventListener?.("change", set)
      window.removeEventListener("resize", onResize)
    }
  }, [])

  const chartData: ChartData[] = Array.from({ length: 12 }, (_, index) => {
    const baseValue = 20 + (index * 5) + (Math.sin(index * 0.8) * 30)
    const value = Math.max(10, Math.min(95, baseValue + (Math.random() * 25 - 12)))
    const revenue = Math.floor(value * 800) + 10000
    const profit = Math.floor(revenue * (0.3 + Math.random() * 0.4))
    const expenses = revenue - profit
    
    return {
      value,
      revenue,
      profit,
      expenses,
      month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][index],
    }
  })
  const visibleChartData = isMobile ? chartData.slice(0, 6) : chartData

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Portfolio
              </Link>
            </Button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Business Statistics Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant="outline"
              size="sm"
              className="bg-white/5 border-white/20 hover:bg-white/10"
            >
              <Settings className="w-4 h-4 mr-2" />
              {isEditing ? "Cancel" : "Edit Data"}
            </Button>
            <Button
              onClick={refreshData}
              disabled={isRefreshing}
              className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Random Data
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Data Input Section */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-blue-400" />
                  Custom Data Input
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div>
                    <Label htmlFor="revenue" className="text-gray-300">Revenue</Label>
                    <Input
                      id="revenue"
                      type="number"
                      value={customData.revenue}
                      onChange={(e) => setCustomData({...customData, revenue: Number(e.target.value)})}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="users" className="text-gray-300">Users</Label>
                    <Input
                      id="users"
                      type="number"
                      value={customData.users}
                      onChange={(e) => setCustomData({...customData, users: Number(e.target.value)})}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="performance" className="text-gray-300">Performance %</Label>
                    <Input
                      id="performance"
                      type="number"
                      value={customData.performance}
                      onChange={(e) => setCustomData({...customData, performance: Number(e.target.value)})}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="growth" className="text-gray-300">Growth %</Label>
                    <Input
                      id="growth"
                      type="number"
                      value={customData.growth}
                      onChange={(e) => setCustomData({...customData, growth: Number(e.target.value)})}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="profit" className="text-gray-300">Profit</Label>
                    <Input
                      id="profit"
                      type="number"
                      value={customData.profit}
                      onChange={(e) => setCustomData({...customData, profit: Number(e.target.value)})}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="expenses" className="text-gray-300">Expenses</Label>
                    <Input
                      id="expenses"
                      type="number"
                      value={customData.expenses}
                      onChange={(e) => setCustomData({...customData, expenses: Number(e.target.value)})}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="conversion" className="text-gray-300">Conversion %</Label>
                    <Input
                      id="conversion"
                      type="number"
                      step="0.01"
                      value={customData.conversion}
                      onChange={(e) => setCustomData({...customData, conversion: Number(e.target.value)})}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="churn" className="text-gray-300">Churn %</Label>
                    <Input
                      id="churn"
                      type="number"
                      step="0.01"
                      value={customData.churn}
                      onChange={(e) => setCustomData({...customData, churn: Number(e.target.value)})}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveCustomData} className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/30">
                    <Save className="w-4 h-4 mr-2" />
                    Save Data
                  </Button>
                  <Button onClick={resetToRandom} variant="outline" className="bg-white/5 border-white/20 hover:bg-white/10">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset to Random
                  </Button>
                  <Button onClick={exportData} variant="outline" className="bg-white/5 border-white/20 hover:bg-white/10">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".json"
                      onChange={importData}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button variant="outline" className="bg-white/5 border-white/20 hover:bg-white/10">
                      <Upload className="w-4 h-4 mr-2" />
                      Import
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Revenue</p>
                    <motion.p
                      className="text-3xl font-bold text-white"
                      key={metrics.revenue}
                      initial={{ scale: 1.2, color: "#3b82f6" }}
                      animate={{ scale: 1, color: "#ffffff" }}
                      transition={{ duration: 0.5 }}
                    >
                      {formatCurrency(metrics.revenue)}
                    </motion.p>
                    <p className="text-green-400 text-sm flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      +{Math.floor(Math.random() * 20 + 5)}% from last month
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Active Users</p>
                    <motion.p
                      className="text-3xl font-bold text-white"
                      key={metrics.users}
                      initial={{ scale: 1.2, color: "#3b82f6" }}
                      animate={{ scale: 1, color: "#ffffff" }}
                      transition={{ duration: 0.5 }}
                    >
                      {formatNumber(metrics.users)}
                    </motion.p>
                    <p className="text-blue-400 text-sm flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      +{Math.floor(Math.random() * 15 + 3)}% from last week
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Performance</p>
                    <motion.p
                      className="text-3xl font-bold text-white"
                      key={metrics.performance}
                      initial={{ scale: 1.2, color: "#3b82f6" }}
                      animate={{ scale: 1, color: "#ffffff" }}
                      transition={{ duration: 0.5 }}
                    >
                      {metrics.performance}%
                    </motion.p>
                    <p className="text-purple-400 text-sm flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      {metrics.performance > 80 ? "Excellent" : metrics.performance > 60 ? "Good" : "Needs Improvement"}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <Activity className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Growth Rate</p>
                    <motion.p
                      className="text-3xl font-bold text-white"
                      key={metrics.growth}
                      initial={{ scale: 1.2, color: "#3b82f6" }}
                      animate={{ scale: 1, color: "#ffffff" }}
                      transition={{ duration: 0.5 }}
                    >
                      +{metrics.growth}%
                    </motion.p>
                    <p className="text-teal-400 text-sm flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {metrics.growth > 50 ? "Above target" : "On track"}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-teal-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Additional Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Profit</p>
                    <motion.p
                      className="text-2xl font-bold text-white"
                      key={metrics.profit}
                      initial={{ scale: 1.1, color: "#10b981" }}
                      animate={{ scale: 1, color: "#ffffff" }}
                      transition={{ duration: 0.5 }}
                    >
                      {formatCurrency(metrics.profit)}
                    </motion.p>
                    <p className="text-green-400 text-sm">
                      {Math.round((metrics.profit / metrics.revenue) * 100)}% margin
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Expenses</p>
                    <motion.p
                      className="text-2xl font-bold text-white"
                      key={metrics.expenses}
                      initial={{ scale: 1.1, color: "#f97316" }}
                      animate={{ scale: 1, color: "#ffffff" }}
                      transition={{ duration: 0.5 }}
                    >
                      {formatCurrency(metrics.expenses)}
                    </motion.p>
                    <p className="text-orange-400 text-sm">
                      {Math.round((metrics.expenses / metrics.revenue) * 100)}% of revenue
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <Minus className="w-5 h-5 text-orange-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Conversion</p>
                    <motion.p
                      className="text-2xl font-bold text-white"
                      key={metrics.conversion}
                      initial={{ scale: 1.1, color: "#8b5cf6" }}
                      animate={{ scale: 1, color: "#ffffff" }}
                      transition={{ duration: 0.5 }}
                    >
                      {metrics.conversion}%
                    </motion.p>
                    <p className="text-purple-400 text-sm">
                      {metrics.conversion > 5 ? "Excellent" : "Good"} rate
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <Target className="w-5 h-5 text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Churn Rate</p>
                    <motion.p
                      className="text-2xl font-bold text-white"
                      key={metrics.churn}
                      initial={{ scale: 1.1, color: "#ef4444" }}
                      animate={{ scale: 1, color: "#ffffff" }}
                      transition={{ duration: 0.5 }}
                    >
                      {metrics.churn}%
                    </motion.p>
                    <p className="text-red-400 text-sm">
                      {metrics.churn < 10 ? "Low" : "High"} churn
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-red-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  Revenue & Profit Chart
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 flex items-end gap-3 p-6 relative">
                  {visibleChartData.map((data, index) => (
                    <div key={index} className="flex-1 relative min-w-0 flex flex-col group">
                      <div className="flex-1 flex items-end gap-2 mb-2">
                        {/* Revenue Bar */}
                        <div className="flex-1 flex flex-col items-center relative">
                          <div 
                            className="w-full cursor-pointer relative"
                            onMouseEnter={() => setHoveredBar(index)}
                            onMouseLeave={() => setHoveredBar(null)}
                            onClick={() => setHoveredBar(hoveredBar === index ? null : index)}
                          >
                            {reducedMotion ? (
                              <div
                                className="bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-md min-h-[20px] w-full shadow-xl border-2 border-blue-400/50 transition-all duration-300 group-hover:shadow-2xl group-hover:border-blue-300"
                                style={{ height: `${Math.max(data.value, 20)}%` }}
                              />
                            ) : (
                              <motion.div
                                className="bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-md min-h-[20px] w-full shadow-xl border-2 border-blue-400/50 transition-all duration-300 group-hover:shadow-2xl group-hover:border-blue-300"
                                initial={{ height: 0 }}
                                animate={{ height: `${Math.max(data.value, 20)}%` }}
                                transition={{ delay: index * 0.1, duration: 0.8, ease: "easeOut" }}
                                whileHover={{
                                  scale: 1.05,
                                  filter: "brightness(1.3)",
                                  boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)"
                                }}
                              />
                            )}
                          </div>
                        </div>
                        
                        {/* Profit Bar */}
                        <div className="flex-1 flex flex-col items-center relative">
                          <div 
                            className="w-full cursor-pointer relative"
                            onMouseEnter={() => setHoveredBar(index)}
                            onMouseLeave={() => setHoveredBar(null)}
                            onClick={() => setHoveredBar(hoveredBar === index ? null : index)}
                          >
                            {reducedMotion ? (
                              <div
                                className="bg-gradient-to-t from-green-500 to-emerald-500 rounded-t-md min-h-[20px] w-full shadow-xl border-2 border-green-400/50 transition-all duration-300 group-hover:shadow-2xl group-hover:border-green-300"
                                style={{ height: `${Math.max((data.profit! / data.revenue) * data.value, 20)}%` }}
                              />
                            ) : (
                              <motion.div
                                className="bg-gradient-to-t from-green-500 to-emerald-500 rounded-t-md min-h-[20px] w-full shadow-xl border-2 border-green-400/50 transition-all duration-300 group-hover:shadow-2xl group-hover:border-green-300"
                                initial={{ height: 0 }}
                                animate={{ height: `${Math.max((data.profit! / data.revenue) * data.value, 20)}%` }}
                                transition={{ delay: index * 0.1 + 0.3, duration: 0.8, ease: "easeOut" }}
                                whileHover={{
                                  scale: 1.05,
                                  filter: "brightness(1.3)",
                                  boxShadow: "0 0 20px rgba(16, 185, 129, 0.5)"
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Tooltip */}
                      {hoveredBar === index && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.9 }}
                          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 z-20"
                        >
                          <div className="bg-black/95 backdrop-blur-md text-white text-sm rounded-xl px-4 py-3 border border-white/30 shadow-2xl whitespace-nowrap min-w-[200px]">
                            <div className="font-bold text-blue-400 text-base mb-2">{data.month}</div>
                            <div className="space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="text-blue-300">Revenue:</span>
                                <span className="text-blue-400 font-semibold">{formatCurrency(data.revenue)}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-green-300">Profit:</span>
                                <span className="text-green-400 font-semibold">{formatCurrency(data.profit!)}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-orange-300">Expenses:</span>
                                <span className="text-orange-400 font-semibold">{formatCurrency(data.expenses!)}</span>
                              </div>
                              <div className="flex justify-between items-center pt-1 border-t border-white/20">
                                <span className="text-gray-300">Margin:</span>
                                <span className="text-white font-bold">{Math.round((data.profit! / data.revenue) * 100)}%</span>
                              </div>
                            </div>
                            <div className="w-3 h-3 bg-black/95 rotate-45 absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-r border-b border-white/30"></div>
                          </div>
                        </motion.div>
                      )}

                      {/* Month labels */}
                      <div className="text-center text-xs text-gray-400 mt-2 font-medium">
                        {data.month}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gradient-to-t from-blue-500 to-purple-500 rounded"></div>
                    <span className="text-xs text-gray-400">Revenue</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gradient-to-t from-green-500 to-emerald-500 rounded"></div>
                    <span className="text-xs text-gray-400">Profit</span>
                  </div>
                </div>
                <div className="text-center text-gray-400 text-sm mt-2">
                  {isMobile ? "Tap bars to see detailed data" : "Hover over bars to see detailed data"}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-400" />
                  Business Activity
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 ml-auto">Live</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: "New customer acquired", time: "2 min ago", type: "customer", value: `+$${Math.floor(Math.random() * 5000 + 1000)}` },
                    { action: "Payment processed", time: "5 min ago", type: "payment", value: `+$${Math.floor(Math.random() * 2000 + 500)}` },
                    { action: "Marketing campaign launched", time: "10 min ago", type: "marketing", value: "Campaign A" },
                    { action: "System maintenance completed", time: "15 min ago", type: "system", value: "100% uptime" },
                    { action: "New feature deployed", time: "20 min ago", type: "deploy", value: "v2.1.0" },
                    { action: "Customer support ticket resolved", time: "25 min ago", type: "support", value: "Priority High" },
                  ].map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          activity.type === "customer"
                            ? "bg-green-400"
                            : activity.type === "payment"
                              ? "bg-blue-400"
                              : activity.type === "marketing"
                                ? "bg-purple-400"
                                : activity.type === "system"
                                  ? "bg-yellow-400"
                                  : activity.type === "deploy"
                                    ? "bg-cyan-400"
                                    : "bg-orange-400"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-white text-sm">{activity.action}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-gray-400 text-xs">{activity.time}</p>
                          <p className="text-gray-300 text-xs font-medium">{activity.value}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Dashboard Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    icon: RefreshCw,
                    title: "Random Data Generation",
                    desc: "Generate realistic business statistics automatically",
                  },
                  {
                    icon: Edit3,
                    title: "Custom Data Input",
                    desc: "Input your own business metrics and KPIs",
                  },
                  {
                    icon: BarChart3,
                    title: "Interactive Charts",
                    desc: "Visualize revenue, profit, and expenses with animated charts",
                  },
                  { 
                    icon: Download, 
                    title: "Export/Import", 
                    desc: "Save and load your data in JSON format" 
                  },
                  { 
                    icon: Activity, 
                    title: "Live Activity Feed", 
                    desc: "Real-time monitoring of business events" 
                  },
                  { 
                    icon: Settings, 
                    title: "Customizable", 
                    desc: "Edit and customize all metrics to fit your business" 
                  },
                ].map((feature, index) => (
                  <div key={index} className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <feature.icon className="w-8 h-8 text-blue-400 mb-3" />
                    <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}