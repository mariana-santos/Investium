
import default_profile from '../../../../Assets/Governanca/user.png'

export default function Governanca({ governanca }) {

    return (
        <section className="container governanca" id="governanca">

            <h1 className="line_after">Diretoria (Governança)</h1>
            {governanca.map(gov => {
                return (
                    <article key={gov.id}>
                        {gov.pessoasGovernanca.map((pessoa) => {
                            return (
                                <div key={pessoa.id}>
                                    <img src={default_profile} alt="" />
                                    <div>
                                        <p>{pessoa.nome}</p>
                                        <small>{pessoa.cargo}</small>
                                    </div>
                                </div>
                            )
                        })}
                    </article>
                )
            })}


        </section>
    )
}