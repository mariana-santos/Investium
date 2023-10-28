import { useState } from "react";

import Table from "../Table";
import ChartIndicadores from "../ChartIndicadores";

import { nubank } from "../../../../Assets/DadosExemplos/indicadores_financeiros";

export default function IndicadoresFinanceiros(props) {
    const [visualizacao, setVisualizacao] = useState('barra');

    return (
        <>
            <div className="container indicadores" style={{ paddingBottom: 0 }}>
                <h1 className="line_after">Indicadores financeiros</h1>
                <p>Dúvidas para entender os indicadores financeiros? 
                    <strong><a href="/blog/artigo/8" className="link">Leia nosso artigo sobre o assunto e entenda o que cada um significa!</a></strong>
                </p>
            </div>

            <div className="container row charts_section indicadores" style={{ paddingTop: 0 }}>
                {nubank.length > 0 ?
                    (
                        <div className="column wrap_data">
                            <div className="wrap_filter">
                                <label>Tipo de visualização: </label>
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

                            {visualizacao === 'tabela' ?
                                <Table dados={nubank} /> :
                                <ChartIndicadores dados={nubank} />}
                        </div>) :
                    (<p style={{ textAlign: 'center' }}>Nenhum indicador financeiro encontrado.</p>)}
            </div>
        </>
    )
}

