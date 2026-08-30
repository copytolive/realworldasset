import { DisclosuresDataRoom } from "@/components/compliance";

export const dynamicParams = false;

export function generateStaticParams(){
  return ["marina-bay-residences","marina-bay-residences-regulated","seaside-private-credit-fund"].map(asset=>({asset}));
}

export default async function DisclosuresPage({params}:{params:Promise<{asset:string}>}){
  const {asset}=await params;
  return <DisclosuresDataRoom assetSlug={asset}/>;
}
