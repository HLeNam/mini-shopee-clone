import { z } from 'zod';

export const RoleSchema = z.enum(['User', 'Admin']);
export type Role = z.infer<typeof RoleSchema>;

export const UserSchema = z.object({
  _id: z.string(),
  roles: z.array(RoleSchema),
  email: z.string().email(),
  name: z.string().max(160, 'Độ dài tối đa là 160 ký tự.').optional(),
  date_of_birth: z.string().optional(), // ISO date string
  address: z.string().max(160, 'Độ dài tối đa là 160 ký tự.').optional(),
  phone: z.string().max(20, 'Độ dài tối đa là 20 ký tự.').optional(),
  avatar: z.string().max(1000, 'Độ dài tối đa là 1000 ký tự.').optional(), // URL to the avatar image
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

export const UpdateUserBodySchema = UserSchema.pick({
  name: true,
  date_of_birth: true,
  address: true,
  phone: true,
  avatar: true
}).extend({
  password: z
    .string()
    .nonempty('Mật khẩu là bắt buộc')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .max(160, 'Mật khẩu không được quá 160 ký tự')
    .optional(),
  new_password: z
    .string()
    .nonempty('Mật khẩu mới là bắt buộc')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .max(160, 'Mật khẩu không được quá 160 ký tự')
    .optional()
});

export type User = z.infer<typeof UserSchema>;
export type AuthUser = z.infer<typeof AuthUserSchema>;
export type UserProfile = User;
export type UpdateUserBody = z.infer<typeof UpdateUserBodySchema>;
