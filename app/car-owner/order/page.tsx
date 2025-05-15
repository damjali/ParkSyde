"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Package, CreditCard, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function OrderNFCPage() {
  const [formData, setFormData] = useState({
    name: "",
    plateNumber: "",
    address: "",
    phoneNumber: "",
  })
  const [errors, setErrors] = useState({
    name: "",
    plateNumber: "",
    address: "",
    phoneNumber: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = { ...errors }
    let isValid = true

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
      isValid = false
    }

    if (!formData.plateNumber.trim()) {
      newErrors.plateNumber = "Plate number is required"
      isValid = false
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required"
      isValid = false
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required"
      isValid = false
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = "Please enter a valid phone number"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      // In a real app, we would submit the order to the server here
      // For now, we'll just redirect to the success page
      window.location.href = "/car-owner/order/success"
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] py-12">
      <div className="container mx-auto px-4">
        <Link href="/" className="inline-flex items-center text-[#00A86B] mb-6 hover:underline">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Home
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="shadow-lg">
              <CardHeader className="bg-[#00A86B] text-white rounded-t-lg">
                <div className="flex items-center">
                  <Image src="/images/parksyde-logo.png" alt="ParkSyde Logo" width={36} height={36} className="mr-2" />
                  <div>
                    <CardTitle className="text-2xl flex items-center">
                      <Package className="mr-2 h-6 w-6" />
                      Order NFC Sticker
                    </CardTitle>
                    <CardDescription className="text-white/90">
                      Get your NFC sticker delivered to your doorstep
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        className={errors.name ? "border-[#F44336]" : ""}
                      />
                      {errors.name && <p className="text-sm text-[#F44336]">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="plateNumber">Car Plate Number</Label>
                      <Input
                        id="plateNumber"
                        name="plateNumber"
                        placeholder="e.g., ABC1234"
                        value={formData.plateNumber}
                        onChange={handleChange}
                        className={errors.plateNumber ? "border-[#F44336]" : ""}
                      />
                      {errors.plateNumber && <p className="text-sm text-[#F44336]">{errors.plateNumber}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Delivery Address</Label>
                      <Textarea
                        id="address"
                        name="address"
                        placeholder="Enter your full address"
                        rows={3}
                        value={formData.address}
                        onChange={handleChange}
                        className={errors.address ? "border-[#F44336]" : ""}
                      />
                      {errors.address && <p className="text-sm text-[#F44336]">{errors.address}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        placeholder="e.g., +60123456789"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className={errors.phoneNumber ? "border-[#F44336]" : ""}
                      />
                      {errors.phoneNumber && <p className="text-sm text-[#F44336]">{errors.phoneNumber}</p>}
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button type="submit" className="w-full bg-[#00A86B] hover:bg-[#008f5b] text-lg py-6">
                      Place Order
                      <CreditCard className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="shadow-lg">
              <CardHeader className="bg-[#F5F5F5] rounded-t-lg">
                <CardTitle className="text-xl text-[#212121]">Order Summary</CardTitle>
              </CardHeader>

              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-[#212121]">NFC Sticker</span>
                    <span className="font-bold text-[#212121]">RM 5.00</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#212121]">Shipping</span>
                    <span className="font-bold text-[#212121]">RM 5.00</span>
                  </div>

                  <div className="border-t pt-4 flex justify-between">
                    <span className="font-bold text-[#212121]">Total</span>
                    <span className="font-bold text-[#00A86B]">RM 10.00</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="bg-[#F5F5F5] rounded-b-lg">
                <div className="w-full space-y-4">
                  <div className="flex items-center">
                    <Truck className="h-5 w-5 text-[#00A86B] mr-2" />
                    <span className="text-sm text-[#212121]">Estimated delivery: 3-5 business days</span>
                  </div>

                  <div className="text-sm text-[#212121]">
                    <p>Your NFC sticker will be linked to your registered car plate number.</p>
                  </div>
                </div>
              </CardFooter>
            </Card>

            <Card className="shadow-lg mt-6">
              <CardHeader className="bg-[#F5F5F5] rounded-t-lg">
                <CardTitle className="text-xl text-[#212121]">Installation Guide</CardTitle>
              </CardHeader>

              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="bg-white border border-[#E0E0E0] rounded-lg p-4">
                    <h3 className="font-bold text-[#212121] mb-2">Where to place your NFC sticker:</h3>
                    <p className="text-sm text-[#212121]">
                      Place the NFC sticker on the inside of your windshield, preferably in the lower corner of the
                      passenger side for easy scanning.
                    </p>
                  </div>

                  <div className="bg-white border border-[#E0E0E0] rounded-lg p-4">
                    <h3 className="font-bold text-[#212121] mb-2">How to apply:</h3>
                    <ol className="text-sm text-[#212121] list-decimal pl-4 space-y-1">
                      <li>Clean the area with alcohol wipe (included)</li>
                      <li>Peel off the backing</li>
                      <li>Apply firmly to the glass</li>
                      <li>Press for 30 seconds to ensure adhesion</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
