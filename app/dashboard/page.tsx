"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({
    revenue: 0,
    users: 0,
    performance: 0,
    growth: 0,
  })

  const [analytics, setAnalytics] = useState({
    pageViews: 0,
    bounceRate: 0,
    avgSession: 0,
    conversion: 0,
  })

  const [isRefreshing, setIsRefreshing] = useState(false)
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const refreshData = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setMetrics({
        revenue: Math.floor(Math.random() * 100000) + 50000,
        users: Math.floor(Math.random() * 5000) + 1000,
        performance: Math.floor(Math.random() * 30) + 70,
        growth: Math.floor(Math.random() * 50) + 10,
      })
      setAnalytics({
        pageViews: Math.floor(Math.random() * 50000) + 25000,
        bounceRate: Math.floor(Math.random() * 30) + 25, // 25-55%
        avgSession: Math.floor(Math.random() * 180) + 120, // 2-5 minutes in seconds
        conversion: Number((Math.random() * 5 + 2).toFixed(2)), // 2-7%
      })
      setIsRefreshing(false)
    }, 1000)
  }

  useEffect(() => {
    refreshData()
    const interval = setInterval(refreshData, 10000)
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

  const chartData = Array.from({ length: 12 }, (_, index) => {
    // Create more dramatic and varied data for better visual distinction
    const baseValue = 15 + (index * 8) + (Math.sin(index * 0.8) * 25) // More dramatic pattern
    const value = Math.max(8, Math.min(90, baseValue + (Math.random() * 30 - 15))) // Ensure 8-90% range with more variation
    const revenue = Math.floor(value * 600) + 8000 // Revenue based on bar height
    
    return {
      value,
      revenue,
      month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][index],
    }
  })
  const visibleChartData = isMobile ? chartData.slice(0, 6) : chartData

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
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
              Dynamic Dashboard
            </h1>
          </div>
          <Button
            onClick={refreshData}
            disabled={isRefreshing}
            className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30"
          >
            <RefreshCw aria-hidden className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh Data
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
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
                      ${metrics.revenue.toLocaleString()}
                    </motion.p>
                    <p className="text-green-400 text-sm flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      +12.5% from last month
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <DollarSign aria-hidden className="w-6 h-6 text-green-400" />
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
                      {metrics.users.toLocaleString()}
                    </motion.p>
                    <p className="text-blue-400 text-sm flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      +8.2% from last week
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Users aria-hidden className="w-6 h-6 text-blue-400" />
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
                      Excellent
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <Activity aria-hidden className="w-6 h-6 text-purple-400" />
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
                      Above target
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center">
                    <BarChart3 aria-hidden className="w-6 h-6 text-teal-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Analytics Overview Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-8"
        >
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                Analytics Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Page Views */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white/5 rounded-lg p-4 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <Eye className="w-5 h-5 text-blue-400" />
                    </div>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">+15.3%</Badge>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Page Views</p>
                    <motion.p
                      className="text-2xl font-bold text-white"
                      key={analytics.pageViews}
                      initial={{ scale: 1.1, color: "#3b82f6" }}
                      animate={{ scale: 1, color: "#ffffff" }}
                      transition={{ duration: 0.4 }}
                    >
                      {analytics.pageViews.toLocaleString()}
                    </motion.p>
                    <p className="text-xs text-gray-500 mt-1">This month</p>
                  </div>
                </motion.div>

                {/* Bounce Rate */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                  className="bg-white/5 rounded-lg p-4 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                      <MousePointer className="w-5 h-5 text-orange-400" />
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">-2.1%</Badge>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Bounce Rate</p>
                    <motion.p
                      className="text-2xl font-bold text-white"
                      key={analytics.bounceRate}
                      initial={{ scale: 1.1, color: "#f97316" }}
                      animate={{ scale: 1, color: "#ffffff" }}
                      transition={{ duration: 0.4 }}
                    >
                      {analytics.bounceRate}%
                    </motion.p>
                    <p className="text-xs text-gray-500 mt-1">Lower is better</p>
                  </div>
                </motion.div>

                {/* Average Session */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                  className="bg-white/5 rounded-lg p-4 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-purple-400" />
                    </div>
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">+8.7%</Badge>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Avg Session</p>
                    <motion.p
                      className="text-2xl font-bold text-white"
                      key={analytics.avgSession}
                      initial={{ scale: 1.1, color: "#8b5cf6" }}
                      animate={{ scale: 1, color: "#ffffff" }}
                      transition={{ duration: 0.4 }}
                    >
                      {formatTime(analytics.avgSession)}
                    </motion.p>
                    <p className="text-xs text-gray-500 mt-1">Duration</p>
                  </div>
                </motion.div>

                {/* Conversion Rate */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 }}
                  className="bg-white/5 rounded-lg p-4 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                      <Target className="w-5 h-5 text-green-400" />
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">+12.4%</Badge>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Conversion</p>
                    <motion.p
                      className="text-2xl font-bold text-white"
                      key={analytics.conversion}
                      initial={{ scale: 1.1, color: "#10b981" }}
                      animate={{ scale: 1, color: "#ffffff" }}
                      transition={{ duration: 0.4 }}
                    >
                      {analytics.conversion}%
                    </motion.p>
                    <p className="text-xs text-gray-500 mt-1">Success rate</p>
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  Revenue Chart
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-end gap-2 p-6 relative">
                  {visibleChartData.map((data, index) => (
                    <div key={index} className="flex-1 relative min-w-0 flex flex-col">
                      <div className="flex-1 flex items-end">
                        {reducedMotion ? (
                          <div
                            className="bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-sm min-h-[12px] w-full shadow-lg border border-blue-400/30"
                            style={{ height: `${Math.max(data.value, 12)}%` }}
                          />
                        ) : (
                          <motion.div
                          className="bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-sm cursor-pointer relative min-h-[12px] w-full shadow-lg border border-blue-400/30"
                          initial={{ height: 0 }}
                          animate={{ height: `${Math.max(data.value, 12)}%` }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          onMouseEnter={() => !isMobile && setHoveredBar(index)}
                          onMouseLeave={() => !isMobile && setHoveredBar(null)}
                          whileHover={isMobile ? {} : {
                            scale: 1.05,
                            filter: "brightness(1.2)",
                          }}
                          />
                        )}

                        {/* Mobile tap to show data */}
                        {isMobile && (
                          <div 
                            className="absolute inset-0 cursor-pointer"
                            onClick={() => setHoveredBar(hoveredBar === index ? null : index)}
                          />
                        )}

                        {/* Tooltip */}
                        {hoveredBar === index && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10"
                          >
                            <div className="bg-black/90 backdrop-blur-sm text-white text-xs rounded-lg px-3 py-2 border border-white/20 shadow-lg whitespace-nowrap">
                              <div className="font-semibold text-blue-400">{data.month}</div>
                              <div className="text-green-400">${data.revenue.toLocaleString()}</div>
                              <div className="w-2 h-2 bg-black/90 rotate-45 absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-r border-b border-white/20"></div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                      {/* Month labels */}
                      <div className="text-center text-xs text-gray-400 mt-2">
                        {data.month}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center text-gray-400 text-sm mt-2">
                  {isMobile ? "Tap bars to see detailed revenue data" : "Hover over bars to see detailed revenue data"}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-400" />
                  Live Activity
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 ml-auto">Live</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: "New user registered", time: "2 min ago", type: "user" },
                    { action: "Payment processed", time: "5 min ago", type: "payment" },
                    { action: "System backup completed", time: "10 min ago", type: "system" },
                    { action: "New feature deployed", time: "15 min ago", type: "deploy" },
                    { action: "Database optimized", time: "20 min ago", type: "system" },
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
                          activity.type === "user"
                            ? "bg-blue-400"
                            : activity.type === "payment"
                              ? "bg-green-400"
                              : activity.type === "system"
                                ? "bg-yellow-400"
                                : "bg-purple-400"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-white text-sm">{activity.action}</p>
                        <p className="text-gray-400 text-xs">{activity.time}</p>
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
                    title: "Real-time Updates",
                    desc: "Data refreshes automatically every 10 seconds",
                  },
                  {
                    icon: BarChart3,
                    title: "Interactive Charts",
                    desc: "Animated visualizations with smooth transitions",
                  },
                  { icon: Activity, title: "Live Activity Feed", desc: "Real-time monitoring of system events" },
                  { icon: TrendingUp, title: "Performance Metrics", desc: "Track KPIs and growth indicators" },
                  { icon: Users, title: "User Analytics", desc: "Monitor user engagement and behavior" },
                  { icon: Zap, title: "Fast Performance", desc: "Optimized for speed and responsiveness" },
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
