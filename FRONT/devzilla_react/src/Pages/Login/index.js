import Footer from "../../Components/Footer";
import Header from "../../Components/Header";
import Campo from "../../Components/Campo";
import Loader from "../../Components/Loader";

import img_login from '../../Assets/Images/b3_login.png'

import ilustracao from '../../Assets/Illustrations/illustr_login.svg'

import { HiOutlineEnvelope } from 'react-icons/hi2'
import { RiLockPasswordLine } from 'react-icons/ri'

import { Link } from "react-router-dom";

import '../Cadastro/style.css'
import { useContext, useState, useEffect } from "react";

import validator from "validator";

import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { UserContext } from "../../App";

import { API_baseurl } from "../../services/utils";

export default function Cadastro() {

    const [email, setEmail] = useState('')
    const [errorEmail, setErrorEmail] = useState(null)

    const [senha, setSenha] = useState('')
    const [errorSenha, setErrorSenha] = useState(null)

    const [carregando, setCarregando] = useState(false)

    const { setUser, user } = useContext(UserContext)

    function handleSubmit(e) {

        e.preventDefault();

        if (validaEmail() && validaSenha()) {
            setCarregando(true)

            fetch(`${API_baseurl}/login/${email}/${senha}`)
                .then((resp) => resp.json())
                .then((data) => {
                    setCarregando(false)
                    if (data.nome && data.email && data.senha) {
                        toast.success('Usuário autenticado! Aguarde para ser direcionado.')
                        const dadosString = JSON.stringify(data);
                        sessionStorage.setItem("dadosUsuario", dadosString);
                        setUser(data)
                        setTimeout(() => {
                            window.location.href = '/perfil'
                        }, 2000)
                    } else {
                        toast.error('Email ou senha incorretos.')
                    }
                })
                .catch((error) => {
                    console.error(error)
                    setCarregando(false)
                });
        }

        else {
            toast.error('Algo deu errado! Revise seus dados')
        }
    }

    function validaEmail() {

        //se for válido e não for vazio retorna true e remove o erro
        if (email !== '' && email !== null && validator.isEmail(email)) {
            setErrorEmail(null)
            return true
        }

        //se cair aqui tem algo errado e entram as validações especificas
        else {
            if (email === '' || email === null || email === undefined) {
                setErrorEmail('Email é obrigatório!')
                return false
            }

            if (!validator.isEmail(email)) {
                setErrorEmail('Email inválido!')
                return false
            }

            //Futuramente aqui terá outro if validando se o email é encontrado na nossa base de dados
        }

    }

    function validaSenha() {

        if (senha !== '' && senha !== null) {
            setErrorSenha(null)
            return true
        }
        else {
            //Futuramente aqui tem outro if validando se a senha corresponde ao banco de dados
            setErrorSenha('Senha é obrigatória!')
            return false
        }
    }

    return (
        <div>
            <Header />
            <Loader show={carregando} />
            <main id="login">

                <ToastContainer
                    autoClose={2500}
                    position="bottom-right"

                />
                <section className="container container_form">
                    <div className="wrap_form">
                        <img src={img_login} />
                        <form onSubmit={handleSubmit}>
                            <h2>Bem vindo de volta!</h2>
                            <small>Para continuar, por favor insira seus dados.</small>

                            <img src={ilustracao} />

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
                                label="Senha"
                                id="senha"
                                placeholder="Digite sua senha"
                                type="password"
                                icon={<RiLockPasswordLine />}
                                errorMsg={errorSenha}
                                value={senha}
                                onChange={e => setSenha(e.target.value)}
                            />

                            <button type="submit" className="btn btn_primary arrow">Entrar</button>

                            <a className="outros_links" href="#">Esqueceu a senha? <strong>clique aqui</strong></a>
                            <Link className="outros_links" to="/cadastro">Ainda não possui conta? <strong>clique aqui</strong></Link>

                        </form>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}