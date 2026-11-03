
import React, { useState } from "react";
import "../cssFiles/home.css";

const services = [
  {
    number: "01",
    title: "Residential Construction",
    description:
      "Quality homes, villas, and residential buildings designed for comfort and durability.",
    icon: "⌂",
  },
  {
    number: "02",
    title: "Commercial Construction",
    description:
      "Modern offices, retail spaces, and commercial buildings built for business.",
    icon: "▦",
  },
  {
    number: "03",
    title: "Industrial Construction",
    description:
      "Reliable construction solutions for warehouses, factories, and industrial facilities.",
    icon: "⚙",
  },
  {
    number: "04",
    title: "Renovation & Remodeling",
    description:
      "Upgrade existing spaces with practical improvements and quality finishing.",
    icon: "↗",
  },
];

const projects = [
  {
    title: "Residential Development",
    category: "RESIDENTIAL",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85",
  },
  {
    title: "Commercial Building",
    category: "COMMERCIAL",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=85",
  },
  {
    title: "Construction Site",
    category: "SITE WORK",
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=85",
  },
  {
    title: "Interior Finishing",
    category: "INTERIORS",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85",
  },
  {
    title: "Building Structure",
    category: "ENGINEERING",
    image:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1000&q=85",
  },
  {
    title: "Modern Architecture",
    category: "DESIGN",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85",
  },
];

const initialForm = {
  name: "",
  email: "",
  phone: "",
  subject: "General Enquiry",
  message: "",
};

const CONTACT_API = "http://localhost:8081/api/contact";

