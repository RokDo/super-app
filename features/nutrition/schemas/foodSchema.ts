import { z } from 'zod';
export const foodSchema=z.object({name:z.string().min(1,'Name is required'),meal:z.enum(['breakfast','lunch','dinner','snacks','other']),calories:z.number().nonnegative().nullable(),protein:z.number().nonnegative().nullable(),carbohydrates:z.number().nonnegative().nullable(),fat:z.number().nonnegative().nullable(),fiber:z.number().nonnegative().nullable()});
