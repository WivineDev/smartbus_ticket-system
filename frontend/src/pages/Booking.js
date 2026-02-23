import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import Alert from '../components/Alert';
import { useLanguage } from '../context/LanguageContext';

const Booking = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    departureLocation: '',
    destination: '',
    travelDate: '',
    ticketType: 'economy'
  });

  const [bookingId, setBookingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ type: '', message: '', show: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (location.state) {
      setFormData(prev => ({
        ...prev,
        departureLocation: location.state.departureLocation || '',
        destination: location.state.destination || '',
        travelDate: location.state.travelDate || ''
      }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.departureLocation) newErrors.departureLocation = 'Departure location is required';
    if (!formData.destination) newErrors.destination = 'Destination is required';
    if (!formData.travelDate) newErrors.travelDate = 'Travel date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setBookingId(data.data.bookingId);
        setAlert({
          type: 'success',
          message: `Booking created successfully! Your Booking ID: #${data.data.bookingId}. Your ticket is being sent to your email and you can also download it below.`,
          show: true
        });

        setFormData({
          fullName: '',
          email: '',
          phoneNumber: '',
          departureLocation: '',
          destination: '',
          travelDate: '',
          ticketType: 'economy'
        });
      } else {
        throw new Error(data.message || 'Failed to create booking');
      }

    } catch (error) {
      setAlert({
        type: 'error',
        message: error.message || 'Failed to send booking request.',
        show: true
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-primary-600 px-8 py-10 text-white text-center">
          <h1 className="text-4xl font-extrabold mb-3 tracking-tight">{t('bookYourTicket')}</h1>
          <p className="opacity-90 font-medium text-lg">{t('heroSubtitle')}</p>
        </div>

        <div className="p-8 md:p-12">
          {alert.show && (
            <div className="mb-8">
              <Alert
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert({ ...alert, show: false })}
                className="rounded-2xl animate-fadeIn"
              />
              {alert.type === 'success' && bookingId && (
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => window.open(`http://127.0.0.1:5000/api/bookings/${bookingId}/download`)}
                    className="flex items-center space-x-2 bg-primary-100 text-primary-600 px-6 py-3 rounded-2xl font-bold hover:bg-primary-200 transition-all border-2 border-primary-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    <span>Download PDF Ticket</span>
                  </button>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center text-sm">1</span>
                <span>{t('personalInformation')}</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label={t('fullName')}
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  error={errors.fullName}
                  placeholder="John Doe"
                  required
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
                />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center text-sm">2</span>
                <span>{t('contactDetails')}</span>
              </h2>
              <Input
                label={t('phoneNumber')}
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                error={errors.phoneNumber}
                placeholder="+250 7XX XXX XXX"
                required
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center text-sm">3</span>
                <span>{t('travelDetails')}</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Input
                  label={t('departureLocation')}
                  name="departureLocation"
                  value={formData.departureLocation}
                  onChange={handleChange}
                  error={errors.departureLocation}
                  placeholder={t('placeholderFrom')}
                  required
                />
                <Input
                  label={t('destination')}
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  error={errors.destination}
                  placeholder={t('placeholderTo')}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label={t('travelDate')}
                  type="date"
                  name="travelDate"
                  value={formData.travelDate}
                  onChange={handleChange}
                  error={errors.travelDate}
                  required
                />
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                    {t('ticketType')}
                  </label>
                  <select
                    name="ticketType"
                    value={formData.ticketType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="economy">{t('economy')}</option>
                    <option value="business">{t('business')}</option>
                    <option value="premium">{t('premium')}</option>
                  </select>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 text-xl font-extrabold rounded-2xl shadow-xl hover:shadow-2xl transition-all active:scale-[0.98]"
            >
              {isSubmitting ? t('submitting') : t('confirmBooking')}
            </Button>
          </form>

          <div className="mt-10 p-6 bg-blue-50 rounded-2xl border border-blue-100">
            <p className="text-sm text-blue-800 leading-relaxed">
              <span className="font-bold mr-2">ℹ️ {t('brand')} Tip:</span>
              {t('bookingSaved')} {t('confirmationNote')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
