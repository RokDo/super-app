export type Meal = 'breakfast'|'lunch'|'dinner'|'snacks'|'other';
export type SyncState = 'Saved locally'|'Syncing'|'Synced'|'Sync failed';
export type Food = {id?:string; loggedAt?:string; meal:Meal; name:string; calories?:number|null; protein?:number|null; carbohydrates?:number|null; carbs?:number|null; fat?:number|null; fiber?:number|null; notes?:string; photoPath?:string; syncState?:SyncState};
export type Body = {id?:string; measuredAt?:string; date?:string; weightKg?:number|null; bodyFatPercent?:number|null; waistCm?:number|null; chestCm?:number|null; leftArmCm?:number|null; rightArmCm?:number|null; leftThighCm?:number|null; rightThighCm?:number|null; hipsCm?:number|null; shouldersCm?:number|null; neckCm?:number|null; notes?:string; syncState?:SyncState};
export type Recovery = {id?:string; checkedAt?:string; sleepHours?:number|null; sleepQuality?:number|null; energy?:number|null; stress?:number|null; motivation?:number|null; soreness?:number|null; pain?:boolean; painArea?:string; notes?:string; syncState?:SyncState};
export type WorkoutSet = {id?:string; weight?:number|string|null; reps?:number|string|null; rpe?:number|string|null; setType?:'warm-up'|'working'|'drop'|'failure'|'custom'; type?:string; completed?:boolean};
export type WorkoutExercise = {id?:string; name:string; sets:WorkoutSet[]};
export type Workout = {id?:string; startedAt?:string; date?:string; finishedAt?:string|null; notes?:string; exercises:WorkoutExercise[]; syncState?:SyncState};
export type Exercise = {id?:string; name:string; muscleGroup?:string; equipment?:string; category?:string; instructions?:string; syncState?:SyncState};
export type Settings = {displayName?:string; goalType?:string; goalWeightKg?:number|null; timezone?:string; weekStartDay?:string; calorieTarget?:number|null; proteinTarget?:number|null; carbohydrateTarget?:number|null; fatTarget?:number|null; fiberTarget?:number|null; waterTargetMl?:number|null; syncState?:SyncState};
export type ResourceMap = {foods:Food; body:Body; recovery:Recovery; workouts:Workout; exercises:Exercise};
export interface ListRepository<T>{list():Promise<T[]>; save(item:T):Promise<T>; delete(id:string):Promise<void>}
export interface SettingsRepository{get():Promise<Settings>; save(item:Settings):Promise<Settings>}
export interface AppRepositories{foods:ListRepository<Food>; body:ListRepository<Body>; recovery:ListRepository<Recovery>; workouts:ListRepository<Workout>; exercises:ListRepository<Exercise>; settings:SettingsRepository; workoutPlans:ListRepository<Record<string, unknown>>; nutritionTargets:SettingsRepository}
