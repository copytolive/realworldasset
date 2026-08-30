import { RoutePlaceholder } from "@/components/public";
function titleCase(parts:string[]){return parts.map(part=>part.replace(/-/g," ").replace(/\b\w/g,c=>c.toUpperCase())).join(" / ")}
export default async function PlaceholderPage({params}:{params:Promise<{slug:string[]}>}){const {slug}=await params;return <RoutePlaceholder title={titleCase(slug)} path={`/${slug.join("/")}`}/>}
