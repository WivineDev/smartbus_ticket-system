import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">
          About SmartBus Ticket System
        </h1>

        {/* Introduction */}
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-4 text-primary-700">Our Story</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              SmartBus Ticket System was founded with a simple mission: to make bus travel 
              accessible, convenient, and enjoyable for everyone. We understand that planning 
              a journey can be stressful, which is why we've created a seamless booking 
              experience that puts you in control.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Since our inception, we've helped thousands of travelers reach their destinations 
              comfortably and affordably. Our commitment to innovation and customer service 
              continues to drive us forward as we expand our routes and enhance our services.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-primary-50 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-3 text-primary-700">Our Mission</h3>
              <p className="text-gray-700">
                To provide reliable, affordable, and comfortable bus transportation services 
                while leveraging technology to create a seamless booking experience for all travelers.
              </p>
            </div>
            <div className="bg-primary-50 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-3 text-primary-700">Our Vision</h3>
              <p className="text-gray-700">
                To become the leading bus transportation platform, recognized for excellence 
                in service, innovation, and customer satisfaction across all regions we serve.
              </p>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Reliability</h3>
              <p className="text-sm text-gray-600">On-time service you can count on</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Customer Care</h3>
              <p className="text-sm text-gray-600">Your comfort is our priority</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Innovation</h3>
              <p className="text-sm text-gray-600">Modern solutions for modern travel</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Affordability</h3>
              <p className="text-sm text-gray-600">Fair prices for quality service</p>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Our Impact</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold mb-2">50K+</div>
                <div className="text-primary-200">Happy Customers</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">100+</div>
                <div className="text-primary-200">Destinations</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">500+</div>
                <div className="text-primary-200">Daily Routes</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">99%</div>
                <div className="text-primary-200">On-time Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Ready to Travel with Us?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Experience the SmartBus difference for yourself. Book your next journey 
            and discover why thousands of travelers choose us every day.
          </p>
          <Link to="/booking">
            <Button size="lg">
              Book Your Ticket Now
            </Button>
          </Link>
        </section>
      </div>
    </div>
  );
};

export default About;
