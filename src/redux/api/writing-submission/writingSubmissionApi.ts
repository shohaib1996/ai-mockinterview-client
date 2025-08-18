import { baseApi } from "../baseApi";
import { tagTypes } from "../../tagTypes/tagTypes";

const writingSubmissionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createWritingSubmission: builder.mutation({
      query: (data) => ({
        url: "/writing-submissions",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.WritingSubmission],
    }),
    getAllWritingSubmissions: builder.query({
      query: () => ({
        url: "/writing-submissions",
        method: "GET",
      }),
      providesTags: [tagTypes.WritingSubmission],
    }),
    getSingleWritingSubmission: builder.query({
      query: (id) => ({
        url: `/writing-submissions/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.WritingSubmission],
    }),
    updateWritingSubmission: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/writing-submissions/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.WritingSubmission],
    }),
    deleteWritingSubmission: builder.mutation({
      query: (id) => ({
        url: `/writing-submissions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.WritingSubmission],
    }),
  }),
});

export const {
  useCreateWritingSubmissionMutation,
  useGetAllWritingSubmissionsQuery,
  useGetSingleWritingSubmissionQuery,
  useUpdateWritingSubmissionMutation,
  useDeleteWritingSubmissionMutation,
} = writingSubmissionApi;
