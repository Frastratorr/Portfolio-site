"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, Center } from "@react-three/drei";
import { Suspense } from "react";

function Model({ path }: { path: string }) {
  const { scene } = useGLTF(path);
  return <primitive object={scene} />;
}

export default function ModelViewer({ modelPath }: { modelPath: string }) {
  return (
    <div style={{ width: "100%", height: "70vh", backgroundColor: "#0a0a0a" }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Environment preset="city" />
        <Suspense fallback={null}>
          <Center>
            <Model path={modelPath} />
          </Center>
        </Suspense>
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  );
}