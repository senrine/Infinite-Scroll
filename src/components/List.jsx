import React from 'react'
import { useEffect, useState, useRef } from 'react'
import spinner from '../assets/spinner.svg'
import usePhotos from '../hooks/usePhotos'

export default function List() {
    const [query,setQuery] = useState("random")
    const [pageNumber, setPageNumber] = useState(1)
    
    const photosApiData = usePhotos(query,pageNumber)

    const lastPickRef = useRef()

    const searchRef = useRef()

    useEffect(() => {
        if(lastPickRef.current){
            const observer = new IntersectionObserver(([entry]) => {
                if(entry.isIntersecting && photosApiData.maxPages !== pageNumber){
                    setPageNumber(pageNumber+1)
                    lastPickRef.current = null
                    observer.disconnect()
                }
            })
            observer.observe(lastPickRef.current)
        }
    },[photosApiData])

    function handleSubmit(e){
        e.preventDefault()
        if(searchRef.current.value !== query){
            setQuery(searchRef.current.value)
            setPageNumber(1)
        }
        console.log(photosApiData.photos);
    }

  return (
    <>
    <h1 className='text-4xl'>Unsplash Clone.</h1>
    <form onSubmit={handleSubmit}>
        <label className='block mb-4' htmlFor="search">Look for images...</label>
        <input
        ref={searchRef}
        type="text"  placeholder='Look for something...'
        className='block w-full mb-14 text-slate-800 py-3 px-2 text-md outline-gray-800 rounded border border-slate-400'/>
    </form>
    <ul className='grid grid-cols-[repeat(auto-fill,minmax(250px,_1fr))] auto-rows-[175px] gap-4 justify-center'>
        {!photosApiData.loading && photosApiData.photos.length !== 0 &&
        photosApiData.photos.map((photo , index) => {
            if(photosApiData.photos.length === index + 1) {
                return(
                    <li ref={lastPickRef} key={photo.id}>
                        <img
                        className='w-full h-full object-cover border-4 border-red-500'
                        src={photo.urls.regular} alt={photo.alt_description} />
                    </li>
                )
            } else{
                return(
                    <li key={photo.id}>
                        <img
                        className='w-full h-full object-cover'
                        src={photo.urls.regular} alt={photo.alt_description} />
                        </li>
            )
            }
           
        })}
    </ul>

    {(photosApiData.loading && !photosApiData.error.state) && 
    (<img className='block mx-auto ' src={spinner} />
    )}
    </>
  )
}
