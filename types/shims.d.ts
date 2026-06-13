declare namespace JSX { interface IntrinsicElements { [elemName: string]: any } interface ElementChildrenAttribute { children: {} } }
declare module 'react' { export type ReactNode = any; export function useState<T>(initial:T|(()=>T)):[T,(value:T|((prev:T)=>T))=>void]; export function useEffect(effect:()=>void|(()=>void),deps?:unknown[]):void; export function useMemo<T>(factory:()=>T,deps:unknown[]):T; }
declare module 'next' { export type Metadata=Record<string,unknown>; export type Viewport=Record<string,unknown>; }
declare module 'next/link' { const Link:any; export default Link; }
declare module 'next/navigation' { export function usePathname():string; }
declare module 'next/server' { export class NextResponse { static json(body:unknown,init?:{status?:number}):Response } }
