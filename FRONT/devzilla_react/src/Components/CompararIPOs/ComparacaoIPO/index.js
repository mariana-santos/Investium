import { useState, useContext } from 'react';

import { ComparacaoContext } from "../../CompararIPOs"

import Table from './TableComparacao'
import ChartComparacao from './ChartComparacao';

import { API_baseurl } from '../../../services/utils';

import { useQuery } from 'react-query';

import { useEffect } from 'react';

import { nubank, mobly } from '../../../Assets/DadosExemplos/indicadores_financeiros';

export default function ComparacaoIPO() {

    const { ofertas } = useContext(ComparacaoContext);

    const [anosArray, setAnosArray] = useState([]);
    const [anosSet, setAnosSet] = useState(new Set());
    const [descArray, setDescArray] = useState([]);
    const [descSet, setDescSet] = useState(new Set());

    const { isLoading, error, data: oferta1 } = useQuery(['empresa', ofertas[0].id], () =>
        fetch(`${API_baseurl}/empresa/${ofertas[0].id}`)
            .then(resp => resp.json())
    );

    const { isLoading: isLoading2, error: error2, data: oferta2 } = useQuery(['empresa', ofertas[1].id], () =>
        fetch(`${API_baseurl}/empresa/${ofertas[1].id}`)
            .then(resp => resp.json())
    );

    useEffect(() => {
        // Wait for both queries to be resolved before setting the states
        if (!isLoading && !isLoading2 && oferta1 && oferta2) {

            // Pegando os anos que tem indicadores financeiros disponíveis das ofertas
            const anosSetTemp = new Set([
                ...(nubank ? nubank.map(item => item.ano) : []),
                ...(mobly ? mobly.map(item => item.ano) : [])
            ]);

            setAnosSet(anosSetTemp);
            setAnosArray(Array.from(anosSetTemp));

            const descSetTemp = new Set([
                ...(nubank ? nubank.map(item => `${item.descricao} ${item.tipo}`) : []),
                ...(mobly ? mobly.map(item => `${item.descricao} ${item.tipo}`) : [])
            ]);
            setDescSet(descSetTemp);
            setDescArray(Array.from(descSetTemp));

            // Set the default values for dado and ano here
            setDado(Array.from(descSetTemp)[0]);
            setAno(Array.from(anosSetTemp)[0]);
        }
    }, [isLoading, isLoading2, oferta1, oferta2]);

    const [visualizacao, setVisualizacao] = useState('barra');
    const [ano, setAno] = useState();
    const [dado, setDado] = useState();

    if (isLoading || isLoading2 || !oferta1 || !oferta2)
        return <section id='comparacao'><p>Carregando...</p></section>

    if (error || error2)
        return <section id='comparacao'><p>Algo deu errado! Tente novamente mais tarde</p></section>

    return (
        <section id='comparacao'>

            <InfoEmpresa oferta={oferta1} />
            <InfoEmpresa oferta={oferta2} />

            {(nubank.length > 0 || mobly.length > 0) ?
                (<>
                    <h2>Dados financeiros de {oferta1.nome} e {oferta2.nome}</h2>
                    <p>Dúvidas para entender os indicadores financeiros?
                        <strong><a href="/blog/artigo/8" className="link">Leia nosso artigo sobre o assunto e entenda o que cada um significa!</a></strong>
                    </p>

                    <div className="wrap_filter">
                        <label>Visualização: </label>
                        <select
                            id="visualizacao"
                            onChange={(e) =>
                                setVisualizacao(e.target.value)
                            }
                            value={visualizacao}
                        >
                            <option value="barra">Geral (Gráfico de barra)</option>
                            <option value="tabela">Detalhada (tabela)</option>
                        </select>
                    </div>

                    {visualizacao == 'tabela' &&
                        <div className="wrap_filter">
                            <label>Ano: </label>
                            <select
                                id="visualizacao"
                                onChange={(e) => setAno(e.target.value)}
                                value={ano}
                            >
                                {anosArray?.map((ano) => {
                                    return <option value={ano} key={ano}>{ano}</option>
                                })}

                            </select>
                        </div>
                    }

                    {visualizacao == 'barra' &&
                        <div className="wrap_filter">
                            <label>Indicadores: </label>
                            <select
                                id="dados"
                                onChange={(e) =>
                                    setDado(e.target.value)
                                }
                                value={dado}
                            >
                                {descArray?.map((desc) => {
                                    return <option value={desc} key={desc}>{desc}</option>
                                })}
                            </select>
                        </div>
                    }

                    {visualizacao === 'tabela' ?
                        <Table ofertas={[oferta1, oferta2]} ano={ano} />
                        :
                        <ChartComparacao ofertas={[oferta1, oferta2]} tipo={dado} />}
                </>)
                :
                (<p>Nenhum dado financeiro encontrado para comparação!</p>)}

        </section>
    )
}

function InfoEmpresa({ oferta }) {

    return (
        <div className='empresa_info'>
            <a href={oferta?.linkEmpresa} target='_blank' >
                <div className="option wrap_img" style={{ background: oferta?.cor }}>
                    <span className='logo' style={{ backgroundImage: `url(${oferta?.imagem})` }} />
                </div>

                <h3>{oferta?.nome}</h3>
            </a>

            <small className='cnpj'>{oferta?.cnpj}</small>
            <small><strong>Setor:</strong> {oferta?.setor.descricao} </small>
            <small>
                <strong>Status: </strong>
                <strong style={{ color: oferta?.ativoIpo ? '#0B8C3D' : '#BD3800' }}>
                    {oferta?.ativoIpo ? 'ativa' : 'finalizada'}
                </strong>
            </small>
            <small><strong>Valor inicial:</strong> R$ {oferta?.valorInicialIpo.toFixed(2).replace('.', ',')}</small>
            <a href={oferta?.linkProspecto} target="_blank" className="btn btn_secondary arrow_long">Prospecto</a>
        </div>
    )
}