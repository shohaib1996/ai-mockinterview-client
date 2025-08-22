import { baseApi } from "../baseApi";
import { tagTypes } from "../../tagTypes/tagTypes";

const answerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAnswer: builder.mutation({
      query: (data) => ({
        url: "/answers",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.Answer],
    }),
    getAllAnswers: builder.query({
      query: (args) => ({
        url: "/answers",
        method: "GET",
        params: args,
      }),
      providesTags: [tagTypes.Answer],
    }),
    getSingleAnswer: builder.query({
      query: (id) => ({
        url: `/answers/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.Answer],
    }),
    updateAnswer: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/answers/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.Answer],
    }),
    deleteAnswer: builder.mutation({
      query: (id) => ({
        url: `/answers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.Answer],
    }),
  }),
});

export const {
  useCreateAnswerMutation,
  useGetAllAnswersQuery,
  useGetSingleAnswerQuery,
  useUpdateAnswerMutation,
  useDeleteAnswerMutation,
} = answerApi;
