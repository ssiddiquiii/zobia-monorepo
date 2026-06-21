import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import ShopByType from "./components/ShopByType";
import ProductCategories from "./components/ProductCategories";
import Bestsellers from "./components/Bestsellers";
import Locations from "./components/Locations";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <section id="shop-by-type">
        <ShopByType />
      </section>
      <section id="categories">
        <ProductCategories />
      </section>
      <section id="bestsellers">
        <Bestsellers />
      </section>
      <section id="locations">
        <Locations />
      </section>
      <Footer />
    </main>
  );
}