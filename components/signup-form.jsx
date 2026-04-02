"use client";

import { cn } from "@/lib/utils";
import UIButton from "./shared/UIButton"
import { WEBSITE_ROUTES } from "@/routes/Website.Route";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import GoogleButton from "./shared/googleButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/zSchema";
import { User, Mail, Lock, EyeClosed, EyeIcon } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export function SignupForm({ className, ...props }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });


    const onSubmit = async (data) => {
        try {
            const res = await axios.post("/api/auth/register", data);
            if (res.data.success) {
                toast.success(res.data.message);
                reset();
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            console.error("Signup error:", err);
            const errorMessage = err.response?.data?.message || "Something went wrong. Please try again.";
            toast.error(errorMessage);
        }
    };


    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden border-zinc-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <CardHeader className="text-center space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight">Create your account</CardTitle>
                    <CardDescription>
                        Enter your details to join the PandaBees community
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FieldGroup className="sm:gap-6">
                            <Field>
                                <FieldLabel htmlFor="name" className="text-sm font-medium">
                                    Full Name
                                </FieldLabel>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="John Doe"
                                        {...register("name")}
                                        className={cn(
                                            "pl-10",
                                            errors.name && "border-destructive focus-visible:ring-destructive",
                                        )}
                                    />
                                </div>
                                {errors.name && (
                                    <p className="text-destructive text-xs font-medium mt-1">
                                        {errors.name.message}
                                    </p>
                                )}
                            </Field>
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
                                            errors.email && "border-destructive focus-visible:ring-destructive",
                                        )}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-destructive text-xs font-medium mt-1">
                                        {errors.email.message}
                                    </p>
                                )}
                            </Field>
                            <Field className="grid sm:grid-cols-2 gap-4">
                                <Field>
                                    <FieldLabel htmlFor="password" className="text-sm font-medium">
                                        Password
                                    </FieldLabel>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            {...register("password")}
                                            className={cn(
                                                "pl-10 pr-10",
                                                errors.password && "border-destructive focus-visible:ring-destructive",
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
                                <Field>
                                    <FieldLabel htmlFor="confirmPassword" className="text-sm font-medium">
                                        Confirm
                                    </FieldLabel>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            {...register("confirmPassword")}
                                            className={cn(
                                                "pl-10 pr-10",
                                                errors.confirmPassword && "border-destructive focus-visible:ring-destructive",
                                            )}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-0 top-0 h-full w-10 flex items-center justify-center text-muted-foreground hover:text-foreground"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeClosed className="size-4" />
                                            ) : (
                                                <EyeIcon className="size-4" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="text-destructive text-xs font-medium mt-1">
                                            {errors.confirmPassword.message}
                                        </p>
                                    )}
                                </Field>
                            </Field>
                            <Field className="pt-2">
                                <UIButton 
                                    type="submit" 
                                    className="w-full h-11"
                                    loading={isSubmitting}
                                >
                                    Create account
                                </UIButton>
                            </Field>
                            <FieldSeparator className="text-xs font-medium uppercase text-muted-foreground">Or sign up with</FieldSeparator>
                            <Field>
                                <GoogleButton className="w-full border-zinc-200" />
                                <p className="text-center text-sm text-muted-foreground mt-6">
                                    Already have an account?{" "}
                                    <a href={WEBSITE_ROUTES.AUTH.LOGIN} className="font-semibold text-primary hover:underline underline-offset-4">
                                        Sign in
                                    </a>
                                </p>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
            <p className="px-8 text-center text-xs leading-loose text-muted-foreground">
                By clicking continue, you agree to our{" "}
                <a href="#" className="underline underline-offset-4 hover:text-primary">Terms of Service</a>{" "}
                and{" "}
                <a href="#" className="underline underline-offset-4 hover:text-primary">Privacy Policy</a>.
            </p>
        </div>
    );
}

