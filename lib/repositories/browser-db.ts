const DB_NAME = 'super-app-private-cache';
const VERSION = 1;
const STORES = ['foods','body','recovery','workouts','exercises','settings','workout-plans','nutrition-targets','active-workout','mutations','query-cache'];
function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION);
    req.onupgradeneeded = () => STORES.forEach((name) => { if (!req.result.objectStoreNames.contains(name)) req.result.createObjectStore(name, { keyPath: 'id' }); });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
export async function idbGetAll<T>(store: string): Promise<T[]> { const db=await openDb(); return new Promise((res,rej)=>{const tx=db.transaction(store,'readonly'); const r=tx.objectStore(store).getAll(); r.onsuccess=()=>res(r.result as T[]); r.onerror=()=>rej(r.error);}); }
export async function idbPut<T extends {id?: string}>(store: string, value: T): Promise<T> { const db=await openDb(); const item={...value,id:value.id ?? crypto.randomUUID()}; return new Promise((res,rej)=>{const tx=db.transaction(store,'readwrite'); const r=tx.objectStore(store).put(item); r.onsuccess=()=>res(item); r.onerror=()=>rej(r.error);}); }
export async function idbDelete(store: string, id: string): Promise<void> { const db=await openDb(); return new Promise((res,rej)=>{const tx=db.transaction(store,'readwrite'); const r=tx.objectStore(store).delete(id); r.onsuccess=()=>res(); r.onerror=()=>rej(r.error);}); }
export async function idbGet<T>(store: string, id: string): Promise<T|undefined> { const db=await openDb(); return new Promise((res,rej)=>{const tx=db.transaction(store,'readonly'); const r=tx.objectStore(store).get(id); r.onsuccess=()=>res(r.result as T|undefined); r.onerror=()=>rej(r.error);}); }
