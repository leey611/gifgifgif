'use client'
import { useState, useEffect } from 'react'
import Plane from '@/components/Plane'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { randFloat, generateUUID } from "three/src/math/MathUtils";

const Logo = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Logo), { ssr: false })
const Dog = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Dog), { ssr: false })
const Duck = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Duck), { ssr: false })
const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
  ssr: false,
  loading: () => (
    <div className='flex h-96 w-full flex-col items-center justify-center'>
      <svg className='-ml-1 mr-3 h-5 w-5 animate-spin text-black' fill='none' viewBox='0 0 24 24'>
        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
        <path
          className='opacity-75'
          fill='currentColor'
          d='M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        />
      </svg>
    </div>
  ),
})
const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })

export default function Page() {
  const [planes, setPlanes] = useState([])

  const fetchRandomGif = async () => {
    const giphyEndpoint = `https://api.giphy.com/v1/gifs/random?api_key=${process.env.NEXT_PUBLIC_GIPHY_API_KEY}`;
    try {
      const response = await fetch(giphyEndpoint);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      const randomGifUrl = data.data.images.fixed_height.mp4;
      setPlanes((prevPlanes) => [
        ...prevPlanes,
        {
          id: generateUUID(),
          position: [randFloat(-5, 5), randFloat(-5, 5), randFloat(-5, 5)],
          url: randomGifUrl,
          offset: randFloat(-Math.PI * 2, Math.PI * 2),
          shrinking: false
        }
      ])
    } catch (error) {
      console.error("Error fetching random GIF:", error);
    }
  };

  const createVideoElement = (source) => {
    const vid = document.createElement("video");
    vid.src = source;
    vid.crossOrigin = "Anonymous";
    vid.loop = true;
    vid.muted = true;
    vid.play();
    return vid;
  };

  const removePlane = (id) => {
    console.log('remove plane')
    const updatedPlanes = planes.map(plane => plane.id !== id ? plane : { ...plane, shrinking: true })
    setPlanes(updatedPlanes)
    // const filteredPlanes = planes.filter(plane => plane.id !== id)
    // setPlanes(filteredPlanes)
  }

  useEffect(() => {
    // const interval = setInterval(() => setPlanes(planes => [...planes, { position: [randFloat(-5, 5), randFloat(-5, 5), randFloat(-5, 5)] }]), 1000)
    const interval = setInterval(() => fetchRandomGif(), 1000)
    return () => clearInterval(interval)
  }, [])
  return (
    <>
      <View orbit className='relative h-full  w-full'>
        {/* <Suspense fallback={null}>
          <Dog scale={1} position={[0, -1.6, 0]} rotation={[0.0, -0.3, 0]} />
          <Common color={'lightpink'} />
        </Suspense> */}
        {planes.length && planes.map((plane, i) => (
          <Plane key={plane.id} {...plane} removePlane={() => removePlane(plane.id)} />
        ))}
        {/* <Plane position={initialPosition} /> */}
        {/* <mesh ref={boxRef} onClick={() => console.log("you clicked me")} >
          <boxGeometry />
          <meshNormalMaterial />
        </mesh> */}
        <Common color={'black'} />
        <gridHelper />
      </View>
      {/* <div className='mx-auto flex w-full flex-col flex-wrap items-center md:flex-row  lg:w-4/5'> */}
      {/* jumbo */}
      {/* <div className='flex w-full flex-col items-start justify-center p-12 text-center md:w-2/5 md:text-left'>
          <p className='w-full uppercase'>Next + React Three Fiber</p>
          <h1 className='my-4 text-5xl font-bold leading-tight'>Next 3D Starter</h1>
          <p className='mb-8 text-2xl leading-normal'>A minimalist starter for React, React-three-fiber and Threejs.</p>
        </div>

        <div className='w-full text-center md:w-3/5'>
          <View className='flex h-96 w-full flex-col items-center justify-center'>
            <Suspense fallback={null}>
              <Logo route='/blob' scale={0.6} position={[0, 0, 0]} />
              <Common />
            </Suspense>
          </View>
        </div> */}
      {/* </div> */}

      {/* <div className='mx-auto flex w-full flex-col flex-wrap items-center p-12 md:flex-row  lg:w-4/5'> */}
      {/* first row */}
      {/* <div className='relative h-48 w-full py-6 sm:w-1/2 md:my-12 md:mb-40'>
          <h2 className='mb-3 text-3xl font-bold leading-none text-gray-800'>Events are propagated</h2>
          <p className='mb-8 text-gray-600'>Drag, scroll, pinch, and rotate the canvas to explore the 3D scene.</p>
        </div>
        <div className='relative my-12 h-48 w-full py-6 sm:w-1/2 md:mb-40'>
          <View orbit className='relative h-full  sm:h-48 sm:w-full'>
            <Suspense fallback={null}>
              <Dog scale={2} position={[0, -1.6, 0]} rotation={[0.0, -0.3, 0]} />
              <Common color={'lightpink'} />
            </Suspense>
          </View>
        </div> */}
      {/* second row */}
      {/* <div className='relative my-12 h-48 w-full py-6 sm:w-1/2 md:mb-40'>
          <View orbit className='relative h-full animate-bounce sm:h-48 sm:w-full'>
            <Suspense fallback={null}>
              <Duck route='/blob' scale={2} position={[0, -1.6, 0]} />
              <Common color={'lightblue'} />
            </Suspense>
          </View>
        </div> */}

      {/* </div> */}
    </>
  )
}
