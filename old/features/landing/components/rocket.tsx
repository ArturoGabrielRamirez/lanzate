"use client";

import { useFrame } from "@react-three/fiber";
import { MTLLoader, OBJLoader } from "three-stdlib";
import { useEffect, useState, useRef } from "react";
import { Group } from "three";

export default function Model() {
    const [object, setObject] = useState<Group | null>(null);
    const meshRef = useRef<Group>(null);

    useEffect(() => {
        const mtlLoader = new MTLLoader();
        mtlLoader.load("/landing/materials.mtl", (materials) => {
            materials.preload();
            const objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load("/landing/model.obj", (obj) => {
                setObject(obj);
            });
        });
    }, []);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.5; // Rotate at 0.5 radians per second
        }
    });

    return object ? <primitive ref={meshRef} object={object}  scale={[15, 15, 15]} rotation={[-Math.PI / 4, 0, 0]} position={[8, -5, 0]} /> : null;
}
