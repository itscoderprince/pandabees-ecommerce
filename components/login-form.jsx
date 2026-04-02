"use client"

import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import GoogleButton from "./shared/googleButton"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema } from "@/lib/zSchema"
import { Mail, Lock, EyeClosed, EyeIcon } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import axios from "axios"
import { InputOTPForm } from "./otp-form"
import { useRouter, useSearchParams } from "next/navigation"
import { useDispatch } from "react-redux"
import { login } from "@/store/reducer/authReducer"
import UIButton from "./shared/UIButton"
import { WEBSITE_ROUTES } from "@/routes/Website.Route"
import { ADMIN_ROUTES } from "@/routes/Admin.Route"



export function LoginForm({
  className,
  ...props
}) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [otpEmail, setOtpEmail] = useState()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },

  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const dispatch = useDispatch()

  // Phase 1: Initial Login (Email/Password)
  const onSubmit = async (data) => {
    try {
      const res = await axios.post("/api/auth/login", data);
      if (res.data.success) {
        toast.success(res.data.message);
        setOtpEmail(data.email)
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error("login error:", err);
      const errorMessage = err.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(errorMessage);
    }
  };

  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || ""

  // Phase 2: OTP Verification
  const handleOtpVerification = async (data) => {
    try {
      const res = await axios.post("/api/auth/verify-otp", data);
      console.log(res);

      if (res.data.success) {
        toast.success("Login successful! Redirecting...");

        // Dispatch to Redux Store
        const userData = res.data.data.user;
        dispatch(login(userData));
        reset();

        // REDIRECTION LOGIC
        // 1. Prioritize callbackUrl if present
        // 2. Fallback to Role-based (Admin -> ADMIN_ROUTES.DASHBOARD, User -> WEBSITE_ROUTES.HOME)
        const redirectPath = callbackUrl || (userData.role === "admin" ? ADMIN_ROUTES.DASHBOARD : WEBSITE_ROUTES.HOME);

        // Delay slightly for UX before redirecting
        setTimeout(() => {
          router.push(redirectPath);
          router.refresh();
        }, 1500);
      } else {
        toast.error(res.data.message || "Invalid or expired code.");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      const errorMessage = err.response?.data?.message || "Invalid or expired code.";
      toast.error(errorMessage);
    }
  }


  const handleBack = () => {
    setOtpEmail(null);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden border-zinc-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        {
          !otpEmail ?
            <>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </FieldLabel>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="name@example.com"
                          {...register("email")}
                          className={cn(
                            "pl-10",
                            errors.email && "border-destructive focus-visible:ring-destructive"
                          )}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-destructive text-xs font-medium mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </Field>
                    <Field>
                      <div className="flex items-center justify-between">
                        <FieldLabel htmlFor="password" className="text-sm font-medium">
                          Password
                        </FieldLabel>
                        <a
                          href={WEBSITE_ROUTES.AUTH.RESET_PASSWORD}
                          className="text-xs font-medium text-primary hover:underline underline-offset-4">
                          Forgot password?
                        </a>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...register("password")}
                          className={cn(
                            "pl-10 pr-10",
                            errors.password && "border-destructive focus-visible:ring-destructive"
                          )}
                        />
                        <button
                          type="button"
                          className="absolute right-0 top-0 h-full w-10 flex items-center justify-center text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? (
                            <EyeClosed className="size-4" />
                          ) : (
                            <EyeIcon className="size-4" />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-destructive text-xs font-medium mt-1">
                          {errors.password.message}
                        </p>
                      )}
                    </Field>
                    <Field className="pt-2">
                      <UIButton type="submit" loading={isSubmitting} className="w-full h-11">
                        Continue
                      </UIButton>
                    </Field>
                    <FieldSeparator className="text-xs font-medium uppercase text-muted-foreground">Or continue with</FieldSeparator>
                    <Field>
                      <GoogleButton className="w-full border-zinc-200" />
                      <p className="text-center text-sm text-muted-foreground mt-6">
                        Don&apos;t have an account?{" "}
                        <a href={WEBSITE_ROUTES.AUTH.REGISTER} className="font-semibold text-primary hover:underline underline-offset-4">
                          Create account
                        </a>
                      </p>
                    </Field>
                  </FieldGroup>
                </form>
              </CardContent>
            </>
            :

            <InputOTPForm
              email={otpEmail}
              onSubmit={handleOtpVerification}
              onBack={handleBack}
            />
        }
      </Card>
    </div>
  );
}
