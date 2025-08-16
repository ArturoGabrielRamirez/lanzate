"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Model from "./rocket";

export default function RocketContainer() {
    return (
        <div style={{ width: "100vw", height: "100vh" }} className="absolute">
            <Canvas camera={{ position: [0, 0, 10] }} className="w-full h-full">
                <ambientLight intensity={0.5} />
                <directionalLight position={[2, 2, 2]} intensity={1} />
                <Model />
                <OrbitControls />
            </Canvas>
        </div>
    );
}
