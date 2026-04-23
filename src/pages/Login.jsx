import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, BookOpen } from 'lucide-react';
import { Input, Button } from '../components/FormComponents';
import api from '../api/axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await api.post('/api/v1/auth/login', {
                email,
                password
            });

            if (response.data?.status === 200) {
                const { token, name, role } = response.data.data;
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify({ name, role }));
                
                // Redirect to dashboard
                navigate('/dashboard');
                window.location.reload(); // Refresh to update layout/state if needed
            } else {
                setError(response.data?.message || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans border border-rose-500">
            {/* Background design elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-700"></div>
            </div>

            <div className="w-full max-w-md z-10">
                {/* Logo Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 mb-4 animate-bounce">
                        <BookOpen size={32} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">DLMS</h1>
                    <p className="text-slate-500 text-sm mt-1">Digital Library Management System</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl shadow-slate-200/50 border border-white">
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-slate-900">Welcome back</h2>
                        <p className="text-slate-500 text-sm">Please enter your details to sign in</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold rounded-lg flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-1.5 shrink-0"></span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                required
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-all" />
                                <span className="text-slate-600 group-hover:text-slate-900 transition-colors">Remember me</span>
                            </label>
                            <a href="#" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">Forgot password?</a>
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full py-3 h-auto text-[14px] font-bold shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>
                </div>

                <div className="text-center mt-8 p-4">
                    <p className="text-slate-500 text-xs">
                        &copy; {new Date().getFullYear()} DLMS. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
