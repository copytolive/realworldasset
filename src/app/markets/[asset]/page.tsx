import { AssetDetail, getCryptoAsset } from "@/components/details";
export default async function CryptoAssetPage({params}:{params:Promise<{asset:string}>}){const {asset}=await params;return <AssetDetail asset={getCryptoAsset(asset)}/>}
