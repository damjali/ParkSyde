import Link from "next/link"
import { CheckCircle, Package, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function RegistrationSuccessPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] py-12">
      <div className="container mx-auto px-4">
        <Card className="max-w-md mx-auto shadow-lg">
          <CardHeader className="bg-[#4CAF50] text-white text-center rounded-t-lg">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16" />
            </div>
            <CardTitle className="text-2xl">Registration Successful!</CardTitle>
          </CardHeader>

          <CardContent className="pt-6 text-center">
            <p className="text-[#212121] mb-6">
              Your car has been successfully registered in our system. Now you need an NFC sticker to complete the
              setup.
            </p>

            <div className="bg-[#F5F5F5] p-6 rounded-lg mb-6 flex items-center">
              <Package className="h-10 w-10 text-[#00A86B] mr-4" />
              <div className="text-left">
                <h3 className="font-bold text-[#212121]">Order Your NFC Sticker</h3>
                <p className="text-sm text-[#212121]">Get your NFC sticker delivered to your doorstep.</p>
              </div>
            </div>

            <Link href="/car-owner/order">
              <Button className="w-full bg-[#00A86B] hover:bg-[#008f5b] text-lg py-6">
                Order NFC Sticker Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>

          <CardFooter className="flex justify-center border-t pt-6">
            <div className="text-center">
              <p className="text-sm text-[#212121] mb-4">Already have an NFC sticker?</p>
              <Link href="/car-owner/activate">
                <Button variant="outline" className="border-[#00A86B] text-[#00A86B]">
                  Activate Double Park Mode
                </Button>
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
