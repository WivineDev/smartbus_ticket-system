import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import Alert from '../components/Alert';
import { useLanguage } from '../context/LanguageContext';

const Register = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        phoneNumber: ''
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
        if (!formData.fullName) newErrors.fullName = 'Full name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else {
            if (formData.password.length < 6) {
                newErrors.password = 'Password must be at least 6 characters';
            } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
                newErrors.password = 'Must have uppercase, lowercase and number';
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const response = await fetch('http://127.0.0.1:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                setAlert({ type: 'success', message: 'Registration successful!', show: true });
                setTimeout(() => navigate('/login'), 1500);
            } else {
                if (data.errors) {
                    const backendErrors = {};
                    data.errors.forEach(err => {
                        backendErrors[err.field] = err.message;
                    });
                    setErrors(backendErrors);
                }
                throw new Error(data.message || 'Registration failed');
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
                    <h1 className="text-4xl font-extrabold text-primary-600 mb-2 truncate">
                        {t('createAccount')}
                    </h1>
                    <p className="text-gray-500 font-medium">{t('joinToday')}</p>
                </div>

                {alert.show && (
                    <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ ...alert, show: false })} className="mb-6 rounded-xl animate-fadeIn" />
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label={t('fullName')}
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        error={errors.fullName}
                        placeholder="John Doe"
                        required
                        className="rounded-xl border-gray-200"
                    />
                    <Input
                        label={t('username')}
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        placeholder="john@example.com"
                        required
                        className="rounded-xl border-gray-200"
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
                        className="rounded-xl border-gray-200"
                    />

                    <Button type="submit" disabled={isSubmitting} className="w-full py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all mt-4">
                        {isSubmitting ? '...' : t('register')}
                    </Button>
                </form>

                <p className="mt-8 text-center text-gray-500 font-medium">
                    {t('alreadyHaveAccount')}{' '}
                    <Link to="/login" className="text-primary-600 font-bold hover:underline">
                        {t('login')}
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
