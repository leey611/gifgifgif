import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3, DoubleSide } from "three";

export default function Plane(props) {
    const { position, url, offset, removePlane, shrinking } = props
    const initialScale = shrinking ? [1, 1, 1] : [0, 0, 0]
    console.log('shirnk', shrinking)
    const [shrink, setShrink] = useState(shrinking)
    const planeRef = useRef();
    const [video] = useState(() => {
        const vid = document.createElement("video");
        vid.src = url;
        vid.crossOrigin = "Anonymous";
        vid.loop = true;
        vid.muted = true;
        var playPromise = vid.play();

        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // Automatic playback started!
                // Show playing UI.
                vid.play()
            })
                .catch(error => {
                    // Auto-play was prevented
                    // Show paused UI.
                });
        }
        return vid;
    });
    const vec = new Vector3()
    const scaleThreshold = 0.001
    useFrame((state) => {
        const t = state.clock.elapsedTime + offset
        if (planeRef.current) {
            if (!shrinking) planeRef.current.scale.lerp(vec.set(1, 1, 1), 0.05)
            if (shrinking) {
                planeRef.current.scale.lerp(vec.set(0, 0, 0), 0.05)
                if (
                    planeRef.current.scale.x <= scaleThreshold ||
                    planeRef.current.scale.y <= scaleThreshold ||
                    planeRef.current.scale.z <= scaleThreshold
                ) {
                    // if (removePlane) removePlane()

                    state.scene.remove(planeRef)
                }
            }
            // planeRef.current.rotation.set(0, t, 0)
            // planeRef.current.position.z = t
            // planeRef.current.position.z = 0
            // planeRef.current.position.z += 0.01
        }
    });

    return (
        video && <mesh ref={planeRef} position={position} scale={initialScale} onClick={removePlane}>
            <planeGeometry />
            <meshStandardMaterial side={DoubleSide}  >
                <videoTexture attach="map" args={[video]} flipY={true} />
            </meshStandardMaterial>
        </mesh>
    );
}
