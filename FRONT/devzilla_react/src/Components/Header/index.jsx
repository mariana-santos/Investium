import { ReactComponent as IconPerson } from '../../Assets/Icons/icon_person.svg'
import { ReactComponent as IconSave } from '../../Assets/Icons/icon_save.svg'
import { ReactComponent as IconSearch } from '../../Assets/Icons/icon_search.svg'

import './style.css'

import Menu from '../RotasMenu'

export default function Header(){

    // DIMINUIR O MENU QUANDO O USUÁRIO SCROLLA
    let prevScrollpos = window.pageYOffset;
    window.onscroll = function() {
    let currentScrollPos = window.pageYOffset;
    
    if(window.scrollY>150){
        if (prevScrollpos > currentScrollPos) {
            document.querySelector("header").style.top = "0";
            document.querySelector("header").style.paddingBottom = "3em";
        } else {
            document.querySelector("header").style.top = "-15vh";
            document.querySelector("header").style.paddingBottom = "1em";
        }
        prevScrollpos = currentScrollPos;
    }
}
    return(
        <header>
            <div className="row">
                <a href="index.html">
                    <h1 className="logo">devzilla</h1>
                </a>

                <section>
                    <a href="perfil_usuario.html" className="my_account">
                        <IconPerson />
                        minha conta
                    </a>

                    <a href="perfil_usuario.html#artigos_salvos" className="saved">
                        <IconSave />
                        itens salvos
                    </a>

                    <small>Ainda não tem conta? <strong><a href="cadastro.html" className="text_blue">cadastre-se</a></strong> ou <strong><a href="login.html" className="text_blue">faça login</a></strong></small>
                </section>
            </div>

            <div className="row btns_menu">
                
                {/* HasButton indica que na versão mobile do site vai aparecer o btn hamburguer que abre o menu */}
                <Menu hasButton />

                <div className="search">
                    <input type="text" placeholder="O que você está procurando?" />
                    <button className="btn btn-primary">
                        <IconSearch />
                    </button>
                </div>
            </div>
        </header>
    )
}