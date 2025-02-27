"use client"
import Header from '@/components/Header'
import React, { useEffect, useState } from 'react'
// import { useToast } from "@/hooks/use-toast"
import { useParams } from 'next/navigation'
import ContestHeader from '@/components/ContestHeader/ContestHeader'
const page = () => {
  const[contestId,setContestId]=useState();
  const params=useParams();
  console.log(params)
 useEffect(()=>{
  if(params)

    { 
      setContestId(params?.contestId);

     console.log(contestId)}
 },[params.contestId])
  return (
    <div className='flex '>
        <ContestHeader/>
        <div className='mt-[100px]'>
             Hi
          </div>
    </div>
  )
}

export default page