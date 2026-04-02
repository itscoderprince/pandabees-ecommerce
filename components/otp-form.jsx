"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { ArrowLeft, RefreshCw } from "lucide-react";

import {
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import UIButton from "./shared/UIButton";
import { verifyOtpSchema } from "@/lib/zSchema";

export function InputOTPForm({ email, onSubmit, onBack }) {
    const [resending, setResending] = useState(false);
    const [timer, setTimer] = useState(60);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(verifyOtpSchema),
        defaultValues: {
            otp: "",
            email: email,
        },
    });

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleResend = async () => {
        if (timer > 0 || resending) return;
        setResending(true);
        try {
            const res = await axios.post("/api/auth/login", { email, resend: true });
            if (res.data.success) {
                toast.success("Verification code resent!");
                setTimer(60);
            }
        } catch (error) {
            toast.error("Failed to resend code. Please try again.");
        } finally {
            setResending(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <CardHeader className="text-center sm:text-start pb-4">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onBack}
                        className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-muted-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </button>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Verification Step</span>
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight text-zinc-900">Check your email</CardTitle>
                <CardDescription className="text-sm leading-relaxed pt-2">
                    A security code was sent to <span className="font-semibold text-zinc-900">{email}</span>.
                    Please enter it to verify your account.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-10 pt-4">
                <div className="flex flex-col items-center gap-6">
                    <Controller
                        name="otp"
                        control={control}
                        render={({ field }) => (
                            <InputOTP
                                maxLength={6}
                                value={field.value}
                                onChange={field.onChange}
                                disabled={isSubmitting}
                                id="otp-verification"
                            >
                                <InputOTPGroup>
                                    {[...Array(6)].map((_, i) => (
                                        <InputOTPSlot
                                            key={i}
                                            index={i}
                                            className="h-12 w-12 sm:h-14 sm:w-14 text-lg font-bold shadow-sm"
                                        />
                                    ))}
                                </InputOTPGroup>
                            </InputOTP>
                        )}
                    />

                    {errors.otp && (
                        <p className="text-destructive text-xs font-semibold">
                            {errors.otp.message}
                        </p>
                    )}
                </div>

                <div className="flex flex-col items-center gap-2 border-t border-zinc-100 pt-8">
                    <p className="text-[13px] text-muted-foreground font-medium">Didn&apos;t receive the code?</p>
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={timer > 0 || resending}
                        className="text-sm font-semibold text-violet-600 hover:text-violet-700 hover:underline transition-color disabled:text-zinc-300 disabled:no-underline"
                    >
                        {resending ? (
                            <span className="flex items-center gap-2">
                                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                Sending...
                            </span>
                        ) : (
                            timer > 0 ? `Resend in ${timer}s` : "Send code again"
                        )}
                    </button>
                </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 pt-6 pb-2">
                <UIButton
                    type="submit"
                    loading={isSubmitting}
                    className="w-full h-12 rounded-xl text-lg font-bold"
                >
                    Verify Account
                </UIButton>
                <p className="w-full text-center text-[11px] font-medium text-muted-foreground/80 px-4">
                    Security check: Verification code expires in 10 minutes.
                </p>
            </CardFooter>
        </form>
    );
}


