"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Car, ShieldCheck, ShieldOff, Clock, Plus, Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"


export default function ActivatePage() {
  const [isActive, setIsActive] = useState(false)
  const [showPinInput, setShowPinInput] = useState(false)
  const [plateNumber, setPlateNumber] = useState("")
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")
  const [activeSince, setActiveSince] = useState<Date | null>(null)
  const [registeredPlates, setRegisteredPlates] = useState<{ plateNumber: string }[]>([])
  const [showPlateSelector, setShowPlateSelector] = useState(true)
  const [showAddNewPlate, setShowAddNewPlate] = useState(false)
  const [newPlateNumber, setNewPlateNumber] = useState("")
  const [plateDropdownOpen, setPlateDropdownOpen] = useState(false)
  const [carplates, setCarPlates] = useState([]);
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(false);
  const [activeTimer, setActiveTimer] = useState(0);
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
        const response = await fetch("http://localhost:8000/is_authenticated", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const user = await response.json();
          console.log("Authenticated user:", user);
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

  useEffect(() => {
    isAuthenticated();

    const fetchCarPlates = async () => {
      try {
        const response = await fetch("http://localhost:8000/carsUser/" + user.user_id, {
          method: "GET"
        })

        if (response.ok) {
          const data = await response.json()
          console.log("Car plates data:", data)
          setRegisteredPlates(data)
        } else {
          console.error("Failed to fetch car plates")
        }
      } catch (error) {
        console.error("Error fetching car plates:", error)
      }
    }

    fetchCarPlates()

  }, [isAuthenticatedState])

  const handleActivate = async () => {
    if (!plateNumber.trim()) {
      setError("Please select or enter a plate number")
      return
    }

    try {
      const response = await fetch("http://localhost:8000/cars/" + plateNumber, {
        method: "GET"
      });

      const car = await response.json().catch(() => null);

      if (!response.ok) {
        console.error("Car not found:", car?.detail || response.statusText);
        alert("Car not found.");
      } else {
        console.log("Car data:", car);
        console.log("Car active since:", new Date(car.activated_at));
        console.log("Current time:", new Date());
        setIsActive(car.car_status)
        setActiveSince(car.activated_at ? new Date(car.activated_at) : null)
        setShowPinInput(!car.car_status)
        setShowPlateSelector(false)
      }
    } catch (error) {
      console.error("Car not found:", error);
      alert("Car not found. Please try again.");
    }
    setError("")
  }

  const handlePinSubmit = async () => {
    if (!pin.trim()) {
      setError("Please enter your PIN")
      return
    }

    if (pin.length !== 4 || !/^\d+$/.test(pin)) {
      setError("PIN must be 4 digits")
      return
    }

    console.log("User:", user)
    // In a real app, we would verify the PIN with the server
    if (pin !== user.pin_number) {
      setError("Incorrect PIN")
      return
    }

    try {
      const status = true;
      console.log("Data:", { plateNumber, status })
      const response = await fetch("http://localhost:8000/cars/status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plateNumber, status }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        console.error("Car not found:", data?.detail || response.statusText);
        alert("Car not found.");
      } else {
        setIsActive(true)
        setActiveSince(data.activated_at ? new Date(data.activated_at) : new Date())
      }
    } catch (error) {
      console.error("Deactivation error:", error);
      alert("Deactivation failed. Please try again.");
    }
    setShowPinInput(false)
    setError("")
  }

  const handleDeactivate = () => {
    setShowPinInput(true)
    setError("")
  }

  const handleDeactivateConfirm = async () => {
    if (!pin.trim()) {
      setError("Please enter your PIN")
      return
    }

    if (pin.length !== 4 || !/^\d+$/.test(pin)) {
      setError("PIN must be 4 digits")
      return
    }

    if (pin !== user.pin_number) {
      setError("Incorrect PIN")
      return
    }

    const status = false;
    try {
      const response = await fetch("http://localhost:8000/cars/status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plateNumber, status }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        console.error("Car not found:", data?.detail || response.statusText);
        alert("Car not found.");
      } else {
        setIsActive(false)
        setActiveSince(null)
        setShowPinInput(false)
        setShowPlateSelector(true)
      }
    } catch (error) {
      console.error("Deactivation error:", error);
      alert("Deactivation failed. Please try again.");
    }
    setError("")
    setPin("")
    
  }

  const handleSelectPlate = (selectedPlate: string) => {
    setPlateNumber(selectedPlate)
    setPlateDropdownOpen(false)
  }

  const handleAddNewPlate = async () => {
    const { user_id, email } = user
    if (!newPlateNumber.trim()) {
      setError("Please enter a plate number")
      return
    }

    console.log("Checking car plate data:", JSON.stringify({ newPlateNumber }))
    try {
      const response = await fetch("http://localhost:8000/cars/" + newPlateNumber, {
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
        const car_status = false; // Default status for new car
        let plateNumber = newPlateNumber.toUpperCase();
        console.log("Sending data:", JSON.stringify({ plateNumber, user_id, car_status }))
        const response = await fetch("http://localhost:8000/cars", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ plateNumber, user_id, car_status }),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          // Handle registration error
          console.error("Car registration failed:", data?.detail || response.statusText);
          alert("Car registration failed. Please try again.");
        } else {
          const newPlate = {
            plateNumber: newPlateNumber.toUpperCase(),
          }
          setRegisteredPlates([...registeredPlates, newPlate])
          setPlateNumber(newPlateNumber.toUpperCase())
          setNewPlateNumber("")
          setShowAddNewPlate(false)
        }
      }

    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    }
    const newPlate = {
      plateNumber: newPlateNumber.toUpperCase(),
    }

    setError("")
  }

  const formatDuration = (startDate: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - startDate.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const hours = Math.floor(diffMins / 60)
    const mins = diffMins % 60

    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  useEffect(() => {
    if (isActive && activeSince) {
      const interval = setInterval(() => {
        setActiveTimer((prev) => prev + 1);
      }, 60000); // 60,000 ms = 1 minute

      return () => clearInterval(interval);
    }
  }, [isActive, activeSince]);

  return (
    <div className="min-h-screen bg-[#F5F5F5] py-12">
      <div className="container mx-auto px-4">
        <Link href="/" className="inline-flex items-center text-[#00A86B] mb-6 hover:underline">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Home
        </Link>

        <Card className="max-w-md mx-auto shadow-lg">
          <CardHeader className={`text-white rounded-t-lg ${isActive ? "bg-[#4CAF50]" : "bg-[#00A86B]"}`}>
            <div className="flex items-center">
              <Image src="/images/parksyde-logo.png" alt="ParkSyde Logo" width={36} height={36} className="mr-2" />
              <div>
                <CardTitle className="text-2xl flex items-center">
                  {isActive ? <ShieldCheck className="mr-2 h-6 w-6" /> : <Car className="mr-2 h-6 w-6" />}
                  {isActive ? "Double Park Mode Active" : "Activate Double Park Mode"}
                </CardTitle>
                <CardDescription className="text-white/90">
                  {isActive
                    ? "Your car is currently in double park mode"
                    : "Activate when you need to double park your car"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {!isActive && showPlateSelector && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="plateNumber">Select Your Car</Label>

                  {/* Plate number selector dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      className={`flex items-center justify-between w-full p-3 text-left border rounded-md ${plateNumber ? "border-[#00A86B]" : "border-input"
                        } ${error && !showPinInput ? "border-[#F44336]" : ""}`}
                      onClick={() => setPlateDropdownOpen(!plateDropdownOpen)}
                    >
                      <span>{plateNumber || "Select a car plate number"}</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>

                    {plateDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                        {registeredPlates.map((plate) => (
                          <div
                            className="flex items-center justify-between p-3 hover:bg-[#F5F5F5] cursor-pointer"
                            onClick={() => handleSelectPlate(plate.plateNumber)}
                          >
                            <div className="flex items-center">
                              <Car className="h-4 w-4 mr-2 text-[#00A86B]" />
                              <span>{plate.plateNumber}</span>
                            </div>
                            {plateNumber === plate.plateNumber && <Check className="h-4 w-4 text-[#00A86B]" />}
                          </div>
                        ))}

                        <div
                          className="flex items-center p-3 border-t hover:bg-[#F5F5F5] cursor-pointer"
                          onClick={() => {
                            setShowAddNewPlate(true)
                            setPlateDropdownOpen(false)
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2 text-[#00A86B]" />
                          <span>Add new plate number</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {error && !showPinInput && !showAddNewPlate && <p className="text-sm text-[#F44336]">{error}</p>}
                </div>

                {showAddNewPlate && (
                  <div className="space-y-2 bg-[#F5F5F5] p-4 rounded-lg">
                    <Label htmlFor="newPlateNumber">New Car Plate Number</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="newPlateNumber"
                        placeholder="e.g., ABC1234"
                        value={newPlateNumber}
                        onChange={(e) => {
                          setNewPlateNumber(e.target.value)
                          setError("")
                        }}
                        className={error && showAddNewPlate ? "border-[#F44336]" : ""}
                      />
                      <Button type="button" onClick={handleAddNewPlate} className="bg-[#00A86B] hover:bg-[#008f5b]">
                        Add
                      </Button>
                    </div>
                    {error && showAddNewPlate && <p className="text-sm text-[#F44336]">{error}</p>}
                    <Button
                      variant="ghost"
                      className="text-sm text-[#00A86B] p-0 h-auto"
                      onClick={() => setShowAddNewPlate(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}

                <Button onClick={handleActivate} className="w-full bg-[#00A86B] hover:bg-[#008f5b] text-lg py-6">
                  Activate Double Park Mode
                  <ShieldCheck className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}

            {showPinInput && (
              <div className="space-y-4">
                <div className="flex items-center justify-center mb-4 text-[#00A86B]">
                  {isActive ? <ShieldOff className="h-12 w-12" /> : <ShieldCheck className="h-12 w-12" />}
                </div>

                <p className="text-center text-[#212121] mb-4">
                  {isActive
                    ? "Enter your PIN to deactivate double park mode"
                    : "Enter your PIN to activate double park mode"}
                </p>

                <div className="space-y-2">
                  <Label htmlFor="pin">4-Digit PIN</Label>
                  <Input
                    id="pin"
                    type="password"
                    maxLength={4}
                    placeholder="Enter 4-digit PIN"
                    value={pin}
                    onChange={(e) => {
                      setPin(e.target.value)
                      setError("")
                    }}
                    className={error ? "border-[#F44336]" : ""}
                  />
                  {error && <p className="text-sm text-[#F44336]">{error}</p>}
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={isActive ? handleDeactivateConfirm : handlePinSubmit}
                    className={`w-full text-lg py-6 ${isActive ? "bg-[#F44336] hover:bg-[#d32f2f]" : "bg-[#00A86B] hover:bg-[#008f5b]"
                      }`}
                  >
                    {isActive ? "Deactivate" : "Activate"}
                    {isActive ? <ShieldOff className="ml-2 h-5 w-5" /> : <ShieldCheck className="ml-2 h-5 w-5" />}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowPinInput(false)
                      setPin("")
                      setError("")
                      if (!isActive) {
                        setShowPlateSelector(true)
                      }
                    }}
                    className="w-full border-[#00A86B] text-[#00A86B]"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {isActive && !showPinInput && (
              <div className="space-y-6">
                <div className="bg-[#F5F5F5] p-6 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-[#212121]">Status</h3>
                    <span className="bg-[#4CAF50] text-white px-3 py-1 rounded-full text-sm">Active</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-[#212121]">Car Plate:</span>
                      <span className="text-sm font-bold text-[#212121]">{plateNumber}</span>
                    </div>

                    {activeSince && (
                      <div className="flex justify-between">
                        <span className="text-sm text-[#212121]">Active for:</span>
                        <span className="text-sm font-bold text-[#212121] flex items-center">
                          <Clock className="mr-1 h-4 w-4 text-[#FFC107]" />
                          {formatDuration(activeSince)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-[#F5F5F5] p-6 rounded-lg">
                  <h3 className="font-bold text-[#212121] mb-2">What happens now?</h3>
                  <p className="text-sm text-[#212121]">
                    If someone is blocked by your car, they can scan your NFC sticker and you'll be notified immediately
                    to move your car.
                  </p>
                </div>

                <Button onClick={handleDeactivate} className="w-full bg-[#F44336] hover:bg-[#d32f2f] text-lg py-6">
                  Deactivate Double Park Mode
                  <ShieldOff className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-center border-t pt-6">
            <p className="text-sm text-[#212121]">
              {isActive ? "Remember to deactivate when you move your car" : "Need an NFC sticker? "}
              {!isActive && (
                <Link href="/car-owner/order" className="text-[#00A86B] hover:underline">
                  Order here
                </Link>
              )}
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
