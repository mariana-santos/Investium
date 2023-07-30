import { useState, useEffect, useContext } from "react";
import ReactLoading from 'react-loading';
import { ComparacaoContext } from "../../CompararIPOs";

import { useQuery } from "react-query";

import { API_baseurl } from '../../../services/utils';

export default function SelecaoOferta({ id, step }) {

  const [empresas, setEmpresas] = useState([]);
  const [oferta1, setOferta1] = useState({});
  const [oferta2, setOferta2] = useState({});
  const [selecao, setSelecao] = useState('');

  const { setOfertas, ofertas } = useContext(ComparacaoContext);

  const { isLoading, error, data } = useQuery('empresas', () =>
    fetch(API_baseurl + '/empresa')
      .then(resp => resp.json())
  );

  useEffect(() => {
    if (!isLoading && !error) {
      if (step == 2 && id) {
        const ofertaAtual = data.find((empresa) => empresa.id === id)
        const outrasEmpresas = data.filter((empresa) => empresa.id !== id)
        setOferta1(ofertaAtual);
        setEmpresas(outrasEmpresas);
        setOferta2(outrasEmpresas[0]);
      }

      else if (step == 1) {
        setOferta1(data[0])
        setEmpresas(data);
      }

      else {
        const outrasEmpresas = data.filter((empresa) => empresa.id !== ofertas[0].id)
        setEmpresas(outrasEmpresas);
        setOferta2(outrasEmpresas[0]);
      }
    }

  }, [isLoading, error, data, id, step]);

  useEffect(() => {

    if (oferta2 === undefined || oferta2 === {}) setOferta2(empresas[0]);
    if (oferta1 === undefined || oferta1 === {}) setOferta1(empresas[0]);
    setOfertas([oferta1, oferta2]);

  }, [oferta1, oferta2, empresas, setOfertas]);

  const handleSelecaoChange = (e) => {
    setSelecao(e.target.value);
  };

  useEffect(() => {
    if (selecao !== '') {
      const ofertaSelecionada = empresas.find((empresa) => empresa.nome === selecao);
      step == 1 ? setOferta1(ofertaSelecionada) : setOferta2(ofertaSelecionada);
    }
  }, [empresas, selecao]);

  
  return (
    <div className='wrap_options'>
      {isLoading ? (
        <div className="wrap_loading">
          <ReactLoading type="spinningBubbles" color='#444' />
          <p>Carregando empresas...</p>
        </div>
      ) : (
        <>
          {empresas?.map((ipo, index) => {
          return (
            <label key={ipo.id}>
              <input
                type="radio"
                name="empresa"
                value={ipo.nome}
                defaultChecked={
                  (step === 1 && index === 0) ||
                  (step === 2 && index === 1) // Change this line to index === 1 for step 2
                }
                onChange={handleSelecaoChange}
              />
              <div className="option wrap_img" style={{ background: ipo.cor }}>
                <span className='logo' style={{ backgroundImage: `url(${ipo.imagem})` }} />
                <h3>{ipo.nome}</h3>
              </div>
            </label>
          )})}
        </>
      )}
    </div>
  );
}
