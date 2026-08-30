import { AssetDetail, getCryptoAsset } from "@/components/details";

export const dynamicParams = false;
export function generateStaticParams() {
  return [{ asset: "btc-usdc" }];
}

export default async function CryptoAssetPage({params}:{params:Promise<{asset:string}>}){
  const {asset}=await params;
  return <AssetDetail asset={getCryptoAsset(asset)}/>;
}
