import Header from "../../../Components/Header";
import Footer from "../../../Components/Footer";

import './style.css'

import IndicadoresFinanceiros from "./IndicadoresFinanceiros";
import ApresentacaoEmpresa from "./ApresentacaoEmpresa"
import Governanca from "./Governanca";
import Topo from "./Topo";
import SecaoTexto from "./SecaoTexto";

import { useParams } from "react-router-dom";

import ReactLoading from 'react-loading'

import BalancoPatrimonial from "./BalancoPatrimonial";

import { useQuery } from "react-query";

import { API_baseurl } from "../../../services/utils";

export default function Oferta() {

    const { id } = useParams()

    // const [oferta, setOferta] = useState({})
    // const [loading, setLoading] = useState(true)

    const { isLoading, error, data: oferta } = useQuery('ofertaUnica', () =>
        fetch(`${API_baseurl}/empresa/${id}`).then(res =>
            res.json()
        )
    )

    return (
        <div>
            <Header />
            <main id="empresa">
                {isLoading ?
                    (
                        <div className='wrap_loading'>
                            <ReactLoading type="spinningBubbles" color='#444' />
                            <p>Carregando empresa...</p>
                        </div>
                    )
                    :
                    (
                        <>
                            <Topo oferta={oferta} />

                            <ApresentacaoEmpresa oferta={oferta} />

                            <SecaoTexto
                                titulo={`Sobre a empresa ${oferta.nome}`}
                                descricao={oferta.descricao}
                                id="sobre"
                            />

                            <IndicadoresFinanceiros oferta={oferta} id={id} />


                            <SecaoTexto
                                titulo="Sobre a oferta (IPO)"
                                descricao={oferta.descricaoIpo}
                                id="oferta"
                            />

                            <Governanca governanca={oferta.governanca} />




                            <BalancoPatrimonial balancos={oferta.balancos} />
                        </>
                    )}

            </main>
            <Footer />
        </div>
    )
}