
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ForgeFit',
    short_name: 'ForgeFit',
    description: 'Plataforma de alta performance para treinamento físico e musculação.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#ff0000',
    icons: [
      {
        src: 'https://i.pinimg.com/736x/c9/7d/39/c97d39bf4d61146c0391f049300bf4b3.jpg',
        sizes: '192x192',
        type: 'image/jpeg',
      },
      {
        src: 'https://i.pinimg.com/736x/c9/7d/39/c97d39bf4d61146c0391f049300bf4b3.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
      },
    ],
  }
}
