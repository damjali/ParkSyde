"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Car, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { set } from "date-fns"

export default function RegisterPage() {
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(false);
  const [user, setUser] = useState({
    email: "",
    user_id: "",
    pin_number: "",
    phone_number: ""
  });

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsAuthenticatedState(false);
          return;
        }

        const response = await fetch("http://192.168.4.183:8000/is_authenticated", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const user = await response.json();
          setUser(user);
          setIsAuthenticatedState(true);
        } else {
          const user = null;
          setIsAuthenticatedState(false);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticatedState(false);
      }
    };

    checkAuthentication();
  }, []);

  const isAuthenticated = () => {
    return isAuthenticatedState;
  };

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    plateNumber: "",
    phoneNumber: "",
    pin: "",
    confirmPin: "",
    password: "",
  })
  const [errors, setErrors] = useState({
    plateNumber: "",
    phoneNumber: "",
    pin: "",
    confirmPin: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateStep1 = () => {
    const newErrors = { ...errors }
    let isValid = true

    if (!formData.plateNumber.trim()) {
      newErrors.plateNumber = "Plate number is required"
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

  const validateStep2 = () => {
    const newErrors = { ...errors }
    let isValid = true

    if (!formData.password.trim()) {
      newErrors.password = "Password is required"
      isValid = false
    }

    if (!formData.pin.trim()) {
      newErrors.pin = "PIN is required"
      isValid = false
    } else if (formData.pin.length !== 4 || !/^\d+$/.test(formData.pin)) {
      newErrors.pin = "PIN must be 4 digits"
      isValid = false
    }

    if (formData.pin !== formData.confirmPin) {
      newErrors.confirmPin = "PINs do not match"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleNext = async (event: React.FormEvent) => {
    event.preventDefault();
    isAuthenticated();
    if (!isAuthenticatedState) {
      window.location.href = "/login";
    }
    const { plateNumber } = formData
    const { user_id } = user

    if (validateStep1()) {
      console.log("Checking car plate data:", JSON.stringify({ plateNumber }))
      try {
        const response = await fetch("http://192.168.4.183:8000/cars/" + plateNumber, {
          method: "GET"
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          console.error("Checking car data failed:", data?.detail || response.statusText);
          alert("Checking car data failed. Please try again.");
        } else if (data) {
          // Handle car already exists
          console.error("Car already exists:", data?.detail || response.statusText);
          alert("Car already exists. Please try again.");
        } else {
          // Proceed to the next step
          setStep(2);
        }
      } catch (error) {
        console.error("Registration error:", error);
        alert("Registration failed. Please try again.");
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { user_id, email } = user
    const { plateNumber, pin, phoneNumber, password } = formData
    let validation = true
    if (validateStep2()) {

      // authenticate password

      console.log("Authenticating user:", JSON.stringify({ email, password }))

      try {
        const response = await fetch("http://192.168.4.183:8000/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `username=${email}&password=${password}`,
        });

        if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.access_token);
        } else {
          // Handle login error
          validation = false
          console.error("Login failed:", response.statusText);
          alert("Wrong password. Please check your credentials.");
        }
      } catch (error) {
        console.error("Login error:", error);
        alert("Authentication failed. Please try again.");
      }

      //create car and update user

      const car_status = 0
      if (validation) try {
        console.log("Sending data:", JSON.stringify({ plateNumber, user_id, car_status }))
        let response = await fetch("http://192.168.4.183:8000/cars", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ plateNumber, user_id, car_status }),
        });

        let data = await response.json().catch(() => null);

        if (!response.ok) {
          // Handle registration error
          console.error("Car registration failed:", data?.detail || response.statusText);
          alert("Car registration failed. Please try again.");
          validation = false
        }

        const pin_number = pin;
        const phone_number = phoneNumber;
        response = await fetch("http://192.168.4.183:8000/update", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id, pin_number, phone_number }),
        });

        data = await response.json().catch(() => null);

        if (!response.ok) {
          // Handle registration error
          console.error("Registration failed:", data?.detail || response.statusText);
          alert("Registration failed. Please try again.");
          validation = false
        }
      } catch (error) {
        console.error("Registration error:", error);
        alert("Registration failed. Please try again.");
      }

      // update token

      if (validation) try {
        const response = await fetch("http://192.168.4.183:8000/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `username=${email}&password=${password}`,
        });

        if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.access_token);
        } else {
          // Handle login error
          validation = false
          console.error("Login failed:", response.statusText);
          alert("Wrong password. Please check your credentials.");
        }
      } catch (error) {
        console.error("Login error:", error);
        alert("Authentication failed. Please try again.");
      }

      if (validation) {
        window.location.href = "/car-owner/register/success"
      }
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
          <CardHeader className="bg-[#00A86B] text-white rounded-t-lg">
            <div className="flex items-center">
              <Image src="/images/parksyde-logo.png" alt="ParkSyde Logo" width={36} height={36} className="mr-2" />
              <div>
                <CardTitle className="text-2xl flex items-center">
                  <Car className="mr-2 h-6 w-6" />
                  Car Owner Registration
                </CardTitle>
                <CardDescription className="text-white/90">
                  Register your car to use our double parking solution
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <div className={`h-2 w-full rounded-full ${step >= 1 ? "bg-[#00A86B]" : "bg-[#E0E0E0]"} mr-1`}></div>
                <div className={`h-2 w-full rounded-full ${step >= 2 ? "bg-[#00A86B]" : "bg-[#E0E0E0]"} ml-1`}></div>
              </div>
              <p className="text-center text-sm text-[#212121]">
                Step {step} of 2: {step === 1 ? "Car Details" : "Security Setup"}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {step === 1 ? (
                <>
                  <div className="space-y-4">
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
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="w-full bg-[#00A86B] hover:bg-[#008f5b] text-lg py-6"
                    >
                      Continue
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-4">
                    <div className="flex items-center justify-center mb-4 text-[#00A86B]">
                      <Shield className="h-12 w-12" />
                    </div>

                    <p className="text-center text-[#212121] mb-4">
                      Create a 4-digit PIN to secure your account. You'll need this PIN to activate or deactivate your
                      double parking status.
                    </p>

                    <div className="space-y-2">
                      <Label htmlFor="pin">4-Digit PIN</Label>
                      <Input
                        id="pin"
                        name="pin"
                        type="password"
                        maxLength={4}
                        placeholder="Enter 4-digit PIN"
                        value={formData.pin}
                        onChange={handleChange}
                        className={errors.pin ? "border-[#F44336]" : ""}
                      />
                      {errors.pin && <p className="text-sm text-[#F44336]">{errors.pin}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPin">Confirm PIN</Label>
                      <Input
                        id="confirmPin"
                        name="confirmPin"
                        type="password"
                        maxLength={4}
                        placeholder="Confirm your PIN"
                        value={formData.confirmPin}
                        onChange={handleChange}
                        className={errors.confirmPin ? "border-[#F44336]" : ""}
                      />
                      {errors.confirmPin && <p className="text-sm text-[#F44336]">{errors.confirmPin}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        className={errors.password ? "border-[#F44336]" : ""}
                      />
                      {errors.password && <p className="text-sm text-[#F44336]">{errors.password}</p>}
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <Button type="submit" className="w-full bg-[#00A86B] hover:bg-[#008f5b] text-lg py-6">
                      Submit & Register
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="w-full border-[#00A86B] text-[#00A86B]"
                    >
                      Back
                    </Button>
                  </div>
                </>
              )}
            </form>
          </CardContent>

          <CardFooter className="flex justify-center border-t pt-6">
            <p className="text-sm text-[#212121]">
              Already registered?{" "}
              <Link href="/car-owner/activate" className="text-[#00A86B] hover:underline">
                Activate your status
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
