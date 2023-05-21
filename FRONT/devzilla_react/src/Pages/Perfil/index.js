import Header from '../../Components/Header'
import Footer from '../../Components/Footer'
import ListaCards from '../../Components/ListaArtigos'
import banner_perfil from '../../Assets/Illustrations/banner_perfil.svg'

import artigos from '../../Assets/DadosExemplos/blog.json'
import ipos from '../../Assets/DadosExemplos/ipos.json'

import ReactLoading from 'react-loading'

import Campo from '../../Components/Campo'

import { RxPerson } from 'react-icons/rx'
import { HiOutlineEnvelope } from 'react-icons/hi2'
import { RiLockPasswordLine } from 'react-icons/ri'
import { CiCalendarDate } from 'react-icons/ci'

import { useEffect, useState } from 'react'

import Moment from 'react-moment';
import moment from 'moment'

import './style.css'

export default function Perfil() {

    const userData = sessionStorage.getItem('dadosUsuario');
    let user = null
    if (userData) user = JSON.parse(userData);

    const [nome, setNome] = useState(user.nome)
    const [errorNome, setErrorNome] = useState(null)

    const [email, setEmail] = useState(user.email)
    const [errorEmail, setErrorEmail] = useState(null)

    const [senha, setSenha] = useState(user.senha)
    const [errorSenha, setErrorSenha] = useState(null)

    const [dtNasc, setDtNasc] = useState(user.dtNascimento)
    const [errorNasc, setErrorNasc] = useState(null)

    const [loading, setLoading] = useState(true)

    const [postagens, setPostagens] = useState([])
    const [empresas, setEmpresas] = useState([])

    useEffect(() => {
        if(user){
            fetch(`http://localhost:8080/InvestiumAPI/rest/usuario/${email}/${senha}`)
                .then((resp) => resp.json())
                .then((data) => {
                    setLoading(false)
                    if (data.nome && data.email && data.senha) {
                        setPostagens(data.postagens)
                        setEmpresas(data.empresas)
                    } 
                })
                .catch((error) => {
                    console.error(error)
                    setLoading(false)
                });
        }
    }, [])

    return (
        <div>
            <Header />
            <main id='perfil'>
                {user ? (
                    <>
                    <section className="container formulario">
                        <h1 className="line_after"> Meu perfil </h1>
                        <img src={banner_perfil} alt="" />

                        <form method="POST">
                            <div className="contentInput" >

                                <Campo
                                    label="Email"
                                    id="email"
                                    placeholder="Digite seu email"
                                    type="email"
                                    icon={<HiOutlineEnvelope />}
                                    errorMsg={errorEmail}
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />

                                <Campo
                                    label="Nome"
                                    id="nome"
                                    placeholder="Digite seu nome"
                                    type="text"
                                    icon={<RxPerson />}
                                    errorMsg={errorNome}
                                    value={nome}
                                    onChange={e => setNome(e.target.value)}
                                />
                            </div>

                            <div className="contentInput">

                                <Campo
                                    label="Senha"
                                    id="senha"
                                    placeholder="Digite sua senha"
                                    type="password"
                                    icon={<RiLockPasswordLine />}
                                    errorMsg={errorSenha}
                                    value={senha}
                                    onChange={e => setSenha(e.target.value)}
                                />

                                <Campo
                                    label="Data de nascimento"
                                    id="dt_nasc"
                                    type="date"
                                    icon={<CiCalendarDate />}
                                    errorMsg={errorNasc}
                                    value={moment(dtNasc).format('YYYY-MM-DD')}
                                    onChange={e => setDtNasc(e.target.value)}
                                />
                            </div>

                            <div className="block">
                                <small> Se desejar alterar a conta, <span> clique aqui </span></small>
                                <a href="#" className="btn btn_primary arrow"> Salvar </a>
                            </div>

                        </form>
                    </section>

                    { loading ? (
                        <div className='wrap_loading'>
                            <ReactLoading color="#444" type='spinningBubbles' />
                            <p>Carregando dados...</p>
                        </div>
                    ) : (
                        <>
                            <ListaCards dados={empresas} tipo="ipo" botao />
                            <ListaCards dados={postagens} tipo="materia" botao />
                        </>
                    ) }
                </>
                ) : (
                    <p>Você precisa estar logado pra acessar seus dados. </p>
                )}
                
            </main>
            <Footer />
        </div>
    )
}