"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface AboutSectionProps {
  skillTags: { frontend: string[]; backend: string[]; database: string[]; other: string[] }
  aboutContent?: {
    title?: string
    subtitle?: string
    journeyTitle?: string
    journeyParagraph1?: string
    journeyParagraph2?: string
  }
}

export default function AboutSection({ skillTags, aboutContent }: AboutSectionProps) {
  return (
    <section id="about" className="py-20 relative" aria-label="About Me">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {aboutContent?.title || "About Me"}
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
            {aboutContent?.subtitle || "Passionate about creating digital experiences that not only function flawlessly but also captivate and inspire users through innovative design and interaction."}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 text-white">Skills & Expertise</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-white font-semibold mb-2">Frontend</h4>
                    <div className="flex flex-wrap gap-2">
                      {skillTags.frontend.map((t) => (
                        <Badge key={t} variant="secondary" className="bg-white/10 text-blue-400 border-blue-500/30">{t}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Backend</h4>
                    <div className="flex flex-wrap gap-2">
                      {skillTags.backend.map((t) => (
                        <Badge key={t} variant="secondary" className="bg-white/10 text-blue-400 border-blue-500/30">{t}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Database</h4>
                    <div className="flex flex-wrap gap-2">
                      {skillTags.database.map((t) => (
                        <Badge key={t} variant="secondary" className="bg-white/10 text-blue-400 border-blue-500/30">{t}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Other</h4>
                    <div className="flex flex-wrap gap-2">
                      {skillTags.other.map((t) => (
                        <Badge key={t} variant="secondary" className="bg-white/10 text-blue-400 border-blue-500/30">{t}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="space-y-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-white">
                  {aboutContent?.journeyTitle || "My Journey"}
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  {aboutContent?.journeyParagraph1 || "Based in the beautiful state of Colorado, I'm a passionate developer who believes in creating digital experiences that not only function flawlessly but also captivate and inspire."}
                </p>
                <p className="text-gray-300 leading-relaxed">
                  {aboutContent?.journeyParagraph2 || "My journey in development is driven by curiosity and a love for interactive design. I specialize in crafting websites and applications that respond to user interaction in meaningful ways, creating memorable experiences that leave lasting impressions."}
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 border-white/10 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-white mb-2">∞</div>
                  <div className="text-blue-400 font-medium">Creativity</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-teal-500/20 to-green-600/20 border-white/10 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-white mb-2">24/7</div>
                  <div className="text-teal-400 font-medium">Innovation</div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}


