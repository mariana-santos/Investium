import './style.css'
import Footer from "../../Components/Footer";
import Header from "../../Components/Header";
import ListaCards from "../../Components/ListaEmpresas";
import Banner from "../../Components/Banner";
import { useState, useEffect } from "react";

import { useQuery } from 'react-query';
import { API_baseurl } from '../../services/utils';



export default function Ofertas(){
    const [empresasFiltradas, setEmpresasFiltradas] = useState([])

    const [categoria, setCategoria] = useState('Todas as ofertas')
    const [pesquisa, setPesquisa] = useState('')
    const [resultPesquisa, setResult] = useState('')

    const { isLoading, error: errorEmpresas, data: empresas } = useQuery('repo-empresa', () =>
    fetch(API_baseurl + '/empresa').then(res =>
      res.json()
    )
  )

    useEffect(() => {
        //Carregando os empresas
        if(!errorEmpresas, !isLoading)
            setEmpresasFiltradas(empresas)

    }, [isLoading, errorEmpresas, empresas]);

    //Toda vez que o input de pesquisa ou o select de categoria mudar ele chama o handlePesquisa
    useEffect(() => {
        handlePesquisa()
    }, [pesquisa, categoria])

    const handlePesquisa = () => {

        if (pesquisa !== '') {
            const filtered = empresas.filter((empresa) => {
              const normalizedTitulo = empresa.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
              const normalizedConteudo = empresa.descricao.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        
              const tituloContains = normalizedTitulo.includes(pesquisa);
              const conteudoContains = normalizedConteudo.includes(pesquisa);
        
              if (categoria === 'Todas as ofertas') {
                return tituloContains || conteudoContains;
              }
        
            //   TODO: FILTRAR POR STATUS IPO FINALIZADA OU ATIVA
            //   return (tituloContains || conteudoContains) && empresa.categoria.descricao === categoria;
            });
        
            setEmpresasFiltradas(filtered);
            setResult(`Mostrando ${empresasFiltradas.length} resultado(s) para "${pesquisa}" em ${categoria}`)
        } 
        else if (categoria !== 'Todas as ofertas'){
             
            //   TODO: FILTRAR POR STATUS IPO FINALIZADA OU ATIVA
            // const filtrados = empresasFiltrados.filter(
            //     (empresa) => empresa.categoria.descricao === categoria
            // )

            // setempresasFiltrados(filtrados)
            // setResult(`Mostrando ${empresasFiltrados.length} resultado(s) para ${categoria}`)
        }

        else {
            setEmpresasFiltradas(empresas)
            setResult('')
        }
    }

    return(
        <div>
            <Header />

            <main id='ofertas'>
                <Banner 
                    imagem="/banner/investimento.jpg"
                    titulo="Encontre as ofertas e compare para investir confiante!"
                    button={{texto: 'Comparar ofertas'}}
                />

                <section id="filter" className="container row">
                    <h2>Procurando algo específico?</h2>
                    <input type="text" placeholder="O que você quer encontrar?"/>
                    <select id="categoria">
                        <option>Todas as ofertas</option>
                        <option>finalizadas</option>
                        <option>disponíveis</option>
                    </select>
                </section>

                <section id="container_filter" className='container'>
                    <ListaCards 
                        tipo="ipos" 
                        botao={false}
                    />
                </section>

                
            </main>

            <Footer />
        </div>
    )
}