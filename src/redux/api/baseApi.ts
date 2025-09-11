import { createApi, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { AxiosError, Method } from 'axios';
import axiosInstance from '@/lib/axiosInstance';
import { tagTypesList } from '../tagTypes/tagTypes';
import { RootState } from '../store/store';

type AxiosArgs = {
  url: string;
  method: Method;
  data?: unknown;
  params?: unknown;
};

const axiosBaseQuery =
  ({ baseUrl }: { baseUrl?: string } = { baseUrl: '' }): BaseQueryFn<
    AxiosArgs,
    unknown,
    unknown
  > =>
  async ({ url, method, data, params }, api) => {
    try {
      const token = (api.getState() as RootState).auth.token;
      if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      const result = await axiosInstance({
        url: baseUrl + url,
        method,
        data,
        params,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export const baseApi = createApi({
  baseQuery: axiosBaseQuery(),
  endpoints: () => ({}),
  tagTypes: tagTypesList,
});
