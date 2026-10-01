import './styles/home.css';
import img from '../assets/gymfoto.jpg'

function HomePublic({ onRegisterClick }) {
    return (
        <div className="home-public-root">
            <section className="hero">
                <div className="hero-text">
                    <div className="card-red">
                        <h3>Resumen Ejecutivo</h3>
                        <p>
                            Vamos a realizar un sistema multiplataforma web que resolverá la problemática de la empresa HSM Construcciones, la cual se dedica al rubro de gas y plomería.
                        </p>
                        <p>
                            La problemática se encuentra en el control de stock del jefe y los trabajadores, es decir que no hay un control correcto de los materiales que utiliza la empresa y de los materiales que utilizan los trabajadores.
                        </p>
                        <p>
                            Nuestro sistema se encargará de controlar y organizar los materiales para facilitar la eficiencia y conocer las cantidades de materiales y herramientas.
                        </p>
                    </div>
                </div>
                <div className="hero-image">
                    <img src={img} alt="hero" />
                </div>
            </section>

            <section className="cta">
                <div className="cta-inner">
                    <div className="cta-content">
                        <p className="cta-text">
                            El proyecto es viable ya que tenemos contacto directo con la empresa, y podemos estar al tanto de la situación, sumado a que resolvería una problemática que impide el transcurso con normalidad del trabajo.
                        </p>
                        <button className="cta-btn" onClick={onRegisterClick}>REGISTRATE</button>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default HomePublic;