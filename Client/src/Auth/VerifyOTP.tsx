import React, { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { toast } from "sonner"
import { apiPatch } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import ClickSpark from "@/components/ClickSpark/ClickSpark"
import { cn } from "@/lib/utils"

export default function VerifyOTP() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const stateEmail = location.state?.email || localStorage.getItem("userEmail") || ""
  
  const [email, setEmail] = useState(stateEmail)
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [timer, setTimer] = useState(60)

  useEffect(() => {
    let interval: any
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timer])

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!email) {
      toast.error("Please specify your email address.")
      return
    }

    if (otp.length < 6) {
      toast.error("Please enter the complete 6-digit OTP code.")
      return
    }

    setLoading(true)

    try {
      const response = await apiPatch("/auth/verify", {
        email,
        otp: parseInt(otp, 10),
      })
      
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Invalid OTP code. Please check and try again.")
      }

      toast.success("Email verified successfully! You can now log in.")
      localStorage.removeItem("userEmail")
      navigate("/login")
    } catch (error: any) {
      console.error("Verification error:", error)
      toast.error(error.message || "Failed to verify OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!email) {
      toast.error("Please enter your email to resend OTP.")
      return
    }

    setResending(true)
    try {
      const response = await apiPatch("/auth/resendotp", { email })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend OTP")
      }

      toast.success("Verification code resent successfully! Check your inbox.")
      setTimer(60)
      setOtp("")
    } catch (error: any) {
      console.error("Resend error:", error)
      toast.error(error.message || "Failed to resend verification code.")
    } finally {
      setResending(false)
    }
  }

  return (
    <ClickSpark
      className="z-[9999]"
      sparkColor="#000000"
      sparkSize={10}
      sparkRadius={18}
      sparkCount={10}
      duration={300}
    >
      <div className="bg-white text-black min-h-screen flex flex-col items-center justify-center w-full p-4">
        <div className="flex flex-col gap-6 w-full max-w-sm">
          <Card className="shadow-none border-none bg-transparent">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Enter verification code</CardTitle>
              <CardDescription>We sent a 6-digit code to your email.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVerify}>
                <div className="flex flex-col items-center gap-6">
                  {!stateEmail && (
                    <div className="w-full mb-4">
                      <Label htmlFor="email" className="text-sm font-semibold mb-2 block text-left">
                        Email Address
                      </Label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Enter your email"
                      />
                    </div>
                  )}

                  <div className="flex flex-col items-center gap-2 w-full">
                    <Label htmlFor="otp" className="sr-only">Verification code</Label>
                    <InputOTP maxLength={6} id="otp" required value={otp} onChange={setOtp}>
                      <InputOTPGroup className="flex w-full justify-center gap-2.5">
                        <InputOTPSlot index={0} className="rounded-md border" />
                        <InputOTPSlot index={1} className="rounded-md border" />
                        <InputOTPSlot index={2} className="rounded-md border" />
                        <InputOTPSlot index={3} className="rounded-md border" />
                        <InputOTPSlot index={4} className="rounded-md border" />
                        <InputOTPSlot index={5} className="rounded-md border" />
                      </InputOTPGroup>
                    </InputOTP>
                    <p className="text-sm text-muted-foreground text-center mt-2">
                      Enter the 6-digit code sent to your email.
                    </p>
                  </div>

                  <Button className="w-full max-w-[200px]" type="submit" disabled={loading || otp.length < 6}>
                    {loading ? "Verifying..." : "Verify"}
                  </Button>

                  <div className="text-center text-sm text-muted-foreground flex items-center justify-center gap-1">
                    Didn't receive the code?{" "}
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={resending || timer > 0}
                      className={cn(
                        "text-blue-600 hover:underline p-0 bg-transparent border-none cursor-pointer",
                        (resending || timer > 0) && "text-gray-400 hover:no-underline cursor-not-allowed opacity-70"
                      )}
                    >
                      {resending ? "Sending..." : timer > 0 ? `Resend in ${timer}s` : "Resend"}
                    </button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </ClickSpark>
  )
}
