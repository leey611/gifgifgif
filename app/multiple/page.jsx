'use client'
import { useState, useEffect } from 'react'
import Plane from '@/components/Plane'
import dynamic from 'next/dynamic'
import { randFloat, generateUUID } from "three/src/math/MathUtils";
import { db, addDocToFirebase, deleteDoc, collection, doc, onSnapshot, query } from 'lib/firebase';

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
            const newPlaneId = generateUUID()
            const newPlane = {
                position: [randFloat(-5, 5), randFloat(-5, 5), randFloat(-5, 5)],
                url: randomGifUrl,
                offset: randFloat(-Math.PI * 2, Math.PI * 2),
                shrinking: false
            }
            addDocToFirebase(newPlaneId, newPlane)
        } catch (error) {
            console.error("Error fetching random GIF:", error);
        }
    };

    const removePlane = async (id) => await deleteDoc(doc(db, "videos", id));


    const getDocsFromFirebase = async () => {
        const q = query(collection(db, "videos"))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            querySnapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const docData = change.doc.data()
                    setPlanes((prevPlanes) => [
                        ...prevPlanes,
                        {
                            id: change.doc.id,
                            position: docData.position,
                            url: docData.url,
                            offset: randFloat(-Math.PI * 2, Math.PI * 2),
                            shrinking: false
                        }
                    ])
                }
                if (change.type === "modified") {
                    console.log("Modified: ", change.doc.data());
                    // const updatedPlanes = planes.map(plane => plane.id !== id ? plane : { ...plane, shrink: true })
                    // setPlanes((prevPlanes) => [
                    //     ...prevPlanes.map(plane => plane.id != change.doc.id ? plane : { ...plane, shrinking: true })
                    // ])
                }
                if (change.type === "removed") {
                    // setPlanes((prevPlanes) => [
                    //     ...prevPlanes.filter(plane => plane.id !== change.doc.id),

                    // ])
                    setPlanes((prevPlanes) => [
                        ...prevPlanes.map(plane => plane.id != change.doc.id ? plane : { ...plane, shrinking: true })
                    ])
                }
            });
        });
    }

    useEffect(() => {
        getDocsFromFirebase()
    }, [])
    return (
        <>
            <button className='text-blue-500 fixed z-50 cursor-pointer' onClick={fetchRandomGif}>get random gif</button>
            <View orbit className='relative h-full  w-full'>

                {planes.length && planes.map((plane, i) => (
                    plane && <Plane key={plane.id} {...plane} removePlane={() => removePlane(plane.id)} />
                ))}

                <Common color={'black'} />
                <gridHelper />
            </View>
        </>
    )
}