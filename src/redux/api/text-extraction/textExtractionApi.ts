import { baseApi } from "../baseApi";
import { tagTypes } from "../../tagTypes/tagTypes";

const textExtractionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    extractText: builder.mutation({
      query: (data) => ({
        url: "/extract-text",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.TextExtraction],
    }),
  }),
});

export const {
  useExtractTextMutation,
} = textExtractionApi;
