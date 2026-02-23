import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import Alert from '../components/Alert';
import { useLanguage } from '../context/LanguageContext';

const Login = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [alert, setAlert] = useState({ type: '', message: '', show: false });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const response = await fetch('http://127.0.0.1:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('user', JSON.stringify(data.data));
                setAlert({ type: 'success', message: 'Login successful!', show: true });
                setTimeout(() => navigate('/'), 1500);
            } else {
                throw new Error(data.message || 'Login failed');
            }
        } catch (error) {
            setAlert({ type: 'error', message: error.message, show: true });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-10">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-extrabold text-primary-600 mb-2 uppercase tracking-tight">
                        {t('brand')}
                    </h1>
                    <p className="text-gray-500 font-medium">{t('welcomeBack')}</p>
                </div>

                {alert.show && (
                    <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ ...alert, show: false })} className="mb-6 rounded-xl animate-fadeIn" />
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label={t('username')}
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        placeholder="admin@smartbus.com"
                        required
                        className="rounded-xl border-gray-200 focus:ring-primary-500"
                    />
                    <Input
                        label={t('password')}
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                        placeholder="••••••••"
                        required
                        className="rounded-xl border-gray-200 focus:ring-primary-500"
                    />

                    <Button type="submit" disabled={isSubmitting} className="w-full py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all">
                        {isSubmitting ? '...' : t('login')}
                    </Button>
                </form>

                <p className="mt-8 text-center text-gray-500 font-medium">
                    {t('dontHaveAccount')}{' '}
                    <Link to="/register" className="text-primary-600 font-bold hover:underline">
                        {t('register')}
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
