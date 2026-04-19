
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ForgeFIT',
    short_name: 'ForgeFIT',
    description: 'Plataforma de alta performance para treinamento físico e musculação.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: 'https://i.pinimg.com/1200x/21/93/1c/21931ccfaa91987fe48b66da24a7d3ed.jpg',
        sizes: '192x192',
        type: 'image/jpeg',
        purpose: 'any',
      },
      {
        src: 'https://i.pinimg.com/1200x/21/93/1c/21931ccfaa91987fe48b66da24a7d3ed.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
        purpose: 'maskable',
      },
    ],
  }
}
