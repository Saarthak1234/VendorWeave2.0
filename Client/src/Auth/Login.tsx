import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "sonner"
import { apiPost } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import ClickSpark from "@/components/ClickSpark/ClickSpark"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await apiPost("/auth/login", { email, password })
      const data = await response.json()

      if (!response.ok) {
        if (data.message && data.message.toLowerCase().includes("not verified")) {
          toast.warning("Your email is not verified yet. Redirecting to OTP verification...")
          try {
            await apiPost("/auth/resendotp", { email })
          } catch (err) {
            console.error("Failed to auto-resend OTP", err)
          }
          localStorage.setItem("userEmail", email)
          navigate("/verify-otp", { state: { email } })
          return
        }
        throw new Error(data.message || "Failed to log in")
      }

      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      localStorage.removeItem("activeFirm")

      toast.success(`Welcome back, ${data.user.name || "User"}!`)
      navigate("/dashboard")
    } catch (error: any) {
      console.error("Login error:", error)
      toast.error(error.message || "Invalid credentials. Please try again.")
    } finally {
      setLoading(false)
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
              <CardTitle className="text-xl">Welcome back</CardTitle>
              <CardDescription>
                Login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                        Forgot your password?
                      </a>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      required
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Signing in..." : "Login"}
                  </Button>
                </div>
              </form>
              <div className="text-center text-sm text-muted-foreground mt-6">
                Don't have an account? <Link to="/signup" className="underline underline-offset-4">Sign up</Link>
              </div>
            </CardContent>
          </Card>
          <div className="px-6 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our <a href="#" className="underline">Terms of Service</a>{" "}
            and <a href="#" className="underline">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </ClickSpark>
  )
}
