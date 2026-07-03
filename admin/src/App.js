import React from 'react'
import { Routes, Route, BrowserRouter } from "react-router-dom"
import Home from './pages/Home'
import Produtos from './pages/Produtos'

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Home />}></Route>
          <Route path="/produtos" exact element={<Produtos />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}
