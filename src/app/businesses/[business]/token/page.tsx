import { AssetDetail, getBusinessToken } from "@/components/details";
export default async function BusinessTokenPage({params}:{params:Promise<{business:string}>}){const {business}=await params;return <AssetDetail asset={getBusinessToken(business)}/>}
