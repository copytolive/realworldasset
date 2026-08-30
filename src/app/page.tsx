import Link from "next/link";
import { PublicShell } from "@/components/public";
import "./landing.css";

const featured = [
  ["Kopi Nusantara","F&B · Indonesia","SKOPI","$248.5M","$2.48","+8.72%"],
  ["Marina Bay Residences","Real Estate · Singapore","SSEA","$482.3M","$1.92","+6.31%"],
  ["Blue Ocean Shipping","Maritime · UAE","SSHIP","$356.8M","$1.35","+3.20%"],
  ["Private Credit Fund","Private Credit · Global","PCST","$612.4M","$1.08","+4.51%"],
] as const;

const features = [
  ["Discover Businesses","Explore verified real businesses across real estate, private credit, infrastructure, and more.","/businesses","▥"],
  ["Invest in RWA","Gain exposure to tokenized real-world assets with transparent on-chain data.","/rwa","◫"],
  ["Trade Tokens","Trade business tokens on deep liquidity markets with best execution.","/markets","↕"],
  ["Earn Rewards","Stake, hold, and participate to earn rewards and access exclusive allocations.","/rewards","♢"],
  ["Build Community","Join a global network of investors and business builders.","/community","♙"],
  ["Business OS","Manage, tokenize, and grow your business with our all-in-one platform.","/merchant","◇"],
] as const;

export default function LandingPage(){
  return <PublicShell>
    <main className="rwa-landing">
      <section className="rwa-hero">
        <div className="rwa-hero__copy">
          <h1>Where Businesses<br/>Become <span>Markets</span></h1>
          <p>Discover real businesses, invest in tokenized real-world assets, and access private markets with self-custodial freedom.</p>
          <div className="rwa-hero__actions">
            <Link className="rwa-link-button rwa-link-button--primary" href="/markets">Explore Markets →</Link>
            <Link className="rwa-link-button" href="/businesses">Explore Businesses</Link>
            <Link className="rwa-link-button" href="/rwa">Explore RWA</Link>
          </div>
          <div className="rwa-stats">
            <div><b>1,248+</b><span>Businesses <em>↗18.7%</em></span></div><div><b>$9.87B</b><span>RWA Market Cap <em>↗26.4%</em></span></div><div><b>124K+</b><span>Users <em>↗21.2%</em></span></div><div><b>93+</b><span>Countries <em>↗15.8%</em></span></div>
          </div>
        </div>
        <Link href="/home" className="rwa-dashboard-preview" aria-label="Open authenticated home preview">
          <div className="preview-top"><span>◈ RWA.MS</span><span>⌕ Search markets, businesses, tokens…</span><span>Connect Wallet</span></div>
          <div className="preview-grid"><aside><b>Overview</b><span>Markets</span><span>Businesses</span><span>RWA</span><span>Watchlist</span><span>Portfolio</span></aside><section><h3>Market Overview</h3><div className="preview-kpis"><i>$9.87B <small>+26.4%</small></i><i>$2.48B <small>+18.2%</small></i><i>$194.2M <small>+32.9%</small></i></div><div className="preview-chart"><svg viewBox="0 0 500 120" aria-hidden="true"><polyline fill="none" stroke="#2576ff" strokeWidth="3" points="0,105 30,90 55,95 90,70 120,77 150,50 180,58 220,38 245,46 280,26 310,37 350,20 385,25 420,10 455,18 500,5"/></svg></div></section></div>
        </Link>
      </section>
      <section className="rwa-featured">
        <div className="rwa-section-title"><h2>Featured Businesses & Assets</h2><Link href="/markets">View all markets →</Link></div>
        <div className="rwa-featured-grid">{featured.map(([name,sector,symbol,cap,price,change])=><Link key={symbol} href={`/businesses/${symbol.toLowerCase()}`} className="rwa-market-card"><div><span className="rwa-market-avatar">{name[0]}</span><p><b>{name}</b><small>{sector}</small></p><em>✓ Verified Business</em></div><dl><div><dt>Market Cap</dt><dd>{cap}</dd></div><div><dt>Price</dt><dd>{price}</dd></div><div><dt>24H</dt><dd className="positive">{change}</dd></div></dl></Link>)}</div>
      </section>
      <section className="rwa-everything"><h2>Everything in One Platform</h2><div className="rwa-feature-grid">{features.map(([title,text,href,icon])=><Link key={title} href={href}><span>{icon}</span><div><b>{title}</b><p>{text}</p></div></Link>)}</div></section>
      <section className="rwa-trust"><b>Built on Trusted Infrastructure</b>{["Hyperliquid","Chainlink","Trust Wallet","CIRCLE","Fireblocks"].map(x=><span key={x}>◇ {x}</span>)}</section>
    </main>
    <footer className="rwa-footer"><div><b className="rwa-footer-brand">◈ RWA.MS</b><p>The gateway to real-world assets.<br/>Where businesses become markets.</p></div><div><b>Platform</b><Link href="/markets">Markets</Link><Link href="/businesses">Businesses</Link><Link href="/rwa">RWA</Link></div><div><b>Resources</b><Link href="/docs">Docs</Link><Link href="/blog">Blog</Link><Link href="/help">Help Center</Link></div><div><b>Company</b><Link href="/about">About</Link><Link href="/careers">Careers</Link><Link href="/press">Press</Link></div><div><b>Legal</b><Link href="/privacy">Privacy Policy</Link><Link href="/terms">Terms of Service</Link><Link href="/risk-disclosure">Risk Disclosure</Link></div><div><b>Stay Connected</b><div className="rwa-socials"><a href="https://x.com" target="_blank" rel="noreferrer">X</a><a href="https://discord.com" target="_blank" rel="noreferrer">◉</a><a href="https://telegram.org" target="_blank" rel="noreferrer">➤</a><a href="https://linkedin.com" target="_blank" rel="noreferrer">in</a></div></div></footer>
  </PublicShell>
}
