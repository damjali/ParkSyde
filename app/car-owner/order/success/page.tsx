import Link from "next/link"
import { CheckCircle, Truck, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] py-12">
      <div className="container mx-auto px-4">
        <Card className="max-w-md mx-auto shadow-lg">
          <CardHeader className="bg-[#4CAF50] text-white text-center rounded-t-lg">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16" />
            </div>
            <CardTitle className="text-2xl">Order Placed Successfully!</CardTitle>
          </CardHeader>

          <CardContent className="pt-6 text-center">
            <p className="text-[#212121] mb-6">
              Your NFC sticker order has been placed successfully. You will receive it within 3-5 business days.
            </p>

            <div className="bg-[#F5F5F5] p-6 rounded-lg mb-6">
              <div className="flex items-center justify-center mb-4">
                <Truck className="h-10 w-10 text-[#00A86B]" />
              </div>
              <h3 className="font-bold text-[#212121] mb-2">Order Details</h3>
              <p className="text-sm text-[#212121]">
                Order Number: <span className="font-bold">NFC-{Math.floor(100000 + Math.random() * 900000)}</span>
              </p>
              <p className="text-sm text-[#212121]">
                Estimated Delivery: <span className="font-bold">3-5 business days</span>
              </p>
            </div>

            <div className="bg-[#F5F5F5] p-6 rounded-lg mb-6">
              <h3 className="font-bold text-[#212121] mb-2">What's Next?</h3>
              <p className="text-sm text-[#212121]">
                Once you receive your NFC sticker, place it on your windshield as per the installation guide. Then
                activate your double park mode when needed.
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex justify-center border-t pt-6">
            <div className="space-y-4 w-full">
              <Link href="/car-owner/activate">
                <Button className="w-full bg-[#00A86B] hover:bg-[#008f5b]">
                  Go to Activation Page
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              <Link href="/">
                <Button variant="outline" className="w-full border-[#00A86B] text-[#00A86B]">
                  Return to Home
                </Button>
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
