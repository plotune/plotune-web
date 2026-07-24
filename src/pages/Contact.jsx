import React, { useEffect } from 'react';
import Seo from '../components/Seo';

const ContactPage = () => {
  useEffect(() => {
    // Load jQuery if not already loaded
    if (!window.jQuery) {
      const jqueryScript = document.createElement('script');
      jqueryScript.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
      document.head.appendChild(jqueryScript);
    }

    // Load Zammad form script
    const initializeForm = () => {
      if (!document.getElementById('zammad_form_script')) {
        const zammadScript = document.createElement('script');
        zammadScript.id = 'zammad_form_script';
        zammadScript.src = 'https://support.plotune.net/assets/form/form.js';
        zammadScript.onload = () => {
          // Initialize Zammad form
          if (window.jQuery && window.jQuery.fn.ZammadForm) {
            $('#zammad-support-form').ZammadForm({
              agreementMessage: 'I accept the <a href="https://www.plotune.net/legal" target="_blank">Data Privacy Policy & Acceptable Use Policy</a>',
              messageTitle: 'Support Request',
              messageSubmit: 'Submit',
              messageThankYou: 'Thank you for your inquiry (#%s)! We\'ll contact you as soon as possible.',
              debug: true,
              showTitle: true,
              modal: false,
              noCSS: true,
              attachmentSupport: true
            });
          }
        };
        document.head.appendChild(zammadScript);
      }
    };

    // Wait for jQuery to load
    if (window.jQuery) {
      initializeForm();
    } else {
      const checkJQuery = setInterval(() => {
        if (window.jQuery) {
          clearInterval(checkJQuery);
          initializeForm();
        }
      }, 100);
    }
  }, []);

  const contacts = [
    {
      icon: 'fa-envelope',
      title: 'Email',
      info: 'contact@plotune.net',
      link: 'mailto:contact@plotune.net',
      bgColor: 'from-green-500 to-teal-600'
    },
    {
      icon: 'fa-map-marker-alt',
      title: 'Address',
      info: 'Tuzla, Istanbul, Turkey',
      link: 'https://goo.gl/maps/XXXXXXX',
      bgColor: 'from-orange-500 to-red-600'
    },
    {
      title: 'Discord',
      icon: 'fa-brands fa-discord',
      info: 'Join our Discord Server',
      link: 'https://discord.gg/plotune',
      bgColor: 'from-indigo-500 to-purple-600'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-dark-surface to-black relative overflow-hidden">
      <Seo
        title="Contact Plotune"
        description="Get in touch with the Plotune team or request a demo of the DataOps platform and Plotune Nexus."
        path="/contact"
      />
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.3),transparent_50%)]"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.3),transparent_50%)]"></div>
      </div>

      <div className="container mx-auto px-5 max-w-7xl relative z-10">
        {/* Top Section: 3 Contacts + Map */}
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Left Side - CONTACTS */}
          <div className="space-y-6">
            {contacts.map((contact, index) => (
              <a
                key={index}
                href={contact.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-gradient-to-br from-dark-card/50 to-dark-card/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-primary/30 transition-all duration-500 flex items-center space-x-6 hover:scale-[1.02] hover:shadow-2xl"
              >
                <div className={`p-4 rounded-xl bg-gradient-to-br ${contact.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                  <i className={`fas ${contact.icon} text-2xl text-white`}></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary">{contact.title}</h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors">{contact.info}</p>
                </div>
                <div className="ml-auto">
                  <i className="fas fa-arrow-right text-primary text-xl group-hover:translate-x-1 transition-transform"></i>
                </div>
              </a>
            ))}
          </div>

          {/* Right Side - MAP */}
          <div>
            <div className="bg-gradient-to-br from-dark-card/30 to-transparent backdrop-blur-sm border border-white/10 rounded-2xl p-8 h-full">
              <h3 className="text-2xl font-bold text-white mb-6">Find Us</h3>
              
              <div className="relative w-full h-96 rounded-xl overflow-hidden mb-6 shadow-2xl">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3015.846968486693!2d28.97551431548492!3d41.10924397932371!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab7167a3c3b1b%3A0x8ddca3a4a9e5c7c!2sTuzla%2C%20Sariyer%2F%C4%B0stanbul!5e0!3m2!1str!2str!4v1699000000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Plotune Location"
                ></iframe>
              </div>

              <div className="space-y-4">
                <p className="text-gray-400 text-sm flex items-center">
                  <span className="mr-2">📍</span> Aydınlı Mah., 34485 Tuzla/İstanbul
                </p>
                <p className="text-gray-400 text-sm flex items-center">
                  <span className="mr-2">🕒</span> Mon - Fri: 9AM - 6PM
                </p>
                <p className="text-gray-400 text-sm flex items-center">
                  <span className="mr-2">📧</span> 24/7 Email Support
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - SUPPORT FORM */}
        <div className="bg-gradient-to-br from-dark-card/50 to-dark-card/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
              <i className="fas fa-headset text-xl text-white"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Support Request</h3>
              <p className="text-gray-400">Submit a ticket and we'll get back to you soon</p>
            </div>
          </div>

          {/* Zammad Form Container */}
          <div id="zammad-support-form">
            {/* The form will be automatically generated here by Zammad */}
          </div>
        </div>
      </div>

      {/* Custom CSS for Zammad Form - Fixed the jsx warning */}
      <style>{`
        /* Style the Zammad form to match your theme */
        #zammad-support-form .form-group {
          margin-bottom: 1.5rem;
        }
        
        #zammad-support-form label {
          display: block;
          font-weight: 500;
          color: #d1d5db;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }
        
        #zammad-support-form input,
        #zammad-support-form textarea,
        #zammad-support-form select {
          width: 100%;
          padding: 0.75rem 1rem;
          background-color: rgba(31, 41, 55, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          color: white;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        
        #zammad-support-form input:focus,
        #zammad-support-form textarea:focus,
        #zammad-support-form select:focus {
          outline: none;
          border-color: rgba(59, 130, 246, 0.5);
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }
        
        #zammad-support-form input::placeholder,
        #zammad-support-form textarea::placeholder {
          color: #6b7280;
        }
        
        #zammad-support-form .btn {
          width: 100%;
          padding: 1rem 1.5rem;
          background: linear-gradient(to right, #2563eb, #7c3aed);
          color: white;
          border: none;
          border-radius: 0.75rem;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 1rem;
        }
        
        #zammad-support-form .btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
        }
        
        #zammad-support-form .form-group.checkbox {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          margin-top: 1rem;
        }
        
        #zammad-support-form .form-group.checkbox input[type="checkbox"] {
          width: auto;
          margin-top: 0.25rem;
        }
        
        #zammad-support-form .form-group.checkbox label {
          margin-bottom: 0;
          line-height: 1.4;
        }
        
        #zammad-support-form .attachment-wrapper {
          margin-top: 1rem;
        }
        
        #zammad-support-form .attachment-wrapper input[type="file"] {
          padding: 0.5rem;
        }

        #zammad-support-form .form-group.checkbox label a {
          color: #3b82f6;
          text-decoration: underline;
        }

        #zammad-support-form .form-group.checkbox label a:hover {
          color: #60a5fa;
        }
      `}</style>
    </section>
  );
};

export default ContactPage;