export type Project = {
  slug: string;
  title: string;
  description: string;
  modelPath: string;
  previewImage?: string;
};

export const projects: Project[] = [
  {
    slug: "test-model",
    title: "Test Model",
    description: "Checking the 3D viewer functionality",
    modelPath: "/models/test.glb",
    previewImage: "/images/helmet-preview.jpg", // Положите картинку в public/images
  },
  {
    slug: "apple",
    title: "Apple",
    description: "The default apple model from Blender",
    modelPath: "/models/apple.glb",
    previewImage: "/images/apple.jpg", // Положите картинку в public/images
  }
];