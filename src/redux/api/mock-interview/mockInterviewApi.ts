import { baseApi } from "../baseApi";
import { tagTypes } from "../../tagTypes/tagTypes";

const mockInterviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConversationHistory: builder.query({
      query: (sessionId) => ({
        url: `/mock-interview/${sessionId}/history`,
        method: "GET",
      }),
      providesTags: ( arg) => [
        { type: tagTypes.MockInterview, id: arg },
      ],
    }),
    uploadQuestions: builder.mutation({
      query: ({ sessionId, data }) => ({
        url: `/mock-interview/${sessionId}/upload-questions`,
        method: "POST",
        data,
      }),
      invalidatesTags: ( arg) => [
        { type: tagTypes.MockInterview, id: arg.sessionId },
      ],
    }),
    chat: builder.mutation({
      query: ({ sessionId, data }) => ({
        url: `/mock-interview/${sessionId}/chat`,
        method: "POST",
        data,
      }),
      invalidatesTags: ( arg) => [
        { type: tagTypes.MockInterview, id: arg.sessionId },
      ],
    }),
    analyzeConversation: builder.mutation({
      query: (sessionId) => ({
        url: `/mock-interview/${sessionId}/analyze`,
        method: "POST",
      }),
      invalidatesTags: ( arg) => [
        { type: tagTypes.MockInterview, id: arg },
      ],
    }),
  }),
});

export const {
  useGetConversationHistoryQuery,
  useUploadQuestionsMutation,
  useChatMutation,
  useAnalyzeConversationMutation,
} = mockInterviewApi;
