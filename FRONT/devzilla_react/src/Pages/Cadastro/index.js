import Footer from "../../Components/Footer";
import Header from "../../Components/Header";
import Loader from "../../Components/Loader";
import Campo from "../../Components/Campo";

import img_login from '../../Assets/Images/b3_login.png'

import ilustracao from '../../Assets/Illustrations/illustr_cadastro.svg'

import { RxPerson } from 'react-icons/rx'
import { HiOutlineEnvelope } from 'react-icons/hi2'
import { RiLockPasswordLine } from 'react-icons/ri'

import { Link } from "react-router-dom";

import './style.css'

import { useState, useContext } from "react";

import { UserContext } from "../../App";

import validator from "validator";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { API_baseurl } from "../../services/utils";

export default function Cadastro(){

    const [nome, setNome] = useState('')
    const [errorNome, setErrorNome] = useState(null)

    const [email, setEmail] = useState('')
    const [errorEmail, setErrorEmail] = useState(null)

    const [senha, setSenha] = useState('')
    const [errorSenha, setErrorSenha] = useState(null)

    const [confirm, setConfirm] = useState('')
    const [errorConfirm, setErrorConfirm] = useState(null)

    const [carregando, setCarregando] = useState(false)

    const { setUser } = useContext(UserContext)

    function handleSubmit(e){

        e.preventDefault();

        if(validaNome() && validaEmail() && validaSenha() && validaConfirm()){

            setCarregando(true);

            const data = {
                nome: nome,
                email: email,
                senha: senha,
                dtNascimento: '2023-05-15',
                papel: 'user',
                postagens: [],
                empresas: []
            };

            fetch(API_baseurl + '/usuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) toast.error('Erro na requisição');
                console.log(response);

                setCarregando(false);
                setUser(data)

                const dadosString = JSON.stringify(data);
                sessionStorage.setItem("dadosUsuario", dadosString);

                toast.success('Sucesso! Aguarde para ser direcionado.');

                setTimeout(() => {
                    window.location.href = '/perfil';
                }, 2500);

                return response.json();
            })
            .catch(error => {
                console.log(error);
                toast.error(error)
                setCarregando(false);
            });
        }

        else{
            toast.error('Algo deu errado! Revise seus dados')
        }
    }

    function validaNome(){
        //se for válido e não for vazio retorna true e remove o erro
        if(!validator.isEmpty(nome) && validator.isLength(nome, { min: 10 })){
            setErrorNome(null)
            return true
        }

        //se cair aqui tem algo errado e entram as validações especificas
        else {
            if(validator.isEmpty(nome)) 
                setErrorNome('Nome é obrigatório!')

            if(!validator.isLength(nome, { min: 10 })) 
                setErrorNome('Nome muito curto!')
            
            return false
        }
    }

    function validaEmail(){
        //se for válido e não for vazio retorna true e remove o erro
        if(!validator.isEmpty(email) && validator.isEmail(email)){
            setErrorEmail(null)
            return true
        }

        //se cair aqui tem algo errado e entram as validações especificas
        else {
            if(validator.isEmpty(email)) 
                setErrorEmail('Email é obrigatório!')

            if(!validator.isEmail(email)) 
                setErrorEmail('Email inválido!')
            
            //Futuramente aqui terá outro if validando se o email é encontrado na nossa base de dados
            return false
        }
    }

    function validaSenha(){
        if(!validator.isEmpty(senha)){
            setErrorSenha(null)
            return true 
        }
        else{
            //Futuramente aqui tem outro if validando se a senha corresponde ao banco de dados
            setErrorSenha('Senha é obrigatória!')
            return false
        }
    }

    function validaConfirm(){
        if(confirm === senha){
            setErrorConfirm(null)
            return true 
        }

        else setErrorConfirm('As senhas precisam ser iguais!');
        
        return false
    }

    return(
        <div>
            <Header />
            <Loader show={carregando} />
            <main id="cadastro">

                <ToastContainer
                    autoClose={2500}
                    position="bottom-right"
                />

                <section className="container container_form">
                    <div className="wrap_form">
                        <img src={img_login} />
                        <form onSubmit={handleSubmit}>
                            <h2>Seja bem vindo!</h2>
                            <small>Para continuar, por favor insira seus dados.</small>

                            <img src={ilustracao} />

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

                            <Campo
                                label="Confirme sua senha"
                                id="senha_confirm"
                                placeholder="Confirme sua senha"
                                type="password"
                                icon={<RiLockPasswordLine />}
                                errorMsg={errorConfirm}
                                value={confirm}
                                onChange={e => setConfirm(e.target.value)}
                            />

                            <button type="submit" className="btn btn_primary arrow">Criar Conta</button>

                            <Link className="outros_links" to="/login">Já possui conta? <strong>clique aqui</strong></Link>
                            
                        </form>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}