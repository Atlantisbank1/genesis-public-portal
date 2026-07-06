import Dictionary from "../components/Dictionary";
import DeveloperCenter from "../components/DeveloperCenter";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import InstitutionCenter from "../components/InstitutionCenter";
import LiquidityCenter from "../components/LiquidityCenter";
import NetworkDashboard from "../components/NetworkDashboard";
import StatusBar from "../components/StatusBar";
import TokenizationCenter from "../components/TokenizationCenter";

export default function Home() {
  return (
    <main className="site">
      <nav className="nav">
        <strong>Genesis Capital Network</strong>
        <div>
          <a href="#network">Network</a>
          <a href="#liquidity">Liquidity</a>
          <a href="#tokenization">Tokenization</a>
          <a href="#developers">Developers</a>
          <a href="#institutions">Institutions</a>
          <a href="#dictionary">Dictionary</a>
        </div>
      </nav>

      <Hero />
      <StatusBar />
      <NetworkDashboard />
      <LiquidityCenter />
      <TokenizationCenter />
      <DeveloperCenter />
      <InstitutionCenter />
      <Dictionary />
      <Footer />
    </main>
  );
}