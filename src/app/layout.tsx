
'use client';

import './globals.css';
import { initializeFirebase, FirebaseClientProvider } from '@/firebase';

const { firebaseApp, firestore, auth } = initializeFirebase();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <title>ForgeFIT</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
        
        {/* Ícone da Aba do Navegador (Favicon) - Imagem do Bodybuilder conforme solicitado */}
        <link rel="icon" href="https://i.pinimg.com/1200x/21/93/1c/21931ccfaa91987fe48b66da24a7d3ed.jpg" type="image/jpeg" />
        <link rel="shortcut icon" href="https://i.pinimg.com/1200x/21/93/1c/21931ccfaa91987fe48b66da24a7d3ed.jpg" type="image/jpeg" />
        
        {/* Ícone para iPhone/iOS */}
        <link rel="apple-touch-icon" href="https://i.pinimg.com/1200x/21/93/1c/21931ccfaa91987fe48b66da24a7d3ed.jpg" />
        
        {/* Configurações PWA */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ForgeFIT" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#000000" />
        <meta name="background-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" />
      </head>
      <body className="font-body antialiased bg-background text-foreground selection:bg-primary selection:text-white">
        <FirebaseClientProvider firebaseApp={firebaseApp} firestore={firestore} auth={auth}>
          {children}
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
