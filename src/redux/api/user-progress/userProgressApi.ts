import { baseApi } from "../baseApi";
import { tagTypes } from "../../tagTypes/tagTypes";

const userProgressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createUserProgress: builder.mutation({
      query: (data) => ({
        url: "/user-progress",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.UserProgress],
    }),
    getAllUserProgress: builder.query({
      query: () => ({
        url: "/user-progress",
        method: "GET",
      }),
      providesTags: [tagTypes.UserProgress],
    }),
    getSingleUserProgress: builder.query({
      query: (id) => ({
        url: `/user-progress/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.UserProgress],
    }),
    updateUserProgress: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/user-progress/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.UserProgress],
    }),
    deleteUserProgress: builder.mutation({
      query: (id) => ({
        url: `/user-progress/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.UserProgress],
    }),
  }),
});

export const {
  useCreateUserProgressMutation,
  useGetAllUserProgressQuery,
  useGetSingleUserProgressQuery,
  useUpdateUserProgressMutation,
  useDeleteUserProgressMutation,
} = userProgressApi;
