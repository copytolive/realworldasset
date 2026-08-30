import { RoutePlaceholder } from "@/components/public";
import { CommerceRoute } from "@/components/commerce";

export const dynamicParams = false;

export function generateStaticParams() {
  const fixed = [
    "about","account/activity","account/api","account/billing","api","blog","careers",
    "community","community/compose","community/thesis/alex-kopi-buy","community/thesis/kopi-bali-update",
    "community/thesis/kopi-long-term-value","community/users/alex-morgan","docs","docs/security",
    "help","help/contact","intelligence","listing-request","markets","merchant","portfolio/holdings",
    "portfolio/orders","portfolio/transactions","portfolio/allocation","press","privacy","pro",
    "risk-disclosure","settings","settings/security","status","terms","rwa/kopi/alerts",
    "positions/POS-KOPI-001/risk","rwa/kopi/activity","checkout","account/orders",
    "account/orders/RWA-ORD-20240516-9F7A2B/dispute",
    ...[1,2,3].map(i => `intelligence/btc-${i}`),
    ...[1,2,3,4].map(i => `community/thesis/btc-${i}`),
  ];
  const businesses = ["kopi-nusantara","seablue-estate","harbourview-asset-management"];
  const businessRoutes = businesses.flatMap(b => [
    `businesses/${b}/store`,`businesses/${b}/updates`,
    `businesses/${b}/transparency`,`businesses/${b}/about`,`businesses/${b}/store/locations`,
    `businesses/${b}/contact`,`businesses/${b}/token/activity`,`businesses/${b}/token/disclosures`,
    `businesses/${b}/token/tokenomics`,`businesses/${b}/token/utility`,`businesses/${b}/token/vesting`,
    ...[1,2,3,4,5,6,7,8].map(i => `businesses/${b}/store/products/${i}`),
    ...[1,2,3].map(i => `businesses/${b}/updates/${i}`),
  ]);
  const rwaAssets = ["marina-bay-residences","marina-bay-residences-regulated","seaside-private-credit-fund"];
  const rwaRoutes = rwaAssets.flatMap(a => [
    ...["activity","underlying-asset","underlying","documents","cashflows","legal","valuation","terms"].map(x => `rwa/${a}/${x}`),
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
  const {slug}=await params; const path=`/${slug.join("/")}`;
  if(path==="/checkout"||path==="/account/orders"||path.includes("/account/orders/")&&path.endsWith("/dispute")||path.match(/^\/businesses\/[^/]+\/store(?:\/products\/[^/]+)?$/))return <CommerceRoute path={path}/>;
  return <RoutePlaceholder title={titleCase(slug)} path={path}/>;
}
