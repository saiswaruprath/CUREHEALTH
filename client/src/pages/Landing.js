
import Ohana from '../assets/images/ohana.png'
import Wrapper from '../assets/wrappers/LandingPage'
import { Logo } from '../components'
import { Link } from 'react-router-dom'
const Landing = () => {
  return (
    <Wrapper>
        <nav>
           {/* <Logo/> */}
        </nav>
        <div className='container page'>
            <div className='info'>
                <h1>
                    Cure <span> for</span> health
                </h1>
                <p><strong>
                    Welcome to the Ohana Resource Bank!
                    </strong>
                </p>
                <p>
                We have begun compiling a collection of culturally and linguistically appropriate resources for Asian Americans, Native Hawaiians, and Pacific Islanders to include: community based organizations, 
                websites, articles, and information in behavioral health.
                </p>
                <Link to='/register' className='btn btn-hero'>
                    Login/Register
                </Link>
            </div>
            <img src={Ohana} alt="job hunt" className='img main-img' />
        </div>
    </Wrapper>
  )
}



export default Landing