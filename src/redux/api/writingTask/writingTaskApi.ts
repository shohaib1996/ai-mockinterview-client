

import { tagTypes } from "@/redux/tagTypes/tagTypes";
import { baseApi } from "../baseApi";

const writingTaskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createWritingTask: builder.mutation({
      query: (data) => ({
        url: "/writing-tasks/create",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.writingTask],
    }),
    getAllWritingTasks: builder.query({
      query: (args) => ({
        url: "/writing-tasks",
        method: "GET",
        params: args,
      }),
      providesTags: [tagTypes.writingTask],
    }),
    getSingleWritingTask: builder.query({
      query: (id) => ({
        url: `/writing-tasks/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.writingTask],
    }),
    updateWritingTask: builder.mutation({
      query: ({ id, data }) => ({
        url: `/writing-tasks/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.writingTask],
    }),
    deleteWritingTask: builder.mutation({
      query: (id) => ({
        url: `/writing-tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.writingTask],
    }),
  }),
});

export const {
  useCreateWritingTaskMutation,
  useGetAllWritingTasksQuery,
  useGetSingleWritingTaskQuery,
  useUpdateWritingTaskMutation,
  useDeleteWritingTaskMutation,
} = writingTaskApi;
