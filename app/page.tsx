"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Car, QrCode, Bell, ArrowRight, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [showCarOwnerOptions, setShowCarOwnerOptions] = useState(false)

  // Close dropdown when clicking outside
  const handleClickOutside = () => {
    if (showCarOwnerOptions) {
      setShowCarOwnerOptions(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]" onClick={handleClickOutside}>
      {/* Header */}
      <header className="bg-[#00A86B] text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Image src="/images/parksyde-logo.png" alt="ParkSyde Logo" width={40} height={40} className="mr-2" />
            <h1 className="text-2xl font-bold">ParkSyde</h1>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/about" className="hover:underline">
                  About
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:underline">
                  Support
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="flex justify-center mb-8">
          <Image
            src="/images/parksyde-logo.png"
            alt="ParkSyde Logo"
            width={120}
            height={120}
            className="rounded-xl shadow-md"
          />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-[#212121] mb-6">Solve Double Parking with Just a Tap</h1>
        <p className="text-xl text-[#212121] mb-12 max-w-2xl mx-auto">
          Our NFC sticker solution makes double parking manageable. Register, stick, and stay connected.
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-6 mb-16">
          <div className="relative">
            <Button
              onClick={() => setShowCarOwnerOptions(!showCarOwnerOptions)}
              className="w-full md:w-64 h-16 text-lg bg-[#00A86B] hover:bg-[#008f5b] rounded-xl shadow-lg"
            >
              I'm a Car Owner
              <Car className="ml-2 h-5 w-5" />
            </Button>
            {showCarOwnerOptions && (
              <div
                className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <Link href="/car-owner/register">
                  <div className="px-4 py-3 hover:bg-[#F5F5F5] cursor-pointer">
                    <p className="font-medium text-[#212121]">Register New Car</p>
                    <p className="text-sm text-[#212121]/70">First time? Register your car details</p>
                  </div>
                </Link>
                <Link href="/car-owner/activate">
                  <div className="px-4 py-3 hover:bg-[#F5F5F5] cursor-pointer border-t border-[#E0E0E0]">
                    <p className="font-medium text-[#212121]">Activate Double Park Mode</p>
                    <p className="text-sm text-[#212121]/70">Already registered? Activate your NFC</p>
                  </div>
                </Link>
              </div>
            )}
          </div>

          <Link href="/blocked/scan">
            <Button className="w-full md:w-64 h-16 text-lg bg-white text-[#00A86B] border-2 border-[#00A86B] hover:bg-[#f0f0f0] rounded-xl shadow-lg">
              I'm Blocked
              <QrCode className="ml-2 h-5 w-5" />
            </Button>
          </Link>

          <Link href="/general-notification/scan">
            <Button className="w-full md:w-64 h-16 text-lg bg-[#FFC107] hover:bg-[#e6ae06] text-white rounded-xl shadow-lg">
              Send Car Alert
              <AlertCircle className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#212121] mb-12">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-[#F5F5F5] p-8 rounded-xl shadow-md text-center">
              <div className="bg-[#00A86B] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#212121] mb-2">Register & Stick NFC</h3>
              <p className="text-[#212121]">Register your car details and place the NFC sticker on your windshield.</p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#F5F5F5] p-8 rounded-xl shadow-md text-center">
              <div className="bg-[#00A86B] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#212121] mb-2">Activate Status</h3>
              <p className="text-[#212121]">
                When double parking, activate your status to let others know you're reachable.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#F5F5F5] p-8 rounded-xl shadow-md text-center">
              <div className="bg-[#00A86B] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#212121] mb-2">Get Notified & Take Action</h3>
              <p className="text-[#212121]">Receive instant notifications when someone needs you to move your car.</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/car-owner/register">
              <Button className="bg-[#00A86B] hover:bg-[#008f5b] text-lg px-8 py-6 rounded-xl shadow-lg">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* New Feature Section */}
      <section className="py-16 bg-[#F5F5F5]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#212121] mb-6">More Than Just Double Parking</h2>
          <p className="text-center text-[#212121] mb-12 max-w-2xl mx-auto">
            ParkSyde also helps you alert car owners about other issues like lights left on, exposed valuables, or
            security concerns.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="bg-[#FFC107] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-[#212121] mb-2">Lights Left On</h3>
              <p className="text-sm text-[#212121]">
                Help prevent dead batteries by notifying owners when their lights are left on.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="bg-[#FFC107] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-[#212121] mb-2">Exposed Valuables</h3>
              <p className="text-sm text-[#212121]">
                Alert car owners when valuables are visible in their car, helping prevent theft.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="bg-[#FFC107] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-[#212121] mb-2">Security Concerns</h3>
              <p className="text-sm text-[#212121]">
                Notify owners about security issues like broken windows or suspicious activity.
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link href="/general-notification/scan">
              <Button className="bg-[#FFC107] hover:bg-[#e6ae06] text-white px-6 py-3 rounded-xl shadow-md">
                Send a Car Alert Now
                <AlertCircle className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#212121] mb-12">What Our Users Say</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#F5F5F5] p-6 rounded-xl shadow-md">
              <p className="text-[#212121] mb-4">
                "This app really helped free up more parking spots, especially at busy places like Mydin in Pekan,
                Pahang. It's super easy to use — just scan the NFC sticker and you're good to go. Honestly, I think more
                people will start using it because of how simple and helpful it is!" (Translated from malay)
              </p>
              <p className="font-bold text-[#00A86B]">
                - Mr Danial Nabil, Diploma Student in Universiti Malaysia Pahang (UMP)
              </p>
            </div>

            <div className="bg-[#F5F5F5] p-6 rounded-xl shadow-md">
              <p className="text-[#212121] mb-4">
                "Honestly, using an NFC car sticker for this is a big upgrade compared to the old QR code system. These
                days, NFC is everywhere — even TNG cards are using it now, so it's super easy and accessible for
                everyone. I love how smooth and quick the process is!" (Translated from malay)
              </p>
              <p className="font-bold text-[#00A86B]">- Mr Faris Faiz, A resident in Pekan,Pahang</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#00A86B] text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center">
              <Image src="/images/parksyde-logo.png" alt="ParkSyde Logo" width={50} height={50} className="mr-3" />
              <div>
                <h3 className="text-xl font-bold mb-2">ParkSyde</h3>
                <p>Making double parking manageable for everyone.</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/car-owner/register" className="hover:underline">
                    Register
                  </Link>
                </li>
                <li>
                  <Link href="/car-owner/order" className="hover:underline">
                    Order NFC Sticker
                  </Link>
                </li>
                <li>
                  <Link href="/car-owner/activate" className="hover:underline">
                    Activate Status
                  </Link>
                </li>
                <li>
                  <Link href="/blocked/scan" className="hover:underline">
                    I'm Blocked
                  </Link>
                </li>
                <li>
                  <Link href="/general-notification/scan" className="hover:underline">
                    Send Car Alert
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <p>support@parksyde.com</p>
              <p>+60 12-345-6789</p>
            </div>
          </div>

          <div className="border-t border-white/20 mt-8 pt-8 text-center">
            <p>&copy; {new Date().getFullYear()} ParkSyde. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
