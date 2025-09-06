import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

// Reusable components
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://collaboro-backend.vercel.app/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.token) {
        // Store token & user in cookies
        Cookies.set("collaborox_token", data.token, { expires: 7, sameSite: "lax" });
        Cookies.set("collaborox_user", JSON.stringify(data.user), { expires: 7, sameSite: "lax" });

        navigate("/dashboard");
      } else {
        setError(data.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.email.includes("@") && formData.password.length >= 6;

const handleForgotPassword = () => {
  // Use js-cookie for consistency
  Cookies.set("forgotPassword", "true", { expires: 1/24 }); // 1 hour
  navigate("/forgot"); // Ensure /forgot route exists
};

  return (
    <div className="min-h-screen flex flex-col bg-gradient-subtle">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8 bg-gradient-surface border border-border/50 shadow-xl">
              <h2 className="text-2xl font-bold text-center mb-2">
                Login to your account test
              </h2>
              <p className="text-sm text-muted-foreground text-center mb-6">
                Or{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto text-sm font-medium"
                  onClick={() => navigate("/signup")}
                >
                  signup instead
                </Button>
              </p>

              {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-10"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Forgot password */}
                <div className="flex justify-end">
                  <Button 
                  onClick={handleForgotPassword}
                  variant="link" className="p-0 h-auto text-sm">
                    Forgot password?
                  </Button>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={!isFormValid || loading}
                >
                  {loading ? "Logging in..." : "Login"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
