declare module "next" { export type Metadata = any; }
declare module "next/link" { const Link: any; export default Link; }
declare module "next/navigation" { export function useRouter(): { push(href:string):void; replace(href:string):void; back():void; }; }
