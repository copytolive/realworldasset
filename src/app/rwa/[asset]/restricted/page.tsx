import { EligibilityGuard } from "@/components/compliance";
import { EligibilityParityChrome } from "@/components/compliance/ComplianceParity";

export const dynamicParams = false;

export function generateStaticParams(){
  return ["marina-bay-residences","marina-bay-residences-regulated","seaside-private-credit-fund"].map(asset=>({asset}));
}

export default async function RestrictedRwaPage({params}:{params:Promise<{asset:string}>}){
  const {asset}=await params;
  return <>
    <EligibilityParityChrome assetSlug={asset}/>
    <EligibilityGuard assetSlug={asset}/>
  </>;
}
