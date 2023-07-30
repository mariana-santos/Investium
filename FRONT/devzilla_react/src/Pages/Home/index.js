import './style.css'

import Footer from '../../Components/Footer';
import Header from '../../Components/Header';
import Banner from '../../Components/Banner';
import BannerSlider from '../../Components/Slider';
import Button from '../../Components/Button';
import ListaArtigos from '../../Components/ListaArtigos';
import ListaEmpresas from '../../Components/ListaEmpresas';
import CompararIPOs from '../../Components/CompararIPOs';

import { useState } from 'react';

import IllustrBlog from '../../Assets/Illustrations/illustr_quem_somos.svg'
import IllustrIPO from '../../Assets/Illustrations/illustr_investing.svg'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <div>
      <Header />

      <main id="home">

        <ToastContainer
          autoClose={2500}
          position="bottom-right"
        />

        <BannerSlider
          banners={[
            <Banner 
              titulo="Todos os IPOs disponíveis em um só lugar!" 
              key={0} />,

            <Banner 
              imagem="/banner/investimento.jpg" 
              key={1}
              titulo="Compare as ofertas para investir com confiança!"/>,

            <Banner 
              imagem="/banner/banner_blog.jpg" 
              key={2}
              titulo="Aprenda mais sobre investimento, ofertas e educação financeira!" />
          ]}
        />

        <Section1 />
        <ListaEmpresas max={4} botao />

        <Section2 />
        <ListaArtigos max={3} botao />

        <Newsletter />
      </main>

      <Footer />
    </div>
  );
}

function Section1() {
  const [showModal, setShow] = useState(false)

    const abrirModal = (e) => {
        e.preventDefault();
        setShow(true)
    }

    const fecharModal = () => {
        setShow(false);
    };

  return (
    <section className="row container" id="section1">
      <div className="column">
        <img src={IllustrIPO} />
      </div>

      <div className="column">
        <h1 className="line_before">Em dúvida em qual IPO investir?</h1>
        <p className="width_80"><strong>Compare as ofertas para decidir melhor!</strong> <br />
        Na nossa plataforma você pode comparar os dados das empresas, estejam elas com IPO aberto ou finalizado!
        </p>

        <button className='btn btn_primary arrow' onClick={abrirModal}>Comparar ofertas</button>
      </div>

      <CompararIPOs id={null} show={showModal} abrirModal={abrirModal} fecharModal={fecharModal} />
    </section>
  )
}

function Section2() {
  return (
    <section className="row container" id="section2">

      <div className="column">
        <h1 className="line_before">Nosso Blog</h1>
        <p>Quer entender melhor o mundo dos <strong>investimentos?</strong> Acesse nossos artigos e fique por dentro! Nossa missão é <strong>facilitar o assunto</strong> e te ajudar a ir da organização financeira até o mundo dos investimentos!
        </p>

        <Button
          link="sobre_nos"
          icon_name="arrow"
          texto="ler mais"
        />
      </div>

      <div className="column">
        <img src={IllustrBlog} />
      </div>
    </section>
  )
}

function Newsletter() {
  return (
    <section>
      <div className="container" id="newsletter">
        <h1 className='line_before'>Receba as novidades por e-mail</h1>
        <p>Dessa forma você ficará por dentro de <strong>todas as notícias</strong> </p>
        <input type="email" placeholder="Seu endereço de e-mail" />

        <Button
          link="sobre_nos"
          icon_name="arrow"
          texto="cadastrar"
        />

      </div>
    </section>
  )
}