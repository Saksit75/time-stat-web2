'use client';
import { useEffect, useState } from "react";
import Axios from "@/lib/axios";
import axios from "axios";
import { User, GraduationCap, FileText, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useAppStore } from "@/store/appState";

const LoginPage = () => {
    const isDark = useAppStore((state) => state.isDark); //ป้องกัน store ใหญ่ จะบบจะได้ดึงจัวที่ต้องการมาใช้เท่านั้น 
    const setTheme = useAppStore((state) => state.setTheme);
    const [onSubmit, setOnSubmit] = useState(false);
    const [connection, setConnection] = useState(false);

    useEffect(() => {
        const themeStore = localStorage.getItem('isDark') === 'true';
        setTheme(themeStore)
    }, [setTheme]);

    const router = useRouter();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleShowPassword = () => setShowPassword(prev => !prev);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { username, password } = formData;
        login(username, password);

    };
    const login = async (username: string, password: string) => {
        Swal.fire({
            title: 'กำลังเข้าสู่ระบบ...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
            theme: isDark ? 'dark' : 'light',
        });

        try {
            const response = await Axios.post('/login', { username, password });
            Swal.close();

            if (response.status === 200) {
                const { access_token } = response.data.data;
                console.log('Login successful : ', access_token);
                localStorage.setItem('access_token', access_token);
                Axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
                router.push('/');
                router.refresh();
            }
        } catch (err: any) {
            Swal.close();
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: err.response?.data?.message || 'ไม่สามารถเข้าสู่ระบบได้',
                theme: isDark ? 'dark' : 'light',
                confirmButtonText: 'ตกลง'
            });
        }
    };

    useEffect(() => {
        const fetchHello = async () => {
            try {
                const response = await Axios.get('/');
                setConnection(true);
                console.log(response.data);
            } catch (error) {

                Swal.fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด',
                    theme: isDark ? 'dark' : 'light',
                    text: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้"
                })
                console.error("Connection error:", error);
                setConnection(false);
            }
        }
        fetchHello();
    }, []);

    return (
        <div className="container mx-auto p-4 min-h-screen flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2 justify-center">
                <form
                    className="flex flex-col bg-base-100 rounded-lg shadow-xl overflow-hidden w-full max-w-3xl"
                    onSubmit={handleSubmit}
                >
                    {/* Title Bar */}
                    <div className="bg-gradient-to-r from-primary to-secondary p-6 flex flex-col gap-1">
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <User className="w-8 h-8" />
                            เข้าสู่ระบบ
                        </h1>
                        <p className="text-white/80">กรุณากรอกชื่อผู้ใช้และรหัสผ่าน</p>
                    </div>

                    {/* Form Section */}
                    <div className="p-8 flex flex-col gap-8 bg-base-300">
                        <div className="p-8 flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold flex items-center gap-2">
                                    <User className="w-5 h-5" /> ชื่อผู้ใช้ <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    className="bg-base-100 p-2 rounded border w-full"
                                    required
                                    onChange={inputChange}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="font-semibold flex items-center gap-2">
                                    <Lock className="w-5 h-5" /> รหัสผ่าน <span className="text-red-500">*</span>
                                </label>

                                {/* password input with toggle */}
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        className="bg-base-100 p-2 rounded border w-full pr-12" // padding-right for icon
                                        required
                                        onChange={inputChange}
                                        aria-label="รหัสผ่าน"
                                    />
                                    <button
                                        type="button"
                                        onClick={toggleShowPassword}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded focus:outline-none"
                                        aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary !rounded-box w-full"
                                disabled={onSubmit || !connection}

                            >
                                {onSubmit && <span className="loading loading-spinner"></span>}
                                {onSubmit ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
                            </button>

                        </div>
                    </div>
                </form>

                {/* Helper Text */}
                <div className="flex justify-center text-sm text-gray-500">
                    <span className="text-red-500">*</span> ระบุข้อมูลที่จำเป็นต้องกรอก
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
