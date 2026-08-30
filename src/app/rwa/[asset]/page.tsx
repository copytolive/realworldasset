import { AssetDetail, getRwaAsset } from "@/components/details";
export default async function RwaAssetPage({params}:{params:Promise<{asset:string}>}){const {asset}=await params;return <AssetDetail asset={getRwaAsset(asset)}/>}
