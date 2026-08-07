import { baseApi } from "../baseApi";
import { tagTypes } from "../../tagTypes/tagTypes";

const writingTestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    startWritingTest: builder.mutation({
      query: () => ({
        url: "/writing-tests/start",
        method: "POST",
      }),
      invalidatesTags: [tagTypes.WritingTest, tagTypes.Session],
    }),
    getWritingTest: builder.query({
      query: (sessionId: string) => ({
        url: `/writing-tests/${sessionId}`,
        method: "GET",
      }),
      providesTags: [tagTypes.WritingTest],
    }),
    submitWritingTest: builder.mutation({
      query: ({ sessionId, task1Text, task2Text }) => ({
        url: `/writing-tests/${sessionId}/submit`,
        method: "POST",
        data: { task1Text, task2Text },
      }),
      invalidatesTags: [tagTypes.WritingTest, tagTypes.Session],
    }),
  }),
});

export const {
  useStartWritingTestMutation,
  useGetWritingTestQuery,
  useSubmitWritingTestMutation,
} = writingTestApi;
