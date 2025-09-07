import { baseApi } from "../baseApi";
import { tagTypes } from "../../tagTypes/tagTypes";

const quizAttemptApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createQuizAttempt: builder.mutation({
      query: (data) => ({
        url: "/quiz-attempts",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.QuizAttempt],
    }),
    getAllQuizAttempts: builder.query({
      query: (params) => ({
        url: "/quiz-attempts",
        method: "GET",
        params
      }),
      providesTags: [tagTypes.QuizAttempt],
    }),
    getSingleQuizAttempt: builder.query({
      query: (id) => ({
        url: `/quiz-attempts/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.QuizAttempt],
    }),
    updateQuizAttempt: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/quiz-attempts/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.QuizAttempt],
    }),
    deleteQuizAttempt: builder.mutation({
      query: (id) => ({
        url: `/quiz-attempts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.QuizAttempt],
    }),
  }),
});

export const {
  useCreateQuizAttemptMutation,
  useGetAllQuizAttemptsQuery,
  useGetSingleQuizAttemptQuery,
  useUpdateQuizAttemptMutation,
  useDeleteQuizAttemptMutation,
} = quizAttemptApi;
