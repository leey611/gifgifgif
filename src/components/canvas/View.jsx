'use client'

import { forwardRef, Suspense, useImperativeHandle, useRef } from 'react'
import { OrbitControls, OrthographicCamera, PerspectiveCamera, View as ViewImpl } from '@react-three/drei'
import { Three } from '@/helpers/components/Three'
import { useThree } from '@react-three/fiber'

export const Common = ({ color }) => {
  const size = useThree(state => state.size);
  const width = size.width;
  const height = size.height;
  return <Suspense fallback={null}>
    {color && <color attach='background' args={[color]} />}
    <ambientLight intensity={1.5} />
    <pointLight position={[20, 30, 10]} intensity={1} />
    <pointLight position={[-10, -10, -10]} color='blue' />
    {/* <PerspectiveCamera makeDefault fov={1500} position={[0, 0, 10]} /> */}
    {/* <OrthographicCamera makeDefault position={[0, 0, 5]} left={-0.5} right={0.5} top={0.5} bottom={-0.5} near={-10} far={10} /> */}
    <OrthographicCamera
      makeDefault
      zoom={90}
      position={[0, 0, 10]}
      left={-width / 2}
      right={width / 2}
      top={height / 2}
      bottom={-height / 2}
      near={0.1}
      far={1000}
    />
  </Suspense>
}

const View = forwardRef(({ children, orbit, ...props }, ref) => {
  const localRef = useRef(null)
  useImperativeHandle(ref, () => localRef.current)

  return (
    <>
      <div ref={localRef} {...props} />
      <Three>
        <ViewImpl track={localRef}>
          {children}
          {orbit && <OrbitControls />}
        </ViewImpl>
      </Three>
    </>
  )
})
View.displayName = 'View'

export { View }
