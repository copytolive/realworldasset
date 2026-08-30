import { BusinessProfile } from "@/components/details";
export default async function BusinessDetailPage({params}:{params:Promise<{business:string}>}){const {business}=await params;return <BusinessProfile slug={business}/>}
