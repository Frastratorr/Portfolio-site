"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, Center, useProgress, useTexture } from "@react-three/drei";
import { Suspense, useRef, useState, useEffect } from "react";
import * as THREE from "three";

// Лоадер
function Loader() {
  const { progress } = useProgress();
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-neutral-950/80 backdrop-blur-sm">
      <div className="w-16 h-16 border-4 border-neutral-700 border-t-blue-500 rounded-full animate-spin mb-4"></div>
      <p className="text-xl font-bold text-blue-400">{progress.toFixed(0)}%</p>
      <p className="text-sm text-neutral-400 mt-1">Loading 3D Scene...</p>
    </div>
  );
}

function Model({ path }: { path: string }) {
  const { scene } = useGLTF(path);
  return <primitive object={scene} />;
}

// 👇 НОВЫЙ КОМПОНЕНТ: Устанавливает картинку как настоящий фон сцены
function SceneBackground({ url }: { url: string }) {
  const { scene } = useThree();
  const texture = useTexture(url);

  useEffect(() => {
    // Настраиваем текстуру, чтобы она заполняла весь экран (как cover в CSS)
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.mapping = THREE.EquirectangularReflectionMapping; 
    
    // Устанавливаем как фон
    scene.background = texture;
    
    // Очистка при размонтировании
    return () => {
      scene.background = null;
    };
  }, [texture, scene]);

  return null;
}

// Варианты сцен
const scenes = [
  { id: "dark", label: "Dark Studio", env: "city", bgColor: "#0a0a0a", image: null },
  { id: "light", label: "Light Studio", env: "studio", bgColor: "#e5e5e5", image: null },
  { id: "sunset", label: "Sunset", env: "sunset", bgColor: "#2d1b36", image: null },
  // 👇 Сцена с вашей картинкой-фоном
  { id: "custom", label: "My Scene", env: "warehouse", bgColor: "#000000", image: "/images/background.jpg" },
] as const;

export default function ModelViewer({ modelPath }: { modelPath: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sceneIndex, setSceneIndex] = useState(0);
  const currentScene = scenes[sceneIndex];
  const { active } = useProgress();

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="w-full h-[70vh] relative group transition-colors duration-500"
      style={{ backgroundColor: currentScene.bgColor }}
    >
      {active && <Loader />}

      {/* Переключатель сцен */}
      <div className="absolute bottom-4 left-4 z-10 flex flex-wrap gap-2">
        {scenes.map((scene, idx) => (
          <button
            key={scene.id}
            onClick={() => setSceneIndex(idx)}
            className={`px-4 py-2 text-sm font-medium rounded-full backdrop-blur-md transition-all ${
              sceneIndex === idx 
                ? "bg-white text-black" 
                : "bg-black/50 text-white hover:bg-black/70"
            }`}
          >
            {scene.label}
          </button>
        ))}
      </div>

      {/* Кнопка Fullscreen */}
      <button
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 z-10 p-3 bg-black/50 hover:bg-blue-600 text-white rounded-full backdrop-blur-md transition-all duration-300 opacity-0 group-hover:opacity-100"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
        </svg>
      </button>

      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={sceneIndex === 1 ? 1 : 0.3} />
        <directionalLight position={[5, 5, 5]} intensity={sceneIndex === 1 ? 1.5 : 1} />
        
        {/* Если картинки нет, используем встроенное 3D-окружение */}
        {!currentScene.image && (
          <Environment preset={currentScene.env} background={true} />
        )}

        {/* Если картинка есть, используем её как настоящий фон */}
        {currentScene.image && (
          <Suspense fallback={null}>
            <SceneBackground url={currentScene.image} />
          </Suspense>
        )}

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