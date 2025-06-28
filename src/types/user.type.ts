import { z } from 'zod';

export const RoleSchema = z.enum(['User', 'Admin']);
export type Role = z.infer<typeof RoleSchema>;

export const UserSchema = z.object({
  _id: z.string(),
  roles: z.array(RoleSchema),
  email: z.string().email(),
  name: z.string().optional(),
  date_of_birth: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  __v: z.number()
});

export const AuthUserSchema = UserSchema.pick({
  _id: true,
  roles: true,
  email: true,
  createdAt: true,
  updatedAt: true,
  __v: true
});

export type User = z.infer<typeof UserSchema>;
export type AuthUser = z.infer<typeof AuthUserSchema>;
export type UserProfile = User;
