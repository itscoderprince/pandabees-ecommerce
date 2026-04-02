"use client"

import { LogOutIcon } from "lucide-react";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { useDispatch } from "react-redux";
import { logout } from "@/store/reducer/authReducer";
import axios from "axios";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    const handleLogout = async (e) => {
        e.preventDefault();

        try {
            const { data } = await axios.post("/api/auth/logout");
            if (data.success) {
                // 1. Clear Redux State
                dispatch(logout());

                // 2. Perform a full refresh or redirect to clear all contexts
                window.location.href = "/auth/login";
            }
        } catch (error) {
            console.error("Logout process failed:", error);
        }
    };

    return (
        <DropdownMenuItem
            onClick={handleLogout}
            className="text-red-500 dark:text-red-400 focus:bg-red-500 focus:text-white dark:focus:bg-red-500 dark:focus:text-white cursor-pointer transition-all duration-200 gap-2 font-medium"
        >
            <LogOutIcon className="size-4" />
            <span>Log out</span>
        </DropdownMenuItem>
    );

};


export default LogoutButton;