import { baseApi } from "../baseApi";
import { tagTypes } from "../../tagTypes/tagTypes";

const sessionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSession: builder.mutation({
      query: (data) => ({
        url: "/sessions",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.Session],
    }),
    getAllSessions: builder.query({
      query: (arg) => ({
        url: "/sessions",
        method: "GET",
        params: arg
      }),
      providesTags: [tagTypes.Session],
    }),
    getSingleSession: builder.query({
      query: (id) => ({
        url: `/sessions/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.Session],
    }),
    updateSession: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/sessions/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.Session],
    }),
    deleteSession: builder.mutation({
      query: (id) => ({
        url: `/sessions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.Session],
    }),
  }),
});

export const {
  useCreateSessionMutation,
  useGetAllSessionsQuery,
  useGetSingleSessionQuery,
  useUpdateSessionMutation,
  useDeleteSessionMutation,
} = sessionApi;
