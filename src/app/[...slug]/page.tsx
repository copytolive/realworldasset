import { RoutePlaceholder } from "@/components/public";

export const dynamicParams = false;

export function generateStaticParams() {
  const fixed = [
    "about","account","account/activity","account/api","account/billing","api","blog","careers",
    "community","community/compose","community/thesis/alex-kopi-buy","community/thesis/kopi-bali-update",
    "community/thesis/kopi-long-term-value","community/users/alex-morgan","compliance/kyc","docs","docs/security",
    "help","intelligence","listing-request","merchant","notifications","portfolio","press","privacy","pro",
    "reports","rewards","risk-disclosure","settings","settings/security","status","terms","trade/kopi","watchlist",
    "rwa/kopi/activity","rwa/kopi/disclosures","rwa/btc-usdc/disclosures",
    ...[1,2,3].map(i => `intelligence/btc-${i}`),
    ...[1,2,3,4].map(i => `community/thesis/btc-${i}`),
  ];
  const businesses = ["kopi-nusantara","seablue-estate","harbourview-asset-management"];
  const businessRoutes = businesses.flatMap(b => [
    `businesses/${b}/store`,`businesses/${b}/rewards`,`businesses/${b}/updates`,
    `businesses/${b}/transparency`,`businesses/${b}/about`,`businesses/${b}/store/locations`,
    `businesses/${b}/contact`,`businesses/${b}/token/activity`,`businesses/${b}/token/disclosures`,
    `businesses/${b}/token/tokenomics`,`businesses/${b}/token/utility`,`businesses/${b}/token/vesting`,
    ...[1,2,3,4,5].map(i => `businesses/${b}/store/products/${i}`),
    ...[1,2,3].map(i => `businesses/${b}/updates/${i}`),
  ]);
  const rwaAssets = ["marina-bay-residences","marina-bay-residences-regulated","seaside-private-credit-fund"];
  const rwaRoutes = rwaAssets.flatMap(a => [
    ...["activity","disclosures","underlying-asset","underlying","documents","cashflows","legal","valuation","terms"].map(x => `rwa/${a}/${x}`),
    ...[1,2,3,4,5].map(i => `rwa/${a}/documents/${i}`),
  ]);
  const marketRoutes = [
    "markets/btc-usdc/activity","markets/btc-usdc/order-book","markets/btc-usdc/disclosures",
    ...["market-cap","fully-diluted-valuation","circulating-supply","max-supply","24h-volume","liquidity","24h-high","24h-low","all-time-high","all-time-low"].map(x => `markets/btc-usdc/metrics/${x}`),
  ];
  return [...new Set([...fixed,...businessRoutes,...rwaRoutes,...marketRoutes])].map(path => ({ slug: path.split("/") }));
}

function titleCase(parts:string[]){return parts.map(part=>part.replace(/-/g," ").replace(/\b\w/g,c=>c.toUpperCase())).join(" / ")}
export default async function PlaceholderPage({params}:{params:Promise<{slug:string[]}>}){
  const {slug}=await params;
  return <RoutePlaceholder title={titleCase(slug)} path={`/${slug.join("/")}`}/>;
}