function Home() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    queryType: "",
    message: "",
  });

  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState({
    type: "",
    text: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSending(true);
    setFeedback({ type: "", text: "" });

    try {
      const response = await fetch(CONTACT_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to send your message. Please try again."
        );
      }

      setFeedback({
        type: "success",
        text: result.message || "Your message has been sent successfully!",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        queryType: "",
        message: "",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        text:
          error.message ||
          "Could not connect to the server. Please try again later.",
      });
    } finally {
      setSending(false);
    }
  };

  // Keep the rest of your existing Home JSX here.



  return (
    <div className="gc-home">
      {/* NAVBAR */}
      <header className="gc-navbar">
        <a href="#home" className="gc-brand">
          <span className="gc-brand-logo">G</span>

          <span className="gc-brand-name">
            <strong>GLOBAL CONSTRUCTION</strong>
            <small>BUILDING WITH PURPOSE</small>
          </span>
        </a>

        <nav className="gc-nav-links">
          <a href="#home">Home</a>
          <a href="#about">About Us</a>
          <a href="#services">Our Services</a>
          <a href="#gallery">Projects</a>
          <a href="#contact">Contact</a>
          <a href="/admin/dashboard">admin</a>
        </nav>

        <a href="#contact" className="gc-nav-button">
          Get a Quote <span>↗</span>
        </a>
      </header>

      <main>
        {/* HERO SECTION */}
        <section className="gc-hero" id="home">
          <div className="gc-hero-overlay"></div>

          <div className="gc-hero-content">
            <p className="gc-eyebrow">
              CONSTRUCTION · ENGINEERING · DEVELOPMENT
            </p>

            <h1>
              Building Today.
              <br />
              <em>Shaping Tomorrow.</em>
            </h1>

            <p className="gc-hero-description">
              We turn ideas into reality through quality construction,
              thoughtful planning, and dependable project execution.
            </p>

            <div className="gc-hero-buttons">
              <a href="#services" className="gc-button gc-button-primary">
                Explore Our Services <span>↗</span>
              </a>

              <a href="#gallery" className="gc-button gc-button-outline">
                View Our Projects
              </a>
            </div>

            <div className="gc-hero-caption">
              <span></span>
              From the first plan to the final handover.
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section className="gc-about gc-section" id="about">
          <div className="gc-about-heading">
            <p className="gc-section-label">ABOUT GLOBALCONSTRUCTION</p>

            <h2>
              Strong Foundations.
              <br />
              <em>Lasting Relationships.</em>
            </h2>
          </div>

          <div className="gc-about-content">
            <p>
              At GlobalConstruction, we believe every successful project
              begins with a clear vision and a strong foundation.
              We focus on careful planning, dependable workmanship,
              and effective communication throughout the construction
              process.
            </p>

            <a href="#contact" className="gc-inline-link">
              Discuss Your Project <span>→</span>
            </a>
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section className="gc-section gc-services" id="services">
          <div className="gc-section-heading">
            <div>
              <p className="gc-section-label">WHAT WE DO</p>

              <h2>
                Our Construction
                <br />
                <em>Services.</em>
              </h2>
            </div>

            <p>
              Practical construction solutions for residential,
              commercial, and industrial projects.
            </p>
          </div>

          <div className="gc-service-grid">
            {services.map((service) => (
              <article className="gc-service-card" key={service.number}>
                <div className="gc-service-top">
                  <span className="gc-service-number">
                    {service.number}
                  </span>

                  <span className="gc-service-icon">
                    {service.icon}
                  </span>
                </div>

                <h3>{service.title}</h3>

                <p>{service.description}</p>

                <a href="#contact" className="gc-card-link">
                  Enquire Now <span>↗</span>
                </a>
              </article>
            ))}
          </div>
        </section>

        {/* PROJECT GALLERY */}
        <section className="gc-gallery-section" id="gallery">
          <div className="gc-section gc-gallery-inner">
            <div className="gc-section-heading">
              <div>
                <p className="gc-section-label">OUR PORTFOLIO</p>

                <h2>
                  Projects That
                  <br />
                  <em>Speak for Us.</em>
                </h2>
              </div>

              <p>
                Take a look at construction, architecture, and finishing
                examples. Replace the sample photographs with your
                company's actual project images.
              </p>
            </div>

            <div className="gc-gallery-grid">
              {projects.map((project, index) => (
                <article
                  className={`gc-project-card gc-project-${index + 1}`}
                  key={project.title}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                  />

                  <div className="gc-project-overlay">
                    <span>{project.category}</span>
                    <h3>{project.title}</h3>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="gc-cta">
          <div>
            <p className="gc-section-label">YOUR NEXT PROJECT STARTS HERE</p>

            <h2>
              Let's Build Something
              <br />
              <em>Remarkable.</em>
            </h2>
          </div>

          <a href="#contact" className="gc-button gc-button-dark">
            Start a Conversation <span>↗</span>
          </a>
        </section>

        {/* CONTACT SECTION */}
        <section className="gc-section gc-contact" id="contact">
          <div className="gc-contact-information">
            <p className="gc-section-label">CONTACT US</p>

            <h2>
              Have a Project
              <br />
              <em>in Mind?</em>
            </h2>

            <p className="gc-contact-intro">
              Tell us about your requirements. Whether you have a
              construction enquiry, need a quotation, or want to discuss
              a project, we'd be happy to hear from you.
            </p>

            <div className="gc-contact-item">
              <span className="gc-contact-icon">✉</span>

              <div>
                <small>EMAIL ADDRESS</small>
                <a href="mailto:mkvish716@gmail.com">
                  mkvish716@gmail.com
                </a>
              </div>
            </div>

            <div className="gc-contact-item">
              <span className="gc-contact-icon">☎</span>

              <div>
                <small>PHONE NUMBER</small>
                <p>+91 9451483275</p>
              </div>
            </div>

            <div className="gc-contact-item">
              <span className="gc-contact-icon">⌖</span>

              <div>
                <small>OFFICE ADDRESS</small>
                <p>Dalla, Sonbhadra, Uttar Pradesh 832312</p>
              </div>
            </div>

            <div className="gc-contact-item">
              <span className="gc-contact-icon">◷</span>

              <div>
                <small>BUSINESS HOURS</small>
                <p>Monday – Saturday, 9 AM – 6 PM</p>
              </div>
            </div>
          </div>

          {/* ENQUIRY FORM */}
          <form className="gc-contact-form" onSubmit={handleSubmit}>
            <div className="gc-form-row">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                maxLength={100}
                autoComplete="name"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                maxLength={254}
                autoComplete="email"
                required
              />
            </div>

            <div className="gc-form-row">
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number (optional)"
                value={formData.phone}
                onChange={handleChange}
                maxLength={30}
                autoComplete="tel"
              />

              <select
                name="queryType"
                value={formData.queryType}
                onChange={handleChange}
                required
              >
                <option value="">Select Query Type</option>
                <option value="Residential Construction">
                  Residential Construction
                </option>
                <option value="Commercial Construction">
                  Commercial Construction
                </option>
                <option value="Industrial Construction">
                  Industrial Construction
                </option>
                <option value="Renovation">
                  Renovation
                </option>
                <option value="General Enquiry">
                  General Enquiry
                </option>
              </select>
            </div>

            <textarea
              name="message"
              placeholder="Write your message..."
              value={formData.message}
              onChange={handleChange}
              rows={5}
              maxLength={5000}
              required
            />

            {feedback.text && (
              <p
                className={
                  feedback.type === "success"
                    ? "gc-form-success"
                    : "gc-form-error"
                }
                role="status"
                aria-live="polite"
              >
                {feedback.text}
              </p>
            )}

            <button type="submit" disabled={sending}>
              {sending ? "Sending..." : "Send Message"}
            </button>
          </form>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="gc-footer">
        <div className="gc-footer-main">
          <a href="#home" className="gc-brand">
            <span className="gc-brand-logo">G</span>

            <span className="gc-brand-name">
              <strong>GLOBAL CONSTRUCTION</strong>
              <small>BUILDING WITH PURPOSE</small>
            </span>
          </a>

          <p>
            Quality construction.
            <br />
            Dependable delivery.
          </p>

          <div className="gc-footer-links">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#services">Services</a>
            <a href="#gallery">Projects</a>
            <a href="#contact">Contact</a>
          </div>
        </div>

        <div className="gc-footer-bottom">
          <span>
            © {new Date().getFullYear()} GlobalConstruction. All rights reserved.
          </span>

          <a href="#home">Back to Top ↑</a>
        </div>
      </footer>
    </div>
  );

}
export default Home;
