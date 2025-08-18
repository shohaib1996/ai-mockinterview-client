import { baseApi } from "../baseApi";
import { tagTypes } from "../../tagTypes/tagTypes";

const fileUploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadPhoto: builder.mutation({
      query: (data) => ({
        url: "/upload/photo",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.FileUpload],
    }),
    uploadAudio: builder.mutation({
      query: (data) => ({
        url: "/upload/audio",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.FileUpload],
    }),
  }),
});

export const {
  useUploadPhotoMutation,
  useUploadAudioMutation,
} = fileUploadApi;
