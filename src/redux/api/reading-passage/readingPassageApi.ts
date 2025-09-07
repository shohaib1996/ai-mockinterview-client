import { baseApi } from "../baseApi";
import { tagTypes } from "../../tagTypes/tagTypes";

const readingPassageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createReadingPassage: builder.mutation({
      query: (data) => ({
        url: "/reading-passages",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.ReadingPassage],
    }),
    getAllReadingPassages: builder.query({
      query: (params) => ({
        url: "/reading-passages",
        method: "GET",
        params
      }),
      providesTags: [tagTypes.ReadingPassage],
    }),
    getSingleReadingPassage: builder.query({
      query: (id) => ({
        url: `/reading-passages/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.ReadingPassage],
    }),
    updateReadingPassage: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/reading-passages/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.ReadingPassage],
    }),
    deleteReadingPassage: builder.mutation({
      query: (id) => ({
        url: `/reading-passages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.ReadingPassage],
    }),
  }),
});

export const {
  useCreateReadingPassageMutation,
  useGetAllReadingPassagesQuery,
  useGetSingleReadingPassageQuery,
  useUpdateReadingPassageMutation,
  useDeleteReadingPassageMutation,
} = readingPassageApi;
