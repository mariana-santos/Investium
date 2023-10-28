import './style.css'
import Button from "../../Button"

import { VscEdit } from 'react-icons/vsc'
import { MdDeleteOutline, MdOutlineBookmarkBorder, MdOutlineBookmark } from 'react-icons/md'

import { useState, useEffect } from 'react'
import Modal from '../../Modal'

// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

import { toast } from 'react-toastify'

import { useQuery } from 'react-query'
import { API_baseurl } from '../../../services/utils'

export default function Card(props) {
  const { dados, admOptions } = props

  return <Materia item={dados} admOptions={admOptions} />
}

function Materia(props) {
  const userData = sessionStorage.getItem('dadosUsuario');
  let user = null
  if (userData) user = JSON.parse(userData);

  const [postagens, setPostagens] = useState([])

  const { isLoading, error, data } = useQuery('perfil', () =>
    fetch(`${API_baseurl}/login/${user?.email}/${user?.senha}`)
      .then(resp => resp.json())
  );

  useEffect(() => {
    if (user && !isLoading && !error) {
      if (data.nome && data.email && data.senha) {
        setPostagens(data.postagens)
      }
    }
  }, [isLoading, error, data])

  useEffect(() => {
    setSaved(postagens.some((post) => post.id === id))
  }, [postagens])

  const { id, imgUrl, titulo, conteudo } = props.item

  const [isSaved, setSaved] = useState(false)

  const [showEdit, setShowEdit] = useState(false)
  const toggleModalEdit = (e) => {
    e.preventDefault()
    setShowEdit(prevState => !prevState)
  }

  const [showDelete, setShowDelete] = useState(false)
  const toggleModalDelete = (e) => {
    e.preventDefault();
    setShowDelete(prevState => !prevState);
  }

  const handleDelete = () => {
    // fetch('')
  }

  function handleUnsave() {
    if (user) {

      fetch(`${API_baseurl}/usuario/${user.email}/postagem/${id}`, {
        method: 'DELETE',
      })
        .then(response => response.json())
        .catch(error => {
          console.log(error);
        });

      setSaved(prevState => !prevState)
    } else {
      toast.error('Você precisa estar logado para salvar uma matéria!')
    }
  }

  function handleSave() {
    if (user) {

      fetch(`${API_baseurl}/usuario/${user.email}/postagem/${id}`, {
        method: 'POST'
      })
        .then(response => response.json())
        .catch(error => {
          console.log(error);
        });

      setSaved(prevState => !prevState)

    } else {
      toast.error('Você precisa estar logado para salvar uma matéria!')
    }
  }

  return (
    <>
      {props.admOptions && (
        <>
          {/* Modal de confirmação de exclusão */}
          {/* <Modal
            show={showDelete}
            onClose={toggleModalDelete}
            title={'Excluir matéria'}
          >
            <p>Tem certeza que deseja excluir essa matéria? <br /> Essa ação não poderá ser desfeita</p>

            <div className='modal_footer'>
              <button className="btn btn_tertiary" onClick={handleDelete}>Cancelar</button>
              <button className="btn btn_primary" onClick={toggleModalDelete}>Excluir</button>
            </div>
          </Modal> */}

          {/* Modal de edição */}
          {/* <Modal
            show={showEdit}
            onClose={toggleModalEdit}
            title={'Editar matéria'}
          >
            <label htmlFor="titulo">Título</label>
            <div className="wrap_input">
              <input type="text" placeholder="Digite o título da matéria" id="titulo" />
            </div>

            <label htmlFor="categoria">Categoria</label>
            <select id='categoria' className='wrap_input'>
              <option>IPO</option>
              <option>Educação financeira</option>
              <option>Investimento</option>
              <option>Bolsa de valores</option>
            </select>

            <label className="file-input__label" htmlFor="imagem">
              Imagem destacada
            </label>
            <div className='wrap_input'>
              <input type="file" id="imagem" className="file_input" />
            </div> */}

            {/* Editor do conteúdo do artigo */}
            {/* <label htmlFor="conteudo">Conteúdo</label>
            <ReactQuill theme="snow" id="conteudo" />

            <div className='modal_footer'>
              <button className="btn btn_tertiary" onClick={toggleModalEdit}>Cancelar</button>
              <button className="btn btn_primary" onClick={toggleModalEdit}>Salvar</button>
            </div>
          </Modal> */}
        </>
      )}

      <article className="card artigo">
        <a href={`/blog/artigo/${id}`} className='wrapper_img'>
          <img src={require(`../../../Assets/Images/blog/${imgUrl}`)} alt="Imagem destacada" />

          {/* Se ele for adm, mostra os campos de edição e exclusão */}
          {props.admOptions && (
            <>
              {/* <MdDeleteOutline className='icon_opt delete' onClick={toggleModalDelete} />
              <VscEdit className='icon_opt edit' onClick={toggleModalEdit} /> */}
            </>
          )}

        </a>
        <div className="card_content" id={typeof (props.admOptions)}>
          <h3 className="c_title">{titulo}</h3>
          <small>{conteudo.replace(/\\n/g, ' ')}</small>

          <div className='card_footer'>
            <Button
              link={`/blog/artigo/${id}`}
              icon_name="arrow"
              texto="ler mais"
              style="secondary"
            />
            <>
              <a onClick={isSaved ? handleUnsave : handleSave}>
                {isSaved ? (
                  <MdOutlineBookmark className='icon_opt save' />
                ) : (
                  <MdOutlineBookmarkBorder className='icon_opt save' />
                )}
              </a>
            </>
          </div>
        </div>
      </article>
    </>
  )
}