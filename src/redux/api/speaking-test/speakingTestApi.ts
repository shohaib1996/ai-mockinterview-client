import { baseApi } from "../baseApi";
import { tagTypes } from "../../tagTypes/tagTypes";

const speakingTestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    startSpeakingTest: builder.mutation({
      query: () => ({
        url: "/speaking-tests/start",
        method: "POST",
      }),
      invalidatesTags: [tagTypes.SpeakingTest, tagTypes.Session],
    }),
    getSpeakingTest: builder.query({
      query: (sessionId: string) => ({
        url: `/speaking-tests/${sessionId}`,
        method: "GET",
      }),
      providesTags: [tagTypes.SpeakingTest],
    }),
    chatSpeakingTest: builder.mutation({
      query: ({ sessionId, part, conversation }) => ({
        url: `/speaking-tests/${sessionId}/chat`,
        method: "POST",
        data: { part, conversation },
      }),
    }),
    submitSpeakingPart2: builder.mutation({
      query: ({ sessionId, transcript }) => ({
        url: `/speaking-tests/${sessionId}/part2`,
        method: "POST",
        data: { transcript },
      }),
    }),
    analyzeSpeakingTest: builder.mutation({
      query: (sessionId: string) => ({
        url: `/speaking-tests/${sessionId}/analyze`,
        method: "POST",
      }),
      invalidatesTags: [tagTypes.SpeakingTest, tagTypes.Session],
    }),
  }),
});

export const {
  useStartSpeakingTestMutation,
  useGetSpeakingTestQuery,
  useChatSpeakingTestMutation,
  useSubmitSpeakingPart2Mutation,
  useAnalyzeSpeakingTestMutation,
} = speakingTestApi;
