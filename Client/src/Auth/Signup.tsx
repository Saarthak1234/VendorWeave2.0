import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "sonner"
import { apiPost } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ClickSpark from "@/components/ClickSpark/ClickSpark"

export default function Signup() {
  const [name, setName] = useState("")
  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.")
      return
    }

    setLoading(true)

    try {
      const response = await apiPost("/auth/signup", {
        name,
        email,
        password,
        userName,
      })
      
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to create account")
      }

      toast.success("Account created successfully! An OTP has been sent to your email.")
      localStorage.setItem("userEmail", email)
      navigate("/verify-otp", { state: { email } })
    } catch (error: any) {
      console.error("Signup error:", error)
      toast.error(error.message || "Failed to create account. Please try again.")
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
              <CardTitle className="text-xl">Create an account</CardTitle>
              <CardDescription>
                Enter your information below to create your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      required
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="JohnDoe"
                      required
                      name="username"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>
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
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <p className="text-[0.8rem] text-muted-foreground">
                      Must be at least 8 characters long.
                    </p>
                  </div>
                  <Button type="submit" disabled={loading} className="w-full mt-2">
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>
                </div>
              </form>
              <div className="text-center text-sm text-muted-foreground mt-6">
                Already have an account? <Link to="/login" className="underline underline-offset-4">Sign in</Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ClickSpark>
  )
}
