import { baseApi } from "../baseApi";
import { tagTypes } from "../../tagTypes/tagTypes";

const aiChatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createChatCompletion: builder.mutation({
      query: (data) => ({
        url: "/ai-chat/ielts-speaking-mock",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.AiChat],
    }),
    getConversationBySessionId: builder.query({
      query: (sessionId) => ({
        url: `/ai-chat/${sessionId}`,
        method: "GET",
      }),
      providesTags: [tagTypes.AiChat],
    }),
    getScoreAndFeedback: builder.mutation({
      query: (sessionId) => ({
        url: `ai-chat/analyze/${sessionId}`,
        method: "POST",
      }),
      invalidatesTags: [tagTypes.AiChat],
    })
  }),
});

export const {
  useCreateChatCompletionMutation,
  useGetConversationBySessionIdQuery,
  useGetScoreAndFeedbackMutation
} = aiChatApi;
