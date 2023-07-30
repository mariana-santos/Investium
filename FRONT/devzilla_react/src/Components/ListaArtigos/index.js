import './style.css'
import Card from './Card'
import Button from '../Button'
import { useEffect, useState } from 'react'

import ReactLoading from 'react-loading';

import { useQuery } from 'react-query'

import { API_baseurl } from '../../services/utils';

import api from '../../services/api';

export default function ListaCards(props) {
  const { tipo, botao, admOptions, max } = props

  const [dados, setDados] = useState(props.dados)

  const { isLoading, error, data } = useQuery(`repo-blog`, () =>
    fetch(`${API_baseurl}/postagem`)
    .then(res => res.json())
  )

  useEffect(() => {
    if (!dados && !isLoading && !error) {
      max ? setDados(data.slice(0, max)) : setDados(data)
    }
  }, [isLoading, error, data])

  return (
    <section className="container bg_gray">
      <h1 className="line_after">Matérias</h1>

      {isLoading ? (
        <div className='wrap_loading'>
          <ReactLoading type="spinningBubbles" color='#444' />
          <p>Carregando artigos...</p>
        </div>
      ) : (
        <div className="lista_cards">

          {/* {dados?.map((artigo) => (
            <Card
              key={artigo.id}
              tipo={tipo}
              dados={artigo}
              admOptions={admOptions}
            />
          ))} */}

        </div>
      )}

      {botao && (
        <Button
          link={'/blog'}
          icon_name="arrow_long"
          texto="Ver todas"
          style="secondary"
        />
      )}
    </section>
  )
}
