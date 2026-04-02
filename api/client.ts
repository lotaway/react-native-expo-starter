import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Alert } from 'react-native';
import { router } from 'expo-router';

export const API_BASE_URL = 'http://localhost:8085';

const HTTP_STATUS = {
  OK: 200,
  UNAUTHORIZED: 401,
};

const REQUEST_TIMEOUT = 10000;

interface ApiResponse<T = any> {
  code: number;
  message?: string;
  data: T;
}

const MallClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

let sessionToken: string | null = null;

export const updateSessionToken = (newToken: string | null) => {
  sessionToken = newToken;
};

const injectAuthHeader = (config: InternalAxiosRequestConfig) => {
  if (sessionToken) {
    config.headers.Authorization = sessionToken;
  }
  return config;
};

MallClient.interceptors.request.use(injectAuthHeader);

const handleSessionExpiration = () => {
  Alert.alert(
    '提示',
    '登录已过期，请重新登录',
    [
      { text: '取消', style: 'cancel' },
      {
        text: '去登录',
        onPress: () => router.push('/(auth)/login'),
      },
    ]
  );
};

const handleResponseSuccess = (response: AxiosResponse<ApiResponse>) => {
  const res = response.data;
  if (res.code === HTTP_STATUS.OK) {
    return res;
  }

  Alert.alert('错误', res.message || '操作失败');

  if (res.code === HTTP_STATUS.UNAUTHORIZED) {
    handleSessionExpiration();
  }

  throw new Error(res.message || 'Business Error');
};

const handleResponseError = (error: AxiosError) => {
  Alert.alert('网络错误', error.message || '连接服务器失败');
  throw error;
};

MallClient.interceptors.response.use(
  (response) => handleResponseSuccess(response) as any,
  handleResponseError
);

export default MallClient;
