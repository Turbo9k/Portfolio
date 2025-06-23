"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Play, Pause, RotateCcw, Settings, Gamepad2 } from "lucide-react"
import Link from "next/link"

export default function ParallaxPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [windowDimensions, setWindowDimensions] = useState({ width: 1200, height: 800 })
  const [gameActive, setGameActive] = useState(false)
  const [score, setScore] = useState(0)
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; vx: number; vy: number; color: string; size: number }>
  >([])
  const [gameParticles, setGameParticles] = useState<
    Array<{
      id: number
      x: number
      y: number
      caught: boolean
      isGlowing: boolean
      points: number
      lastCatchTime?: number
    }>
  >([])
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 })
  const [mouseSpeed, setMouseSpeed] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  // Interactive controls that actually work
  const [particleSpeed, setParticleSpeed] = useState(5)
  const [mouseSensitivity, setMouseSensitivity] = useState(50)
  const [parallaxIntensity, setParallaxIntensity] = useState(30)
  const [particleColor, setParticleColor] = useState("blue")
  const [particleSize, setParticleSize] = useState(2)
  const [particleCount, setParticleCount] = useState(20)

  const colorOptions = {
    blue: "#3b82f6",
    purple: "#8b5cf6",
    green: "#10b981",
    red: "#ef4444",
    yellow: "#f59e0b",
    pink: "#ec4899",
    teal: "#14b8a6",
    orange: "#f97316",
  }

  // Set client-side flag and window dimensions
  useEffect(() => {
    setIsClient(true)
    if (typeof window !== 'undefined') {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
  }, [])

  // Update window dimensions on resize
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", updateMousePosition)
    return () => window.removeEventListener("mousemove", updateMousePosition)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Create floating particles with dynamic properties
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * windowDimensions.width,
      y: Math.random() * windowDimensions.height,
      vx: (Math.random() - 0.5) * (particleSpeed / 2),
      vy: (Math.random() - 0.5) * (particleSpeed / 2),
      color: colorOptions[particleColor as keyof typeof colorOptions],
      size: particleSize,
    }))
    setParticles(newParticles)
  }, [particleCount, particleSpeed, particleColor, particleSize, windowDimensions])

  // Game particle management
  useEffect(() => {
    if (gameActive) {
      const interval = setInterval(() => {
        setGameParticles((prev) => {
          const newParticles = [...prev.filter((p) => !p.caught)]
          if (newParticles.length < 4) {
            const isGlowing = Math.random() < 0.3 // 30% chance for glowing particle
            newParticles.push({
              id: Date.now() + Math.random(),
              x: Math.random() * 220, // Adjusted for game area width
              y: -10,
              caught: false,
              isGlowing,
              points: isGlowing ? 25 : 10, // Glowing particles worth more
            })
          }
          return newParticles
            .map((p) => ({
              ...p,
              y: p.y + (2 * particleSpeed) / 5,
            }))
            .filter((p) => p.y < 120) // Adjusted for game area height
        })
      }, 150)
      return () => clearInterval(interval)
    }
  }, [gameActive, particleSpeed])

  const startGame = () => {
    setGameActive(true)
    setScore(0)
    setGameParticles([])
    setLastMousePosition({ x: 0, y: 0 })
    setMouseSpeed(0)
  }

  const stopGame = () => {
    setGameActive(false)
    setGameParticles([])
    setLastMousePosition({ x: 0, y: 0 })
    setMouseSpeed(0)
  }

  const checkCollision = (playerX: number, playerY: number, particleX: number, particleY: number) => {
    const distance = Math.sqrt(Math.pow(playerX - particleX, 2) + Math.pow(playerY - particleY, 2))
    return distance < 15
  }

  // Add this state for better mouse tracking
  const [gameMousePosition, setGameMousePosition] = useState({ x: 0, y: 0 })

  // Don't render anything until client-side
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading Parallax Experience...</h1>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background with Dynamic Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              width: `${particle.size * 2}px`,
              height: `${particle.size * 2}px`,
              backgroundColor: particle.color,
              opacity: 0.6,
            }}
            animate={{
              x: [particle.x, particle.x + particle.vx * 100 * (particleSpeed / 5)],
              y: [particle.y, particle.y + particle.vy * 100 * (particleSpeed / 5)],
            }}
            transition={{
              duration: 10 / (particleSpeed / 5),
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "linear",
            }}
          />
        ))}

        {/* Mouse follower effect with dynamic sensitivity */}
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x - 192,
            y: mousePosition.y - 192,
          }}
          transition={{
            type: "spring",
            stiffness: 50 + mouseSensitivity,
            damping: 30 + mouseSensitivity / 2,
          }}
        />
      </div>

      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Portfolio
              </Link>
            </Button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Parallax Experience
            </h1>
          </div>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Interactive Demo</Badge>
        </div>
      </div>

      {/* Hero Section with Dynamic Parallax */}
      <section className="min-h-screen flex items-center justify-center relative" ref={containerRef}>
        <motion.div
          className="text-center z-10"
          style={{
            y: useTransform(scrollYProgress, [0, 1], ["0%", `${parallaxIntensity}%`]),
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            className="text-6xl lg:text-8xl font-bold mb-6"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 5 / (particleSpeed / 5), repeat: Number.POSITIVE_INFINITY }}
            style={{
              backgroundImage: `linear-gradient(45deg, ${colorOptions[particleColor as keyof typeof colorOptions]}, #8b5cf6, #06b6d4, ${colorOptions[particleColor as keyof typeof colorOptions]})`,
              backgroundSize: "300% 300%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Parallax
          </motion.h1>
          <motion.p
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Experience immersive scrolling with mouse tracking, floating particles, and interactive elements that
            respond to your every move.
          </motion.p>
        </motion.div>

        {/* Dynamic Floating Elements */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full backdrop-blur-sm border border-white/10"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 20}%`,
              width: `${20 + particleSize * 10}px`,
              height: `${20 + particleSize * 10}px`,
              background: `linear-gradient(45deg, ${colorOptions[particleColor as keyof typeof colorOptions]}20, #8b5cf620)`,
            }}
            animate={{
              y: [0, -20 * (particleSpeed / 5), 0],
              x: [
                (mousePosition.x - windowDimensions.width / 2) / (100 - mouseSensitivity),
                (mousePosition.x - windowDimensions.width / 2) / (120 - mouseSensitivity),
              ],
              rotate: [0, 180 * (particleSpeed / 5), 360 * (particleSpeed / 5)],
            }}
            transition={{
              duration: 3 + i - particleSpeed / 5,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.5,
            }}
          />
        ))}
      </section>

      {/* Enhanced Interactive Controls Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Interactive Controls
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Customize the parallax effects and particle behavior in real-time
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-400" />
                  Effect Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Particle Speed: {particleSpeed}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={particleSpeed}
                    onChange={(e) => setParticleSpeed(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Mouse Sensitivity: {mouseSensitivity}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={mouseSensitivity}
                    onChange={(e) => setMouseSensitivity(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Parallax Intensity: {parallaxIntensity}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={parallaxIntensity}
                    onChange={(e) => setParallaxIntensity(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Particle Size: {particleSize}</label>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    value={particleSize}
                    onChange={(e) => setParticleSize(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Particle Count: {particleCount}
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={particleCount}
                    onChange={(e) => setParticleCount(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Particle Color</label>
                  <div className="grid grid-cols-4 gap-2">
                    {Object.entries(colorOptions).map(([name, color]) => (
                      <button
                        key={name}
                        onClick={() => setParticleColor(name)}
                        className={`w-full h-8 rounded-lg border-2 transition-all ${
                          particleColor === name ? "border-white" : "border-transparent"
                        }`}
                        style={{ backgroundColor: color }}
                        title={name}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {[
                    { name: "Default", speed: 5, sensitivity: 50, intensity: 30, size: 2, count: 20, color: "blue" },
                    { name: "Neon", speed: 8, sensitivity: 80, intensity: 60, size: 3, count: 30, color: "pink" },
                    { name: "Cosmic", speed: 3, sensitivity: 30, intensity: 20, size: 4, count: 15, color: "purple" },
                    { name: "Fire", speed: 10, sensitivity: 90, intensity: 80, size: 2, count: 40, color: "red" },
                    { name: "Ocean", speed: 2, sensitivity: 20, intensity: 15, size: 3, count: 25, color: "teal" },
                  ].map((preset) => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setParticleSpeed(preset.speed)
                        setMouseSensitivity(preset.sensitivity)
                        setParallaxIntensity(preset.intensity)
                        setParticleSize(preset.size)
                        setParticleCount(preset.count)
                        setParticleColor(preset.color)
                      }}
                      className="bg-white/10 border-white/20 hover:bg-white/20"
                    >
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5 text-green-400" />
                  Particle Catcher Game
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">Score: {score}</div>
                  <div className="text-gray-400 mb-4">
                    {gameActive ? (
                      <div className="space-y-1">
                        <div>Move mouse to catch particles!</div>
                        <div className="text-xs">
                          <span className="text-blue-400">Normal: 10pts</span> •
                          <span className="text-yellow-400 ml-1">Glowing: 25pts</span>
                        </div>
                        <div className="text-xs text-red-400">Don't move too fast or you'll miss them!</div>
                      </div>
                    ) : (
                      "Click Start to begin"
                    )}
                  </div>
                </div>

                <div
                  ref={gameAreaRef}
                  className="h-32 bg-black/30 rounded-lg relative overflow-hidden border border-white/20"
                  onMouseMove={(e) => {
                    if (gameActive && gameAreaRef.current) {
                      const rect = gameAreaRef.current.getBoundingClientRect()
                      const relativeX = e.clientX - rect.left
                      const relativeY = e.clientY - rect.top

                      // Update game mouse position immediately
                      setGameMousePosition({ x: relativeX, y: relativeY })

                      // Calculate mouse speed to prevent rapid swiping
                      const deltaX = relativeX - lastMousePosition.x
                      const deltaY = relativeY - lastMousePosition.y
                      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
                      const speed = distance / 16.67 // pixels per frame (60fps)

                      setLastMousePosition({ x: relativeX, y: relativeY })
                      setMouseSpeed(speed)

                      // Lowered speed threshold from 15 to 8 for more restrictive catching
                      if (speed < 8) {
                        setGameParticles((prev) =>
                          prev.map((particle) => {
                            if (!particle.caught && checkCollision(relativeX, relativeY, particle.x, particle.y)) {
                              // Prevent catching multiple particles too quickly
                              const now = Date.now()
                              if (!particle.lastCatchTime || now - particle.lastCatchTime > 50) {
                                setScore((s) => s + particle.points)
                                return { ...particle, caught: true, lastCatchTime: now }
                              }
                            }
                            return particle
                          }),
                        )
                      }
                    }
                  }}
                >
                  {gameActive && (
                    <>
                      {/* Player cursor with speed indicator */}
                      <motion.div
                        className={`absolute w-4 h-4 rounded-full pointer-events-none z-10 transition-none ${
                          mouseSpeed > 8 ? "opacity-50" : "opacity-100"
                        }`}
                        style={{
                          backgroundColor:
                            mouseSpeed > 8
                              ? "#ef4444" // Red when moving too fast
                              : colorOptions[particleColor as keyof typeof colorOptions],
                          left: gameMousePosition.x - 8,
                          top: gameMousePosition.y - 8,
                          boxShadow:
                            mouseSpeed > 8
                              ? "0 0 10px #ef4444"
                              : `0 0 10px ${colorOptions[particleColor as keyof typeof colorOptions]}`,
                          transform: "translate3d(0, 0, 0)", // Hardware acceleration
                        }}
                      />

                      {/* Game particles with glow effects */}
                      {gameParticles.map(
                        (particle) =>
                          !particle.caught && (
                            <motion.div
                              key={particle.id}
                              className={`absolute w-3 h-3 rounded-full ${particle.isGlowing ? "animate-pulse" : ""}`}
                              style={{
                                backgroundColor: particle.isGlowing
                                  ? "#fbbf24" // Golden color for glowing particles
                                  : colorOptions[particleColor as keyof typeof colorOptions],
                                left: particle.x,
                                top: particle.y,
                                boxShadow: particle.isGlowing ? "0 0 15px #fbbf24, 0 0 25px #fbbf24" : "none",
                                border: particle.isGlowing ? "1px solid #fbbf24" : "none",
                              }}
                              animate={
                                particle.isGlowing
                                  ? {
                                      scale: [1, 1.2, 1],
                                    }
                                  : {}
                              }
                              transition={
                                particle.isGlowing
                                  ? {
                                      duration: 1,
                                      repeat: Number.POSITIVE_INFINITY,
                                      ease: "easeInOut",
                                    }
                                  : {}
                              }
                            />
                          ),
                      )}

                      {/* Speed warning */}
                      {mouseSpeed > 8 && (
                        <div className="absolute top-2 left-2 text-red-400 text-xs font-semibold">
                          Too fast! Slow down to catch particles
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={gameActive ? stopGame : startGame}
                    className={gameActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
                  >
                    {gameActive ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Start
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setScore(0)} className="border-white/20 hover:bg-white/10">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Experience Features
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🌟",
                title: "Dynamic Parallax",
                description: "Real-time parallax effects that respond to scroll position and mouse movement",
                effect: "animate-pulse",
              },
              {
                icon: "🎮",
                title: "Interactive Games",
                description: "Built-in particle catcher game with real-time score tracking",
                effect: "hover:scale-110",
              },
              {
                icon: "🎨",
                title: "Live Visual Effects",
                description: "Customizable particle systems with real-time color, size, and behavior changes",
                effect: "animate-bounce",
              },
              {
                icon: "⚡",
                title: "Real-time Controls",
                description: "Adjust effects and behavior instantly with interactive sliders and presets",
                effect: "hover:rotate-12",
              },
              {
                icon: "🖱️",
                title: "Mouse Tracking",
                description: "Elements respond dynamically to mouse position with adjustable sensitivity",
                effect: "hover:skew-y-3",
              },
              {
                icon: "📱",
                title: "Responsive Design",
                description: "Optimized experience across all devices and screen sizes",
                effect: "hover:shadow-2xl",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm h-full hover:bg-white/10 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <motion.div
                      className={`text-4xl mb-4 ${feature.effect} transition-all duration-300`}
                      whileHover={{ scale: 1.2 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          border-radius: 50%;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  )
}
