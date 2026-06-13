declare namespace JSX { interface IntrinsicElements { [elemName: string]: any } interface ElementChildrenAttribute { children: {} } }
declare module 'react' { export type ReactNode = any; export function useState<T>(initial:T|(()=>T)):[T,(value:T|((prev:T)=>T))=>void]; export function useEffect(effect:()=>void|(()=>void),deps?:unknown[]):void; export function useMemo<T>(factory:()=>T,deps:unknown[]):T; }
declare module 'next' { export type Metadata=Record<string,unknown>; export type Viewport=Record<string,unknown>; }
declare module 'next/link' { const Link:any; export default Link; }
declare module 'next/navigation' { export function usePathname():string; }
declare module 'next/server' { export class NextResponse { static json(body:unknown,init?:{status?:number}):Response } }

declare module 'next/headers' { export function cookies(): Promise<{ get(name:string): { value:string } | undefined; set(name:string,value:string,opts?:Record<string,unknown>): void; delete(name:string): void }> }
declare const process: { env: Record<string, string | undefined>; cwd(): string };
declare module 'node:fs' { const fs: { readFileSync(path: string, encoding: string): string }; export default fs; }
declare module 'vitest' { export const describe: any; export const it: any; export const expect: any; export const vi: any; export const beforeEach: any; export const afterEach: any; }
declare module 'zod' { export type ZodSchema<T = any> = { parse(v: unknown): T; safeParse?(v: unknown): any }; export const z: any; }
declare module 'zod-to-json-schema' { export function zodToJsonSchema(schema: unknown, name?: string): Record<string, unknown>; }
declare module '*.css';
