import Navbar from "../../components/Navbar"
import WhyTravelWithUs from "../../components/WhyTravelWithUs"
import CTA from "./CTA"
import Footer from "./Footer"
import Hero from "./Hero"

const Home = () => {
    return (
        <>
            <Navbar />
            <Hero />
            <WhyTravelWithUs/>
            <CTA/>
            <Footer/>
        </>
    )
}

export default Home
