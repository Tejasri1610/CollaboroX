import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

// Reusable components
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ForgotPassword() {
  const [step, setStep] = useState<"email" | "reset">("email");
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setStep("reset");
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setError("");
    // Mock save — just go back to login
    navigate("/login");
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
                Forgot Password
              </h2>
              <p className="text-sm text-muted-foreground text-center mb-6">
                Reset your password in two quick steps.
              </p>

              {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

              {step === "email" && (
                <form onSubmit={handleEmailSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
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
                  <Button type="submit" className="w-full" size="lg">
                    Verify Email
                  </Button>
                  <Button
                    variant="link"
                    className="w-full text-sm"
                    onClick={() => navigate("/login")}
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back to Login
                  </Button>
                </form>
              )}

              {step === "reset" && (
                <form onSubmit={handleResetSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Enter new password"
                      value={formData.newPassword}
                      onChange={(e) =>
                        setFormData({ ...formData, newPassword: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" size="lg">
                    <Save className="h-4 w-4 mr-2" /> Save & Login
                  </Button>
                </form>
              )}
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
