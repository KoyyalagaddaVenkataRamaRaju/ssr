import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [formStatus, setFormStatus] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus('Thank you for contacting us! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
  };

  const styles = {
    pageWrapper: {
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      paddingTop: '40px',
      paddingBottom: '60px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    heroSection: {
      background: 'linear-gradient(135deg, #7A54B1 0%, #5a3d8a 100%)',
      color: '#ffffff',
      padding: '60px 0',
      marginBottom: '50px',
      textAlign: 'center',
    },
    heroTitle: {
      fontSize: '42px',
      fontWeight: '700',
      marginBottom: '15px',
      letterSpacing: '0.5px',
    },
    heroSubtitle: {
      fontSize: '18px',
      fontWeight: '400',
      opacity: '0.95',
    },
    sectionTitle: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#2c3e50',
      marginBottom: '40px',
      textAlign: 'center',
      position: 'relative',
      paddingBottom: '15px',
    },
    titleUnderline: {
      width: '80px',
      height: '4px',
      backgroundColor: '#7A54B1',
      margin: '0 auto',
      marginTop: '10px',
      borderRadius: '2px',
    },
    infoCard: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '30px',
      marginBottom: '25px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
      transition: 'all 0.3s ease',
      border: '1px solid #e9ecef',
      height: '100%',
    },
    infoCardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 25px rgba(122, 84, 177, 0.15)',
    },
    iconWrapper: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      backgroundColor: '#f0ebf8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '20px',
      transition: 'all 0.3s ease',
    },
    iconWrapperHover: {
      backgroundColor: '#7A54B1',
    },
    infoTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#2c3e50',
      marginBottom: '12px',
    },
    infoText: {
      fontSize: '15px',
      color: '#666',
      lineHeight: '1.6',
      marginBottom: '8px',
    },
    formCard: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '40px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
      border: '1px solid #e9ecef',
    },
    formGroup: {
      marginBottom: '25px',
    },
    label: {
      display: 'block',
      fontSize: '15px',
      fontWeight: '600',
      color: '#2c3e50',
      marginBottom: '8px',
    },
    input: {
      width: '100%',
      padding: '12px 15px',
      fontSize: '15px',
      border: '2px solid #e9ecef',
      borderRadius: '8px',
      transition: 'all 0.3s ease',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: '#ffffff',
    },
    textarea: {
      width: '100%',
      padding: '12px 15px',
      fontSize: '15px',
      border: '2px solid #e9ecef',
      borderRadius: '8px',
      transition: 'all 0.3s ease',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      minHeight: '150px',
      resize: 'vertical',
      backgroundColor: '#ffffff',
    },
    submitBtn: {
      backgroundColor: '#7A54B1',
      color: '#ffffff',
      border: 'none',
      padding: '14px 40px',
      fontSize: '16px',
      fontWeight: '600',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      width: '100%',
      justifyContent: 'center',
    },
    mapContainer: {
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
      height: '400px',
      border: '1px solid #e9ecef',
    },
    successMessage: {
      backgroundColor: '#d4edda',
      color: '#155724',
      padding: '15px',
      borderRadius: '8px',
      marginBottom: '20px',
      border: '1px solid #c3e6cb',
      textAlign: 'center',
      fontSize: '15px',
    },
  };

  const [hoveredCard, setHoveredCard] = useState(null);

  const contactInfo = [
    {
      icon: <MapPin size={28} />,
      title: 'Visit Us',
      details: [
        'Pranav Degree college',
        'Machilipatanam',
        'Andhra Pradesh - 521324',
      ],
    },
    {
      icon: <Phone size={28} />,
      title: 'Call Us',
      details: [
        '+91-877-2500000',
        '+91-877-2500001',
        'Mon - Sat: 9:00 AM - 5:00 PM',
      ],
    },
    {
      icon: <Mail size={28} />,
      title: 'Email Us',
      details: [
        'info@collage.edu.in',
        'admissions@collage.edu.in',
        'support@collage.edu.in',
      ],
    },
    {
      icon: <Clock size={28} />,
      title: 'Office Hours',
      details: [
        'Monday - Friday: 9:00 AM - 5:00 PM',
        'Saturday: 9:00 AM - 1:00 PM',
        'Sunday: Closed',
      ],
    },
  ];

  return (
    <>
      <style>
        {`
          .input-focus:focus {
            outline: none;
            border-color: #7A54B1;
            box-shadow: 0 0 0 3px rgba(122, 84, 177, 0.1);
          }
          .btn-hover:hover {
            background-color: #5a3d8a;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(122, 84, 177, 0.3);
          }
          .btn-hover:active {
            transform: translateY(0);
          }
        `}
      </style>
        <Navbar/>
      <div style={styles.pageWrapper}>
        <div style={styles.heroSection}>
          <div className="container">
            <h1 style={styles.heroTitle}>Get In Touch</h1>
            <p style={styles.heroSubtitle}>
              We're here to help and answer any questions you might have
            </p>
          </div>
        </div>

        <div className="container">
          <div className="row mb-5">
            {contactInfo.map((info, index) => (
              <div key={index} className="col-lg-3 col-md-6 mb-4">
                <div
                  style={{
                    ...styles.infoCard,
                    ...(hoveredCard === index ? styles.infoCardHover : {}),
                  }}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div
                    style={{
                      ...styles.iconWrapper,
                      ...(hoveredCard === index ? styles.iconWrapperHover : {}),
                    }}
                  >
                    <div style={{ color: hoveredCard === index ? '#ffffff' : '#7A54B1' }}>
                      {info.icon}
                    </div>
                  </div>
                  <h3 style={styles.infoTitle}>{info.title}</h3>
                  {info.details.map((detail, idx) => (
                    <p key={idx} style={styles.infoText}>
                      {detail}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="row mt-5">
            <div className="col-lg-6 mb-4">
              <div style={styles.formCard}>
                <h2 style={{ ...styles.sectionTitle, textAlign: 'left', paddingBottom: '0' }}>
                  Send Us a Message
                </h2>
                <div style={{ ...styles.titleUnderline, margin: '0', marginBottom: '30px' }}></div>

                {formStatus && (
                  <div style={styles.successMessage}>
                    {formStatus}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      style={styles.input}
                      className="input-focus"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          style={styles.input}
                          className="input-focus"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          style={styles.input}
                          className="input-focus"
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>
                    </div>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      style={styles.input}
                      className="input-focus"
                      placeholder="What is this regarding?"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      style={styles.textarea}
                      className="input-focus"
                      placeholder="Write your message here..."
                    ></textarea>
                  </div>

                  <button type="submit" style={styles.submitBtn} className="btn-hover">
                    <Send size={20} />
                    Send Message
                  </button>
                </form>
              </div>
            </div>

            <div className="col-lg-6 mb-4">
              <h2 style={styles.sectionTitle}>Find Us Here</h2>
              <div style={styles.mapContainer}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3798.8842783826783!2d83.24506331487767!3d17.78966098789591!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a39431389e6e701%3A0x4b3c8f3a7e35e7e7!2sVishnu%20Institute%20of%20Technology!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="VISHNU Institute Location"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default ContactUs;
