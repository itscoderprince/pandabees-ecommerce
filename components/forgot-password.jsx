"use client"

import { cn } from "@/lib/utils"
import UIButton from "./shared/UIButton"
import { WEBSITE_ROUTES } from "@/routes/Website.Route";
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
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { forgotPasswordSchema, resetPasswordSchema } from "@/lib/zSchema"
import { Mail, ArrowLeft, Lock, EyeClosed, EyeIcon, KeyRound } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import axios from "axios"
import { useRouter } from "next/navigation"

export function ForgotPasswordForm({
    className,
    ...props
}) {
    const router = useRouter()
    const [phase, setPhase] = useState("email") // "email" or "reset"
    const [email, setEmail] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    // Form for Phase 1: Request OTP
    const emailForm = useForm({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: "" },
    })

    // Form for Phase 2: Reset Password
    const resetForm = useForm({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { email: "", otp: "", newPassword: "", confirmPassword: "" },
    })

    // Step 1: Handle Email Submission
    const onEmailSubmit = async (data) => {
        try {
            const res = await axios.post("/api/auth/forgot-password", data);
            if (res.data.success) {
                toast.success(res.data.message);
                setEmail(data.email);
                resetForm.setValue("email", data.email);
                setPhase("reset");
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            console.error("forgot password error:", err);
            const errorMessage = err.response?.data?.message || "Something went wrong.";
            toast.error(errorMessage);
        }
    };

    // Step 2: Handle Final Password Reset
    const onResetSubmit = async (data) => {
        try {
            const res = await axios.post("/api/auth/reset-password/update-password", data);
            if (res.data.success) {
                toast.success("Password reset successful! Redirecting to login...");
                setTimeout(() => router.push("/auth/login"), 2000);
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            console.error("reset password error:", err);
            const errorMessage = err.response?.data?.message || "Something went wrong.";
            toast.error(errorMessage);
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden border-zinc-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                {phase === "email" ? (
                    <>
                        <CardHeader className="space-y-1 text-start">
                            <div className="flex items-center gap-2 mb-2">
                                <a href={WEBSITE_ROUTES.AUTH.LOGIN} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                                    <ArrowLeft className="size-4 text-muted-foreground" />
                                </a>

                                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Go Back</span>
                            </div>
                            <CardTitle className="text-2xl font-bold tracking-tight">Forgot Password</CardTitle>
                            <CardDescription>
                                Enter your email to receive a 6-digit verification code
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                                <FieldGroup>
                                    <Field>
                                        <FieldLabel htmlFor="email" className="text-sm font-medium">Email Address</FieldLabel>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="name@example.com"
                                                {...emailForm.register("email")}
                                                className={cn("pl-10", emailForm.formState.errors.email && "border-destructive")}
                                            />
                                        </div>
                                        {emailForm.formState.errors.email && (
                                            <p className="text-destructive text-xs font-medium mt-1">{emailForm.formState.errors.email.message}</p>
                                        )}
                                    </Field>
                                    <Field className="pt-2">
                                        <UIButton type="submit" loading={emailForm.formState.isSubmitting} className="w-full h-11">
                                            Send Reset OTP
                                        </UIButton>
                                    </Field>
                                </FieldGroup>
                            </form>
                        </CardContent>
                    </>
                ) : (
                    <>
                        <CardHeader className="space-y-1 text-start">
                            <div className="flex items-center gap-2 mb-2">
                                <button onClick={() => setPhase("email")} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                                    <ArrowLeft className="size-4 text-muted-foreground" />
                                </button>
                                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Change Email</span>
                            </div>
                            <CardTitle className="text-2xl font-bold tracking-tight">Set New Password</CardTitle>
                            <CardDescription>
                                We've sent a code to <span className="font-semibold text-foreground">{email}</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-5">
                                <FieldGroup>
                                    {/* OTP FIELD */}
                                    <Field>
                                        <FieldLabel className="text-sm font-medium mb-2">Verification Code</FieldLabel>
                                        <Controller
                                            name="otp"
                                            control={resetForm.control}
                                            render={({ field }) => (
                                                <InputOTP maxLength={6} {...field} className="gap-2">
                                                    <InputOTPGroup className="w-full justify-between gap-2">
                                                        {[...Array(6)].map((_, i) => (
                                                            <InputOTPSlot key={i} index={i} className="flex-1 h-12 border-zinc-200 rounded-md" />
                                                        ))}
                                                    </InputOTPGroup>
                                                </InputOTP>
                                            )}
                                        />
                                        {resetForm.formState.errors.otp && (
                                            <p className="text-destructive text-xs font-medium mt-1">{resetForm.formState.errors.otp.message}</p>
                                        )}
                                    </Field>

                                    {/* NEW PASSWORD */}
                                    <Field>
                                        <FieldLabel htmlFor="newPassword text-sm font-medium">New Password</FieldLabel>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                            <Input
                                                id="newPassword"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                {...resetForm.register("newPassword")}
                                                className={cn("pl-10 pr-10", resetForm.formState.errors.newPassword && "border-destructive")}
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-0 top-0 h-full w-10 flex items-center justify-center text-muted-foreground"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeClosed className="size-4" /> : <EyeIcon className="size-4" />}
                                            </button>
                                        </div>
                                        {resetForm.formState.errors.newPassword && (
                                            <p className="text-destructive text-xs font-medium mt-1">{resetForm.formState.errors.newPassword.message}</p>
                                        )}
                                    </Field>

                                    {/* CONFIRM PASSWORD */}
                                    <Field>
                                        <FieldLabel htmlFor="confirmPassword text-sm font-medium">Confirm Password</FieldLabel>
                                        <div className="relative">
                                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                            <Input
                                                id="confirmPassword"
                                                type="password"
                                                placeholder="••••••••"
                                                {...resetForm.register("confirmPassword")}
                                                className={cn("pl-10", resetForm.formState.errors.confirmPassword && "border-destructive")}
                                            />
                                        </div>
                                        {resetForm.formState.errors.confirmPassword && (
                                            <p className="text-destructive text-xs font-medium mt-1">{resetForm.formState.errors.confirmPassword.message}</p>
                                        )}
                                    </Field>

                                    <Field className="pt-4">
                                        <UIButton type="submit" loading={resetForm.formState.isSubmitting} className="w-full h-11">
                                            Update Password
                                        </UIButton>
                                    </Field>
                                </FieldGroup>
                            </form>
                        </CardContent>
                    </>
                )}
            </Card>
        </div>
    )
}


