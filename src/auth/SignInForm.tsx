import { useState } from "react";
import EyeCloseIcon from "../assets/icons/eye-close";
import EyeIcon from "../assets/icons/eye";
import Label from "../admin/components/form/Label";
import Input from "../admin/components/form/input/InputField";
import Checkbox from "../admin/components/form/input/Checkbox";
import Button from "../admin/components/ui/button/Button";

export default function SignInForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    return (
        <div className="flex flex-col flex-1">
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <div className="mb-2 sm:mb-8">
                        <h1 className="font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                            Sign In
                        </h1>
                    </div>
                    <div>
                        <form >
                            <div className="space-y-6">
                                <div>
                                    <Label>
                                        Email <span className="text-error-500">*</span>{" "}
                                    </Label>
                                    <Input placeholder="info@gmail.com" />
                                </div>
                                <div>
                                    <Label>
                                        Password <span className="text-error-500">*</span>{" "}
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                        />
                                        <span
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                        >
                                            {showPassword ? (
                                                <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                            ) : (
                                                <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Checkbox checked={isChecked} onChange={setIsChecked} />
                                        <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                                            Keep me logged in
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <Button className="w-full" size="sm">
                                        Sign in
                                    </Button>
                                </div>
                            </div>
                        </form>


                    </div>
                </div>
            </div>
        </div>
    );
}
