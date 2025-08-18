import { baseApi } from "../baseApi";
import { tagTypes } from "../../tagTypes/tagTypes";

const quizAnswerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createQuizAnswer: builder.mutation({
      query: (data) => ({
        url: "/quiz-answers",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.QuizAnswer],
    }),
    getAllQuizAnswers: builder.query({
      query: () => ({
        url: "/quiz-answers",
        method: "GET",
      }),
      providesTags: [tagTypes.QuizAnswer],
    }),
    getSingleQuizAnswer: builder.query({
      query: (id) => ({
        url: `/quiz-answers/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.QuizAnswer],
    }),
    updateQuizAnswer: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/quiz-answers/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.QuizAnswer],
    }),
    deleteQuizAnswer: builder.mutation({
      query: (id) => ({
        url: `/quiz-answers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.QuizAnswer],
    }),
  }),
});

export const {
  useCreateQuizAnswerMutation,
  useGetAllQuizAnswersQuery,
  useGetSingleQuizAnswerQuery,
  useUpdateQuizAnswerMutation,
  useDeleteQuizAnswerMutation,
} = quizAnswerApi;
