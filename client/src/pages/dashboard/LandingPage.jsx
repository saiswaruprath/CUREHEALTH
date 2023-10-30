import aahnpiflier from '../../assets/images/flier.jpg'
import MySection from '../../components/MySection';
import './LandingPage.scss';

import img1 from '../../assets/images/therapist-office.jpg';
import img2 from '../../assets/images/therapist-office.jpg';
import img3 from '../../assets/images/therapist-office.jpg';


const LandingPage = () => {


    return <>
        <div className='snap-container'>
            <section className='bgRed'>
                <h3 className='mb-4 custom-heading'>A Safe Space for Healing</h3>
                {/* <img src={img3} alt="" /> */}
                <span>Step into a safe space where healing begins.</span>
            </section>
            <section className='bgBlue'>
                <h3 className='mb-4 custom-heading'>Your Journey to Wellness</h3>
                {/* <img src={img3} alt="" /> */}
                <span>Every step on your journey to wellness is important. We're here to guide you.</span>
            </section >
            <section className='bgGreen'>
                <h3 className='mb-4 custom-heading'>Let's Start Together</h3>
                {/* <img src={img3} alt="" /> */}
                <span>Let's take the first step together towards a healthier, happier you. Contact us to get started.</span>
            </section>
        </div>
    </>;
}

export default LandingPage;