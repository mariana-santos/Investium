import '../style.css'
import Button from "../../Button"
import atualizacao_icon from '../../../Assets/Icons/icon_arrow_down.svg'

import { VscEdit } from 'react-icons/vsc'
import { MdDeleteOutline, MdOutlineBookmarkBorder, MdOutlineBookmark } from 'react-icons/md'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'

import { useState, useEffect } from 'react'
import Modal from '../../Modal'

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { Step, Stepper, StepLabel } from '@mui/material'

import { Link } from 'react-router-dom'

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useQuery } from 'react-query'
import { API_baseurl } from '../../../services/utils'

export default function Card(props) {
    const { tipo, dados, admOptions } = props

    return (<IPO item={dados} admOptions={admOptions} />)
}

function IPO(props) {

    const userData = sessionStorage.getItem('dadosUsuario');
    let user = null
    if (userData) user = JSON.parse(userData);

    const { isLoading, error, data } = useQuery('perfil', () =>
        fetch(`${API_baseurl}/login/${user?.email}/${user?.senha}`)
            .then(resp => resp.json())
    );

    const [empresas, setEmpresas] = useState([])

    useEffect(() => {
        if (user && !isLoading && !error) {
            if (data?.nome && data?.email && data?.senha) {
                setEmpresas(data.empresas)
            }
        }
    }, [isLoading, error, data])

    useEffect(() => {
        setSaved(empresas.some((empresa) => empresa.id === id))
    }, [empresas])

    const { id, imagem, nome, ativoIpo, cor, valorInicialIpo } = props.item

    const status = ativoIpo ? 'ativa' : 'finalizada'

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

    function handleUnsave() {
        if (user) {
    
          fetch(`${API_baseurl}/usuario/${user.email}/empresa/${id}`, {
            method: 'DELETE',
          })
            .then(response => response.json())
            .catch(error => {
              console.log(error);
            });
    
          setSaved(prevState => !prevState)
        } else {
          toast.error('Você precisa estar logado para salvar uma empresa!')
        }
      }
    
      function handleSave() {
        if (user) {
    
          fetch(`${API_baseurl}/usuario/${user.email}/empresa/${id}`, {
            method: 'POST'
          })
            .then(response => response.json())
            .catch(error => {
              console.log(error);
            });
    
          setSaved(prevState => !prevState)
    
        } else {
          toast.error('Você precisa estar logado para salvar uma empresa!')
        }
      }

    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set());
    const steps = ["Passo 1", "Passo 2", "Passo 3"];

    // const handleNext = () => {
    //     let newSkipped = skipped;
    //     setActiveStep(prevActiveStep => prevActiveStep + 1);
    //     setSkipped(newSkipped);
    // };

    // const handleBack = () => {
    //     setActiveStep(prevActiveStep => prevActiveStep - 1);
    // };

    const [isSaved, setSaved] = useState(false)

    return (
        <>
            {props.admOptions &&
                <>
                    {/* Modal de confirmação de exclusão */}
                    {/* <Modal
                        show={showDelete}
                        onClose={toggleModalDelete}
                        title={'Excluir IPO'}
                    >
                        <p>Tem certeza que deseja excluir essa IPO? <br /> Essa ação não poderá ser desfeita</p>

                        <div className='modal_footer'>
                            <button className="btn btn_tertiary" onClick={toggleModalDelete}>Cancelar</button>
                            <button className="btn btn_primary" onClick={toggleModalDelete}>Excluir</button>
                        </div>
                    </Modal> */}

                    {/* Modal de edição */}
                    {/* <Modal
                        show={showEdit}
                        onClose={toggleModalEdit}
                        title={'Editar IPO'}
                    >

                        <Stepper activeStep={activeStep} >
                            {steps.map((label, index) => {
                                const stepProps = {};
                                const labelProps = {};
                                return (
                                    <Step key={label} {...stepProps}>
                                        <StepLabel {...labelProps}>{label}</StepLabel>
                                    </Step>
                                );
                            })}
                        </Stepper>

                        {activeStep === 0 ? (<Step1 />) : activeStep === 1 ? (<Step2 />) : <Step3 />}

                        <div className='modal_footer'>
                            <button className="btn btn_tertiary" onClick={activeStep === 2 || activeStep === 0 ? toggleModalEdit : handleBack}>
                                {activeStep === 2 || activeStep === 0 ? 'Cancelar' : 'Voltar'}
                            </button>

                            <button className="btn btn_primary" onClick={activeStep === 2 ? toggleModalEdit : handleNext}>
                                {activeStep === 2 ? 'Editar' : 'Continuar'}
                            </button>
                        </div>
                    </Modal> */}

                </>}

            <article className="card ipo">
                <div className="card_content">
                    <Link to={`/empresas/ipo/${id}`} className='wrap_img' style={{ background: cor }}>
                        {imagem && <img src={imagem} className="logo" alt="logo" />}
                    </Link>

                    <h3 className="c_title">{nome}</h3>
                    <small className={status}>{status}</small>
                    <p className='valor'><span>R$</span>{valorInicialIpo.toFixed(2).replace('.', ',')}</p>

                    {/* Se ele for adm, mostra os campos de edição e exclusão */}
                    {props.admOptions &&
                        <>
                            {/* <MdDeleteOutline className='icon_opt delete' onClick={toggleModalDelete} />
                            <VscEdit className='icon_opt edit' onClick={toggleModalEdit} /> */}
                        </>}

                    <a onClick={isSaved ? handleUnsave : handleSave}>
                        {isSaved ?
                            <MdOutlineBookmark className='icon_opt save' /> :
                            <MdOutlineBookmarkBorder className='icon_opt save' />}
                    </a>

                    {/* <span className={atualizacao[0]+ ' atualizacao'}>
                    <img src={atualizacao_icon} />
                    {atualizacao[1]}
                </span> */}

                    <Button
                        link={`/empresas/ipo/${id}`}
                        icon_name="arrow"
                        texto="mais detalhes"
                        style="secondary"
                    />

                </div>
            </article>
        </>
    )
}

