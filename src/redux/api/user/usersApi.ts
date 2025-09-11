import { baseApi } from "../baseApi";
import { tagTypes } from "../../tagTypes/tagTypes";

const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (data) => ({
        url: "/users/register",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.Users],
    }),
    loginUser: builder.mutation({
      query: (data) => ({
        url: "/users/login",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.Users, tagTypes.UserDashboard],
    }),
    getUsers: builder.query({
      query: (args) => ({
        url: "/users",
        method: "GET",
        params: args
      }),
      providesTags: [tagTypes.Users],
    }),
    roleToggle: builder.mutation({
      query: ({id, data}) => ({
        url: `/users/${id}/role`,
        method: "PATCH",
        data
      }),
      invalidatesTags: [tagTypes.Users],
    }),
    getProfile: builder.query({
      query: () => ({
        url: "/users/profile",
        method: "GET",
      }),
      providesTags: [tagTypes.Users],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/users/profile",
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.Users],
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/users/reset-password",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.Users],
    })
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useGetUsersQuery,
  useRoleToggleMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useResetPasswordMutation
} = usersApi;