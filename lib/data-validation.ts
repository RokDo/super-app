import { z } from 'zod';

export const optionalText = (max = 5000) => z.preprocess(
  (value: unknown) => (value === undefined ? undefined : value),
  z.string().trim().max(max).nullable().optional(),
).transform((value: string | null | undefined) => (value == null || value === '' ? null : value));

export const optionalNumber = (schema: ReturnType<typeof z.number> = z.number().finite().nonnegative()) => z.preprocess((value: unknown) => {
  if (value === '' || value === null || value === undefined) return undefined;
  if (typeof value === 'string') {
    const number = Number(value.replace(',', '.'));
    return Number.isNaN(number) ? value : number;
  }
  return value;
}, schema.optional());

export const optionalIsoDateTime = z.preprocess((value: unknown) => {
  if (value === '' || value === null || value === undefined) return undefined;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? value : value.toISOString();
  if (typeof value === 'string') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
  }
  return value;
}, z.string().datetime({ offset: true }).optional());

export const optionalDate = z.preprocess((value: unknown) => {
  if (value === '' || value === null || value === undefined) return undefined;
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString().slice(0, 10);
  return value;
}, z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use a valid date.').optional());

const id = z.string().uuid().optional();
const measurementNumber = optionalNumber(z.number().finite().gt(0).max(500));
const bodyFat = optionalNumber(z.number().finite().min(0).max(100));
const macro = optionalNumber(z.number().finite().min(0).max(10000));
const rating = optionalNumber(z.number().finite().min(0).max(10));

export const foodSchema = z.object({
  id, loggedAt: optionalIsoDateTime, meal: z.enum(['breakfast', 'lunch', 'dinner', 'snacks', 'other']).default('other'),
  name: z.string().trim().min(1, 'Food name is required.'), servingSize: macro, servingUnit: optionalText(100), amount: macro,
  calories: macro, protein: macro, carbohydrates: macro, carbs: macro, fat: macro, fiber: macro, notes: optionalText(), photoPath: optionalText(2048),
});

export const bodyMeasurementFields = {
  weightKg: optionalNumber(z.number().finite().gt(0).max(500)), bodyFatPercent: bodyFat,
  waistCm: measurementNumber, chestCm: measurementNumber, leftArmCm: measurementNumber, rightArmCm: measurementNumber,
  leftThighCm: measurementNumber, rightThighCm: measurementNumber, hipsCm: measurementNumber, shouldersCm: measurementNumber, neckCm: measurementNumber,
};
export const bodySchema = z.object({ id, measuredAt: optionalIsoDateTime, ...bodyMeasurementFields, notes: optionalText() }).superRefine((data: any, ctx: any) => {
  if (!Object.keys(bodyMeasurementFields).some((key) => data[key as keyof typeof bodyMeasurementFields] != null)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Enter at least one measurement.', path: ['weightKg'] });
  }
});

export const recoverySchema = z.object({
  id, checkedAt: optionalDate, sleepHours: optionalNumber(z.number().finite().min(0).max(24)), sleepQuality: rating, energy: rating,
  stress: rating, motivation: rating, soreness: rating, pain: z.boolean().default(false), painArea: optionalText(500), notes: optionalText(),
});

export const exerciseSchema = z.object({ id, name: z.string().trim().min(1), muscleGroup: optionalText(100), equipment: optionalText(100), category: optionalText(100), instructions: optionalText() });
export const workoutSetSchema = z.object({ id, weight: optionalNumber(z.number().finite().min(0).max(1000)), reps: optionalNumber(z.number().finite().int().min(0).max(10000)), rpe: optionalNumber(z.number().finite().min(0).max(10)), durationSeconds: optionalNumber(z.number().finite().min(0).max(86400)), distanceMeters: optionalNumber(z.number().finite().min(0).max(1000000)), notes: optionalText(), setType: z.enum(['warm-up', 'working', 'drop', 'failure', 'custom']).default('working'), completed: z.boolean().default(false) }).superRefine((data: any, ctx: any) => { if ([data.weight, data.reps, data.durationSeconds, data.distanceMeters].every((v) => v == null)) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Enter reps, weight, duration, or distance.', path: ['reps'] }); });
export const workoutSchema = z.object({ id, planId: z.string().uuid().nullable().optional(), startedAt: optionalIsoDateTime, finishedAt: optionalIsoDateTime.nullable().optional(), notes: optionalText(), exercises: z.array(z.object({ id, name: z.string().trim().min(1), position: z.number().int().default(0), notes: optionalText(), sets: z.array(workoutSetSchema).default([]) })).default([]) });
export const settingsSchema = z.object({ displayName: optionalText(200), goalType: optionalText(100), goalWeightKg: macro, calorieTarget: macro, proteinTarget: macro, carbohydrateTarget: macro, fatTarget: macro, fiberTarget: macro, waterTargetMl: optionalNumber(z.number().int().nonnegative()), timezone: optionalText(100), weekStartDay: optionalText(20) });

export function stripUndefined<T extends Record<string, unknown>>(row: T) { return Object.fromEntries(Object.entries(row).filter(([, value]) => value !== undefined)) as Partial<T>; }
export function validationError(error: any) { return { error: 'VALIDATION_ERROR', message: 'Some fields are invalid.', fields: Object.fromEntries(error.issues.map((issue: any) => [issue.path.join('.') || 'form', issue.message])) }; }
