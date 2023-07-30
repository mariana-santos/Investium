import Banner from "../../../Components/Banner";
import Footer from "../../../Components/Footer";
import Header from "../../../Components/Header";
import ListaArtigos from '../../../Components/ListaArtigos'

import { useEffect, useState } from 'react'

import { useQuery } from "react-query";

import './style.css'

import { BsFillPersonFill } from 'react-icons/bs'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { useParams } from "react-router-dom";

import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import ReactLoading from 'react-loading'

import { API_baseurl } from "../../../services/utils";

export default function Artigo() {

    const { id } = useParams()

    const [paragrafos, setParagrafos] = useState([])

    const [comentarios, setComentarios] = useState([])
    const [novocomentario, setNovoComentario] = useState([])

    const { isLoading, error, data: artigo } = useQuery(`postagem-${id}`, () =>
        fetch(`${API_baseurl}/postagem/${id}`).then(res =>
            res.json()
        )
    )

    function carregarComentarios() {
        fetch(`${API_baseurl}/comentario/by_post/${id}`)
            .then((resp) => resp.json())
            .then((data) => setComentarios(data))
            .catch((error) => console.error(error));
    }

    useEffect(() => {
        if (!error && !isLoading) {
            setParagrafos(artigo.conteudo.split('\\n'))
        }

        //Carregando os comentários
        carregarComentarios();

    }, [error, isLoading, artigo])

    function formatarData(data) {
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth()).padStart(2, '0');
        const ano = data.getFullYear();

        return `${ano}-${mes}-${dia}`;
    }

    function adicionarComentario() {
        const dataFormatada = formatarData(new Date())
        const dadosRecuperados = JSON.parse(sessionStorage.getItem("dadosUsuario"));
        if (dadosRecuperados) {
            const data = {
                conteudo: novocomentario,
                data: dataFormatada,
                usuario: dadosRecuperados,
                postagem: artigo
            };
            console.log(data)
            if (data.comentario !== '') {
                fetch(API_baseurl + '/comentario', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                })
                    .then(response => {
                        if (response.status >= 250) {
                            toast.error('Ops! Algo deu errado :/ Tente novamente');
                        } else {
                            console.log(response)
                            setNovoComentario('');
                            setComentarios([...comentarios, data])
                            carregarComentarios();
                            toast.success('Sucesso! Comentário cadastrado.');
                        }
                    })
                    .catch(error => {
                        toast.error(error);
                    });
            }
        } else {
            toast.error("Você precisa estar logado para comentar");
        }
    }

    const userData = sessionStorage.getItem('dadosUsuario');
    let user = null
    if (userData) user = JSON.parse(userData);

    const [postagens, setPostagens] = useState([])

    const { isLoading: isLoadingPerfil, error: errorPerfil, perfil } = useQuery('perfil', () =>
        fetch(`https://investium-api.herokuapp.com/usuario/${user?.email}/${user?.senha}`)
            .then(resp => resp.json())
    );

    useEffect(() => {
        if (perfil && !isLoadingPerfil && !errorPerfil) {
            if (perfil.nome && perfil.email && perfil.senha) {
                setPostagens(perfil.postagens);
            }
        }
    }, [perfil, isLoadingPerfil, errorPerfil]);

    useEffect(() => {
        //percorre as postagens do usuário e verifica se a atual está lá
        setSaved(postagens.some((post) => post.id == id))
    }, [postagens])

    const [isSaved, setSaved] = useState(false)

    function handleSave() {
        if (user) {
            const path = isSaved ? 'removerPostagem' : 'salvarPostagem'

            const data = {
                emailUsuario: user.email,
                idPostagem: id,
            };

            fetch(`https://investium-api.herokuapp.com/usuario/${path}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .catch(error => {
                    console.log(error);
                });

            setSaved(!isSaved)
        }

        else toast.error('Você precisa estar logado para salvar uma matéria!')
    }

    return (
        <div>
            <Header />
            <main id='artigo'>
                {isLoading && !error ? (
                    <div className='wrap_loading'>
                        <ReactLoading type="spinningBubbles" color='#444' />
                        <p>Carregando artigo...</p>
                    </div>

                ) : (
                    <>
                        <Banner
                            imagem={`/blog/${artigo.imgUrl}`}
                            titulo={artigo.titulo}
                            botaoCompartilhar={true}
                        />

                        <section className="container row">
                            <article>
                                <h1 className="line_after">{artigo.titulo}</h1>

                                <p id="subtitulo">{artigo.conteudo}</p>

                                <small>Artigos &gt; {artigo.categoria.descricao} &gt; {artigo.titulo} </small>

                                <div className="wrap_btns">
                                    <a className="btn btn_secondary curtir" onClick={handleSave}>
                                        {isSaved ? (
                                            <>
                                                Curtido
                                                <AiFillHeart />
                                            </>
                                        ) : (
                                            <>
                                                Curtir
                                                <AiOutlineHeart />
                                            </>
                                        )}

                                    </a>

                                </div>

                                <div id="content">

                                    {paragrafos.map((paragrafo, index) =>
                                        <p key={index}>
                                            {paragrafo.replace('\\n', '').replace('\n', '')}
                                        </p>
                                    )}

                                    <section id="comentarios">

                                        <h2>Comentários</h2>

                                        {comentarios.map((comentario) => {
                                            return (
                                                <div className="comentario" key={comentario.id}>
                                                    <div className="profile">
                                                        <BsFillPersonFill />
                                                    </div>
                                                    <div>
                                                        <h3> {comentario.usuario.nome} </h3>
                                                        <p>{comentario.conteudo}</p>
                                                    </div>
                                                </div>
                                            )
                                        })}

                                        <div id="novo_comentario">
                                            <div className="profile">
                                                <BsFillPersonFill />
                                            </div>
                                            <h3>{user ? user.nome : 'Art Vandelay'}</h3>

                                            <textarea value={novocomentario} onChange={event => setNovoComentario(event.target.value)} placeholder="O que você achou da matéria?" rows="3"></textarea>
                                            <a className="btn btn_primary" onClick={adicionarComentario}>comentar</a>
                                        </div>

                                    </section>
                                </div>
                            </article>

                            {/* TODO: fazer uma requisição com getDadosByCategoria da categoria atual */}
                            <aside id="cards">
                                <h2>Artigos relacionados</h2>
                                <ListaArtigos tipo="materia" max={2} />
                            </aside>
                        </section>

                        <ToastContainer
                            autoClose={2500}
                            position="bottom-right"

                        />
                    </>
                )}
                <Footer />
            </main>
        </div>
    )
}