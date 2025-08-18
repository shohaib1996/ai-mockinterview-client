import { baseApi } from "../baseApi";
import { tagTypes } from "../../tagTypes/tagTypes";

const questionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createQuestion: builder.mutation({
      query: (data) => ({
        url: "/questions",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.Question],
    }),
    getAllQuestions: builder.query({
      query: () => ({
        url: "/questions",
        method: "GET",
      }),
      providesTags: [tagTypes.Question],
    }),
    getSingleQuestion: builder.query({
      query: (id) => ({
        url: `/questions/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.Question],
    }),
    updateQuestion: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/questions/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.Question],
    }),
    deleteQuestion: builder.mutation({
      query: (id) => ({
        url: `/questions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.Question],
    }),
  }),
});

export const {
  useCreateQuestionMutation,
  useGetAllQuestionsQuery,
  useGetSingleQuestionQuery,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} = questionApi;
