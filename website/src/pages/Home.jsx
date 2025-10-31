import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import Stats from "../components/Stats";
import Recruiters from "../components/Recruiters";
import PlacementProcess from "../components/PlacementProcess";
import Announcements from "../components/Announcements";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <Stats />
        <Recruiters />
        <PlacementProcess />
        <Announcements />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
