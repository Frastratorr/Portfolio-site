
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { Mesh, Texture } from "three";

export type GLBAnalysis = {
  triangleCount: number;
  textureResolution: string;
  generator: string;
};

function getTextureDimensions(texture: Texture): string | null {
  const image = texture.image as
    | {
        width?: number;
        height?: number;
        naturalWidth?: number;
        naturalHeight?: number;
      }
    | undefined;

  if (!image) return null;

  const width = image.width || image.naturalWidth;
  const height = image.height || image.naturalHeight;

  if (!width || !height) return null;

  return `${width}×${height}`;
}

export async function analyzeGLB(file: File): Promise<GLBAnalysis> {
  const loader = new GLTFLoader();
  const buffer = await file.arrayBuffer();

  return new Promise((resolve, reject) => {
    loader.parse(
      buffer,
      "",
      (gltf) => {
        try {
          let triangleCount = 0;
          const textureSizes = new Set<string>();

          gltf.scene.traverse((object) => {
            const mesh = object as Mesh;

            if (!mesh.isMesh || !mesh.geometry) return;

            const geometry = mesh.geometry;
            const indexCount = geometry.index?.count;
            const vertexCount = geometry.attributes.position?.count;

            const count = indexCount ?? vertexCount ?? 0;

            triangleCount += Math.floor(count / 3);

            const materials = Array.isArray(mesh.material)
              ? mesh.material
              : [mesh.material];

            for (const material of materials) {
              if (!material) continue;

              const materialValues = Object.values(material);

              for (const value of materialValues) {
                if (
                  value &&
                  typeof value === "object" &&
                  "isTexture" in value &&
                  value.isTexture === true
                ) {
                  const texture = value as Texture;
                  const dimensions = getTextureDimensions(texture);

                  if (dimensions) {
                    textureSizes.add(dimensions);
                  }
                }
              }
            }
          });

          const asset = gltf.parser.json.asset;

          resolve({
            triangleCount,
            textureResolution:
              [...textureSizes].sort().join(", ") || "",
            generator: asset?.generator || "",
          });
        } catch (error) {
          reject(error);
        }
      },
      (error) => {
        reject(error);
      }
    );
  });
}
