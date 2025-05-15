"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, QrCode, Scan, Clock, Phone, AlertTriangle, MapPin, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function ScanPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [isScanned, setIsScanned] = useState(false)
  const [scanTime, setScanTime] = useState<Date | null>(null)
  const [elapsedTime, setElapsedTime] = useState("00:00")
  const [plateNumber, setPlateNumber] = useState("")
  const [isEscalating, setIsEscalating] = useState(false)
  const [escalationStep, setEscalationStep] = useState(0)
  const [nearbyAuthorities, setNearbyAuthorities] = useState<Array<{ name: string; distance: string }>>([])

  // Use useEffect for timer to properly clean up
  useEffect(() => {
    let timerInterval: NodeJS.Timeout | null = null

    if (scanTime) {
      timerInterval = setInterval(() => {
        const now = new Date()
        const diffMs = now.getTime() - scanTime.getTime()
        const diffSecs = Math.floor(diffMs / 1000)
        const mins = Math.floor(diffSecs / 60)
        const secs = diffSecs % 60

        setElapsedTime(`${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`)
      }, 1000)
    }

    // Clean up interval on component unmount
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval)
      }
    }
  }, [scanTime])

  const handleScan = () => {
    // In a real app, this would trigger the NFC scanning functionality
    setIsScanning(true)

    // Simulate a scan after 2 seconds
    setTimeout(() => {
      setIsScanning(false)
      setIsScanned(true)
      setScanTime(new Date())
      setPlateNumber("ABC1234") // This would be the actual plate number from the NFC
    }, 2000)
  }

  const handleEscalate = () => {
    setIsEscalating(true)
    setEscalationStep(1)

    // Simulate finding location
    setTimeout(() => {
      setEscalationStep(2)
      // Simulate finding nearby authorities
      setTimeout(() => {
        setNearbyAuthorities([
          { name: "Local Police Station", distance: "1.2 km" },
          { name: "Traffic Enforcement Unit", distance: "2.5 km" },
          { name: "Municipal Towing Service", distance: "3.1 km" },
        ])
        setEscalationStep(3)
        // Simulate contacting authorities
        setTimeout(() => {
          setEscalationStep(4)
        }, 2000)
      }, 2000)
    }, 2000)
  }

  const renderEscalationContent = () => {
    switch (escalationStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-[#00A86B] mr-2" />
              <p className="text-[#212121]">Finding your location...</p>
            </div>
            <Progress value={25} className="h-2" />
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-[#00A86B] mr-2" />
              <p className="text-[#212121]">Location found</p>
            </div>
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-[#00A86B] mr-2" />
              <p className="text-[#212121]">Locating nearby authorities...</p>
            </div>
            <Progress value={50} className="h-2" />
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-[#00A86B] mr-2" />
              <p className="text-[#212121]">Location found</p>
            </div>
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-[#00A86B] mr-2" />
              <p className="text-[#212121]">Nearby authorities found:</p>
            </div>
            <div className="bg-white p-3 rounded-lg space-y-2">
              {nearbyAuthorities.map((authority, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm font-medium text-[#212121]">{authority.name}</span>
                  <span className="text-sm text-[#212121]">{authority.distance}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-[#00A86B] mr-2" />
              <p className="text-[#212121]">Contacting authorities...</p>
            </div>
            <Progress value={75} className="h-2" />
          </div>
        )
      case 4:
        return (
          <div className="space-y-4">
            <div className="bg-[#4CAF50] text-white p-4 rounded-lg text-center">
              <Shield className="h-8 w-8 mx-auto mb-2" />
              <p className="font-bold">Authorities Notified</p>
              <p className="text-sm">Local Police Station has been notified and will assist you shortly.</p>
            </div>
            <p className="text-sm text-[#212121]">
              Reference Number: <span className="font-bold">ESC-{Math.floor(100000 + Math.random() * 900000)}</span>
            </p>
            <p className="text-sm text-[#212121]">
              Estimated arrival time: <span className="font-bold">10-15 minutes</span>
            </p>
            <Button onClick={() => setIsEscalating(false)} className="w-full bg-[#00A86B] hover:bg-[#008f5b]">
              Return to Status
            </Button>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] py-12">
      <div className="container mx-auto px-4">
        <Link href="/" className="inline-flex items-center text-[#00A86B] mb-6 hover:underline">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Home
        </Link>

        <Card className="max-w-md mx-auto shadow-lg">
          <CardHeader className={`text-white rounded-t-lg ${isScanned ? "bg-[#4CAF50]" : "bg-[#00A86B]"}`}>
            <div className="flex items-center">
              <Image src="/images/parksyde-logo.png" alt="ParkSyde Logo" width={36} height={36} className="mr-2" />
              <div>
                <CardTitle className="text-2xl flex items-center">
                  {isScanned ? <Clock className="mr-2 h-6 w-6" /> : <QrCode className="mr-2 h-6 w-6" />}
                  {isScanned ? "Owner Notified" : "Scan NFC Sticker"}
                </CardTitle>
                <CardDescription className="text-white/90">
                  {isScanned
                    ? "The car owner has been notified to move their car"
                    : "Scan the NFC sticker on the car blocking you"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {!isScanned && (
              <div className="space-y-6">
                <div className="bg-[#F5F5F5] p-6 rounded-lg">
                  <h3 className="font-bold text-[#212121] mb-4">How to scan:</h3>
                  <ol className="text-sm text-[#212121] space-y-2">
                    <li className="flex items-start">
                      <span className="bg-[#00A86B] text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">
                        1
                      </span>
                      <span>Look for the NFC sticker on the windshield of the car blocking you</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-[#00A86B] text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">
                        2
                      </span>
                      <span>Press the "Scan NFC" button below</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-[#00A86B] text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">
                        3
                      </span>
                      <span>Hold your phone near the NFC sticker</span>
                    </li>
                  </ol>
                </div>

                <Button
                  onClick={handleScan}
                  disabled={isScanning}
                  className="w-full bg-[#00A86B] hover:bg-[#008f5b] text-lg py-6"
                >
                  {isScanning ? "Scanning..." : "Scan NFC"}
                  <Scan className="ml-2 h-5 w-5" />
                </Button>

                {isScanning && (
                  <div className="text-center">
                    <p className="text-[#212121]">Hold your phone near the NFC sticker...</p>
                  </div>
                )}
              </div>
            )}

            {isScanned && !isEscalating && (
              <div className="space-y-6">
                <div className="bg-[#F5F5F5] p-6 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-[#212121]">Status</h3>
                    <span className="bg-[#4CAF50] text-white px-3 py-1 rounded-full text-sm">Owner Notified</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-[#212121]">Car Plate:</span>
                      <span className="text-sm font-bold text-[#212121]">{plateNumber}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-[#212121]">Waiting time:</span>
                      <span className="text-sm font-bold text-[#212121] flex items-center">
                        <Clock className="mr-1 h-4 w-4 text-[#FFC107]" />
                        {elapsedTime}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#F5F5F5] p-6 rounded-lg">
                  <h3 className="font-bold text-[#212121] mb-2">What happens now?</h3>
                  <p className="text-sm text-[#212121]">
                    The car owner has been notified and should move their car soon. Please wait a few minutes.
                  </p>
                </div>

                <div className="space-y-4">
                  <Button variant="outline" className="w-full border-[#00A86B] text-[#00A86B] py-4">
                    <Phone className="mr-2 h-5 w-5" />
                    Call Owner (Masked Number)
                  </Button>

                  <Button onClick={handleEscalate} className="w-full bg-[#FFC107] hover:bg-[#e6ae06] text-white py-4">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    Escalate to Authorities
                  </Button>
                </div>
              </div>
            )}

            {isEscalating && (
              <div className="space-y-6">
                <div className="bg-[#F5F5F5] p-6 rounded-lg">
                  <h3 className="font-bold text-[#212121] mb-4">Escalating to Authorities</h3>
                  {renderEscalationContent()}
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-center border-t pt-6">
            <p className="text-sm text-[#212121]">
              {isScanned
                ? "Thank you for your patience"
                : "Can't find an NFC sticker? The car might not be registered."}
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
