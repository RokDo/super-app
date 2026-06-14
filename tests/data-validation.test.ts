import { describe, expect, it, vi } from 'vitest';
import { bodySchema, foodSchema, recoverySchema, workoutSchema } from '../lib/data-validation';

describe('partial data-entry validation', () => {
  it('saves body weight only and normalizes decimal comma', () => {
    const parsed = bodySchema.parse({ weightKg: '76,5', notes: '' });
    expect(parsed.weightKg).toBe(76.5);
    expect(parsed.notes).toBeNull();
  });

  it('saves waist only without requiring weight', () => {
    const parsed = bodySchema.parse({ waistCm: '84' });
    expect(parsed.waistCm).toBe(84);
    expect(parsed.weightKg).toBeUndefined();
  });

  it('rejects body records with no measurement values', () => {
    expect(() => bodySchema.parse({ notes: 'just notes' })).toThrow(/Enter at least one measurement/);
  });

  it('accepts nullable notes from database-style payloads', () => {
    expect(bodySchema.parse({ weightKg: 80, notes: null }).notes).toBeNull();
    expect(recoverySchema.parse({ painArea: null, notes: null }).notes).toBeNull();
  });

  it('normalizes datetime-local values to ISO and allows missing workout start time', () => {
    const parsed = workoutSchema.parse({ startedAt: '2026-06-13T19:30', notes: null, exercises: [] });
    expect(parsed.startedAt).toMatch(/2026-06-13T19:30:00/);
    expect(workoutSchema.parse({ exercises: [] }).startedAt).toBeUndefined();
  });

  it('allows reps-only workout sets and optional RPE/notes', () => {
    const parsed = workoutSchema.parse({ exercises: [{ name: 'Push-up', sets: [{ reps: '12', weight: '', rpe: '', notes: '' }] }] });
    expect(parsed.exercises[0].sets[0]).toMatchObject({ reps: 12, notes: null });
    expect(parsed.exercises[0].sets[0].weight).toBeUndefined();
  });

  it('accepts valid partial food entries with optional macros and notes', () => {
    const parsed = foodSchema.parse({ name: 'Apple', meal: 'snacks', calories: '', protein: null, notes: '  ' });
    expect(parsed.calories).toBeUndefined();
    expect(parsed.protein).toBeUndefined();
    expect(parsed.notes).toBeNull();
  });
});
