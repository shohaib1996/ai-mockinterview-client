"use client"

import { useGetSingleWritingTaskQuery } from "@/redux/api/writingTask/writingTaskApi"

const WritingPracticePage = ({id}: {id: string}) => {
    const {data, isLoading} = useGetSingleWritingTaskQuery(id);
    console.log(data?.data)

  return (
    <div>
      <h1>Writing Practice Task</h1>
      <p>Task ID: {id}</p>
    </div>
  )
}

export default WritingPracticePage
