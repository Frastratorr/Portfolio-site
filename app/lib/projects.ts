export type Project = {
  slug: string;
  title: string;
  description: string;
  modelPath: string;
  previewImage?: string;
  processImages?: string[]; 
  gallery?: string[];
  arLink?: string;
};

export const projects: Project[] = [
    {
    slug: "test-model",
    title: "Test Model",
    description: "My first practice model. Learning the basics of hard-surface modeling and PBR texturing.",
    modelPath: "/models/test.glb",
    previewImage: "/images/helmet-preview.jpg",
    // Пример галереи (замените на свои рендеры)
    gallery: [
      "/images/helmet-preview.jpg",
      "/images/helmet-preview.jpg",
      "/images/helmet-preview.jpg"
    ],
    arLink: "/models/test.glb"
    // processImages: [], // Если не нужны картинки процесса, просто не добавляйте это поле
  },
  {
    slug: "apple",
    title: "Apple",
    description: "My first practice model. Learning the basics of hard-surface modeling and PBR texturing.",
    modelPath: "/models/apple.glb",
    previewImage: "/images/apple.jpg", // Положите картинку в public/images
    processImages: [
      "/images/apple.jpg", 
      "/images/apple.jpg"
    ],
    arLink: "/models/apple.glb",
  }
];