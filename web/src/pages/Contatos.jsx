import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp, faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faPhone, faBreadSlice, faClock, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { assets } from '../assets/assets';

const Contatos = () => {
  return (
    <motion.div
      className="contatos-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="contato-header">
        <h1>Fale com a <span>Nossa Padaria</span></h1>
        <p className="subtitulo">Estamos prontos para atender você com todo o carinho e sabor!</p>
      </div>

      <div className="contato-grid">
        {/* Informações de Contato */}
        <motion.div
          className="contato-info"
          whileHover={{ y: -5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="contato-card">
            <h2>
              <FontAwesomeIcon icon={faBreadSlice} className="icon-title" />
              Informações de Contato
            </h2>

            <div className="contact-details">
              <div className="contact-item">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="icon" />
                <div>
                  <h3>Endereço</h3>
                  <p>Rua Protasio Alves, 214 - Areal</p>
                  <p>Pelotas/RS - CEP 96035-530</p>
                </div>
              </div>

              <div className="contact-item">
                <FontAwesomeIcon icon={faClock} className="icon" />
                <div>
                  <h3>Horário de Funcionamento</h3>
                  <p>Segunda a Sexta: 6h às 20h</p>
                  <p>Sábado e Domingo: 7h às 19h</p>
                </div>
              </div>

              <div className="contact-item">
                <FontAwesomeIcon icon={faPhone} className="icon" />
                <div>
                  <h3>Telefones</h3>
                  <p>
                    <FontAwesomeIcon icon={faWhatsapp} className="whatsapp-icon" />
                    (53) 9 8488-1060
                  </p>
                  <p>
                    <FontAwesomeIcon icon={faWhatsapp} className="whatsapp-icon" />
                    (11) 9 8458-4818
                  </p>
                </div>
              </div>

              <div className="contact-item">
                <FontAwesomeIcon icon={faEnvelope} className="icon" />
                <div>
                  <h3>Email</h3>
                  <p>padariaseupizza@gmail.com</p>
                </div>
              </div>
            </div>

            <div className="social-links">
              <h3>Nos siga nas redes sociais</h3>
              <div className="social-icons">
                <a href="#" aria-label="Facebook" className="social-hover facebook">
                  <FontAwesomeIcon icon={faFacebook} className="social-icon facebook" />
                </a>
                <a href="#" aria-label="Instagram" className="social-hover instagram">
                  <FontAwesomeIcon icon={faInstagram} className="social-icon instagram" />
                </a>
                <a href="#" aria-label="WhatsApp" className="social-hover whatsapp">
                  <FontAwesomeIcon icon={faWhatsapp} className="social-icon whatsapp" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Imagem da Padaria */}
        <div className="imagem-contato padaria-hover-efeito">
          <img
            src={assets.padariaseupizza}
            alt="Fachada da Padaria Seu Pizza"
            className="padaria-image"
            style={{ borderRadius: '18px', boxShadow: '0 4px 24px 0 rgba(160, 82, 45, 0.10)', transition: 'box-shadow 0.3s, filter 0.3s' }}
          />
          <div className="image-overlay">
            <p>Venha nos visitar e experimente nossos pães fresquinhos!</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contatos;