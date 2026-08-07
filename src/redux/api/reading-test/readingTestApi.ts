import { baseApi } from "../baseApi";
import { tagTypes } from "../../tagTypes/tagTypes";

const readingTestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    startReadingTest: builder.mutation({
      query: () => ({
        url: "/reading-tests/start",
        method: "POST",
      }),
      invalidatesTags: [tagTypes.ReadingTest, tagTypes.Session],
    }),
    getReadingTest: builder.query({
      query: (sessionId: string) => ({
        url: `/reading-tests/${sessionId}`,
        method: "GET",
      }),
      providesTags: [tagTypes.ReadingTest],
    }),
    submitReadingTest: builder.mutation({
      query: ({ sessionId, answers }) => ({
        url: `/reading-tests/${sessionId}/submit`,
        method: "POST",
        data: { answers },
      }),
      invalidatesTags: [tagTypes.ReadingTest, tagTypes.Session],
    }),
  }),
});

export const {
  useStartReadingTestMutation,
  useGetReadingTestQuery,
  useSubmitReadingTestMutation,
} = readingTestApi;
