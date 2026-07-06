import Link from "next/link";

export default function AppNavigation() {
  return (
    <nav className="nav">
      <strong>Genesis OS</strong>

      <div>
        <Link href="/">Home</Link>
        <Link href="/wallet">Wallet</Link>
        <Link href="/vault">Capital Vault</Link>
        <Link href="/exchange">Exchange</Link>
        <Link href="/marketplace">Marketplace</Link>
        <Link href="/developers">Developers</Link>
      </div>
    </nav>
  );
}