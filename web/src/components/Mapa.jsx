import React from 'react';
import { FaMapMarkerAlt, FaBreadSlice } from 'react-icons/fa';

const endereco = "Rua Doutor Protasio Alves, 214 - Areal, Pelotas - RS";
const mapsUrl = "https://www.google.com/maps/dir/?api=1&destination=Rua+Doutor+Protasio+Alves,+214+-+Areal,+Pelotas+-+RS";

const Mapa = () => (
    <section className="w-full flex flex-col items-center my-16">
        <div className="w-full max-w-6xl bg-white rounded-3xl shadow-lg border border-orange-200 overflow-hidden flex flex-col md:flex-row">
            {/* MAPA GRANDE */}
            <div className="flex-[2] min-w-[300px] h-[380px] md:h-[520px] relative">
                <div style={{ height: '100%' }}>
                    <iframe
                        title="Localização Padaria Seu Pizza"
                        src="https://www.google.com/maps?q=Rua+Doutor+Protasio+Alves,+214+-+Areal,+Pelotas+-+RS&output=embed"
                        width="100%"
                        height="100%"
                        style={{ border: 0, height: '100%', borderRadius: '0' }}
                        allowFullScreen=""
                        loading="lazy"
                    ></iframe>
                </div>
                <div className="absolute top-4 left-4 bg-white/95 px-4 py-2 rounded-full shadow text-orange-700 font-bold flex items-center gap-2 text-base border border-orange-200">
                    <FaBreadSlice className="text-orange-500" /> Padaria Seu Pizza
                </div>
            </div>
            {/* BLOCO DE ENDEREÇO */}
            <div className="flex-1 flex flex-col justify-center items-start p-6 md:p-8 gap-4 bg-gradient-to-br from-orange-50 via-white to-orange-100">
                <div className="flex items-center gap-3 mb-2">
                    <FaBreadSlice className="text-orange-600 text-2xl md:text-3xl" />
                    <h3 className="text-xl md:text-2xl font-extrabold text-orange-700">Venha nos visitar!</h3>
                </div>
                <div className="flex items-center gap-2 text-gray-900 font-semibold text-base md:text-lg">
                    <FaMapMarkerAlt className="text-orange-600" />
                    <span>{endereco}</span>
                </div>
                <span className="inline-block bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm md:text-base font-semibold shadow mb-2">
                    Aberto todos os dias!
                </span>
                <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 bg-orange-400 hover:bg-orange-500 text-white font-bold px-6 py-3 rounded-full shadow transition-all duration-200 text-base md:text-lg"
                >
                    Traçar rota no Google Maps
                </a>
            </div>
        </div>
    </section>
);

export default Mapa;