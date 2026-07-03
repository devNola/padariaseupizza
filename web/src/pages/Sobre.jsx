import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBreadSlice, faAward, faHeart } from '@fortawesome/free-solid-svg-icons';
import { assets } from '../assets/assets';


const Sobre = () => {
  return (
    <motion.div
      className="sobre-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="sobre-header">
        <h1>Conheça a <span>Padaria Seu Pizza</span></h1>
        <p className="subtitulo">Tradição e sabor desde 2021</p>
      </div>

      <div className="sobre-container">
        <motion.div
          className="historia"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="historia-content">
            <h2>
              <FontAwesomeIcon icon={faBreadSlice} className="icon-title" />
              Nossa História
            </h2>
            <p>
              Desde o início, nossa padaria se dedicou a criar pães e doces com
              sabor autêntico e ingredientes selecionados. Com um toque artesanal e
              uma paixão por qualidade, buscamos oferecer experiências que
              encantam a cada mordida.
            </p>

            <p>
              Cada produto que sai de nossos fornos carrega não apenas qualidade, mas toda uma herança
              familiar. Utilizamos técnicas centenárias aliadas a rigorosos padrões de higiene e
              controle de qualidade.
            </p>

            <div className="destaques">
              <div className="destaque-item">
                <FontAwesomeIcon icon={faAward} className="destaque-icon" />
                <h3>Qualidade Garantida</h3>
                <p>Matérias-primas selecionadas e processos rigorosos</p>
              </div>

              <div className="destaque-item">
                <FontAwesomeIcon icon={faHeart} className="destaque-icon" />
                <h3>Feito com Amor</h3>
                <p>Cada produto é preparado com carinho e atenção</p>
              </div>

            </div>
          </div>
        </motion.div>

        <motion.div
          className="imagem"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="image-wrapper">
            <img
              src={assets.foto_padaria}
              alt="Interior da padaria com pães frescos"
              className="sobre-image"
            />
            <div className="image-caption">
              <p>Nosso forno a lenha, onde a magia acontece</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="sobre-cta">
        <motion.p
          className="frase-impacto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          “Aqui, cada pão conta uma história de carinho e tradição.”
        </motion.p>
        <motion.a
          href="/produtos"
          className="btn-sobre"
          whileHover={{ scale: 1.06 }}
        >
          Conheça nossos produtos
        </motion.a>
      </div>
    </motion.div>
  );
};

export default Sobre;