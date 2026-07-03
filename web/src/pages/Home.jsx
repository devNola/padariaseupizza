import React from 'react'
import { Hero } from '../components/Hero'
import ProdutosDestaque from '../components/ProdutosDestaque'
import Historia from '../components/Historia'

const Home = () => {
    return (
        <div>
            <Hero />
            <ProdutosDestaque />
            <Historia />
        </div>
    )
}

export default Home