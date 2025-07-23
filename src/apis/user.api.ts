import http from '~/utils/http';
import type { SuccessResponseApi } from '~/types/utils.type';
import type { UpdateUserBody, UserProfile } from '~/types/user.type';

const URL = '/user';

const getProfile = async () => {
  return http.get<SuccessResponseApi<UserProfile>>('/me');
};

const updateProfile = (body: UpdateUserBody) => {
  return http.put<SuccessResponseApi<UserProfile>>(`${URL}`, body);
};

const uploadAvatar = (body: FormData) => {
  return http.post<SuccessResponseApi<string>>(`${URL}/upload-avatar`, body, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

const userApi = {
  getProfile,
  updateProfile,
  uploadAvatar
};

export default userApi;
