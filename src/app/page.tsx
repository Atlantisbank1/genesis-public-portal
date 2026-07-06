import Dictionary from "../components/Dictionary";
import DeveloperCenter from "../components/DeveloperCenter";
import Footer from "../components/Footer";
import GenesisWorkspace from "../components/workspace/GenesisWorkspace";
import Hero from "../components/Hero";
import InstitutionCenter from "../components/InstitutionCenter";
import LiquidityCenter from "../components/LiquidityCenter";
import NetworkDashboard from "../components/NetworkDashboard";
import StatusBar from "../components/StatusBar";
import TokenizationCenter from "../components/TokenizationCenter";

export default function Home() {
  return (
    <main className="site">
      <Hero />
      <StatusBar />
      <GenesisWorkspace />
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