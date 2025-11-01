"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Mail, MapPin, Github, ExternalLink, Award, Code } from "lucide-react"
import Link from "next/link"

export default function ResumePage() {
  const handleDownload = () => {
    // Download the PDF file
    const link = document.createElement('a')
    link.href = '/Ian_Siats_Resume.pdf'
    link.download = 'Ian_Siats_Resume.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-md print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 w-full">
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <Button variant="ghost" size="sm" asChild className="text-xs sm:text-sm">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Back to Portfolio</span>
                <span className="sm:hidden">Back</span>
              </Link>
            </Button>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Professional Resume
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full overflow-x-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 sm:space-y-8"
        >
          {/* PDF Viewer */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm w-full overflow-hidden">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col gap-4 mb-4">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <Button
                    onClick={handleDownload}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-sm sm:text-base w-full sm:w-auto"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-white/20 hover:bg-white/10 text-white text-sm sm:text-base w-full sm:w-auto"
                  >
                    <a
                      href="/Ian_Siats_Resume.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open in New Tab
                    </a>
                  </Button>
                </div>
              </div>
              <div className="w-full relative border border-white/10 rounded-lg overflow-hidden bg-white" style={{ minHeight: '800px' }}>
                <object
                  data="/Ian_Siats_Resume.pdf#view=FitH"
                  type="application/pdf"
                  className="w-full h-full min-h-[800px] md:min-h-[1000px]"
                  style={{ minHeight: '800px' }}
                  aria-label="Ian Siats Resume PDF"
                >
                  {/* Fallback content if PDF doesn't load */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-8 text-center">
                    <p className="text-gray-700 mb-4 text-lg font-medium">
                      Unable to display PDF in browser
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={handleDownload}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="border-gray-300 hover:bg-gray-100"
                      >
                        <a
                          href="/Ian_Siats_Resume.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open in New Tab
                        </a>
                      </Button>
                    </div>
                  </div>
                </object>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:bg-white {
            background: white !important;
          }
          .print\\:text-black {
            color: black !important;
          }
          .print\\:border-gray-300 {
            border-color: #d1d5db !important;
          }
          .print\\:text-gray-700 {
            color: #374151 !important;
          }
          .print\\:text-gray-600 {
            color: #4b5563 !important;
          }
          .print\\:border-gray-400 {
            border-color: #9ca3af !important;
          }
          .print\\:text-blue-600 {
            color: #2563eb !important;
          }
          .print\\:bg-blue-100 {
            background-color: #dbeafe !important;
          }
          .print\\:text-blue-800 {
            color: #1e40af !important;
          }
          .print\\:bg-purple-100 {
            background-color: #ede9fe !important;
          }
          .print\\:text-purple-800 {
            color: #5b21b6 !important;
          }
          .print\\:bg-blue-600 {
            background-color: #2563eb !important;
          }
          .print\\:bg-purple-600 {
            background-color: #9333ea !important;
          }
          .print\\:border-green-600 {
            border-color: #16a34a !important;
          }
          .print\\:text-green-800 {
            color: #166534 !important;
          }
          .print\\:bg-green-100 {
            background-color: #dcfce7 !important;
          }
        }
      `}</style>
    </div>
  )
}