// function Step1() {
//     return (
//         <div>
//             <label htmlFor="titulo">Título</label>
//             <div className="wrap_input">
//                 <input type="text" placeholder="Digite o nome da empresa" id="empresa" />
//             </div>

//             <div className='row'>
//                 <div>
//                     <label htmlFor="valor">Valor inicial (R$)</label>
//                     <div className="wrap_input">
//                         <input type="number" placeholder="Digite o valor inicial da IPO" id="valor" min={1} />
//                     </div>
//                 </div>

//                 <div>
//                     <label htmlFor="setor">Setor</label>
//                     <select id='setor' className='wrap_input'>
//                         <option>Alimentício</option>
//                         <option>Bancário</option>
//                         <option>Agronegócio</option>
//                     </select>
//                 </div>
//             </div>

//             <div className='row'>
//                 <div>
//                     <label htmlFor="valor">CNPJ</label>
//                     <div className="wrap_input">
//                         <input type="text" placeholder="Digite o CNPJ da empresa" id="cnpj" />
//                     </div>
//                 </div>

//                 <div>
//                     <label htmlFor="status">Status</label>
//                     <select id='status' className='wrap_input'>
//                         <option>Ativa</option>
//                         <option>Finalizada</option>
//                     </select>
//                 </div>
//             </div>

//             <label htmlFor="prospecto">
//                 {/* <AiOutlineFileImage /> */}
//                 Prospecto
//             </label>
//             <div className='wrap_input'>
//                 <input type="file" id="prospecto" className="file_input" />
//             </div>
//         </div>
//     )
// }

// function Step2() {
//     return (
//         <div>
//             <h2>Membros da diretoria: </h2>
//             <label htmlFor="nome_membro">Nome</label>
//             <div className="wrap_input">
//                 <input type="text" placeholder="Digite o nome do membro da diretoria" id="nome_membro" />
//             </div>

//             <div className='row'>
//                 <div>
//                     <label htmlFor="cargo">Cargo</label>
//                     <div className="wrap_input">
//                         <input type="text" placeholder="Digite o cargo do membro" id="cargo" />
//                     </div>
//                 </div>

//                 <div>
//                     <label htmlFor="imagem">
//                         {/* <AiOutlineFileImage /> */}
//                         Imagem de perfil
//                     </label>
//                     <div className='wrap_input'>
//                         <input type="file" id="imagem" className="file_input" />
//                     </div>
//                 </div>
//             </div>

//             <button className="btn btn_primary" style={{ marginBottom: "1.5em" }}>Cadastrar membro</button>

//             <label htmlFor="conteudo">Sobre a empresa</label>
//             <ReactQuill theme="snow" id="sobre" />
//         </div>
//     )
// }

// function Step3() {
//     return (
//         <div>
//             <label htmlFor="destino">Destino dos recursos:</label>
//             <ReactQuill theme="snow" id="destino" style={{ marginBottom: "1em" }} />

//             <label htmlFor="indicadores">
//                 Indicadores financeiros <a href='#'>(acesse o modelo de planilha aqui.)</a>
//             </label>
//             <div className='wrap_input'>
//                 <input type="file" id="indicadores" className="file_input" />
//             </div>

//             <label htmlFor="indicadores">
//                 Balanços patrimoniais ativos <a href='#'>(acesse o modelo de planilha aqui.)</a>
//             </label>
//             <div className='wrap_input'>
//                 <input type="file" id="balancos" className="file_input" />
//             </div>
//         </div>
//     )
// }
