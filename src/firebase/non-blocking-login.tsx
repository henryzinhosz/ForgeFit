'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  signInAnonymously(authInstance).catch((error) => {
    console.error("Erro ao entrar anonimamente:", error);
  });
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string): void {
  createUserWithEmailAndPassword(authInstance, email, password).catch((error) => {
    console.error("Erro ao cadastrar e-mail:", error);
  });
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): void {
  signInWithEmailAndPassword(authInstance, email, password).catch((error) => {
    console.error("Erro ao entrar com e-mail:", error);
  });
}

/** Sign in with Google (non-blocking). */
export function signInWithGoogle(authInstance: Auth): void {
  const provider = new GoogleAuthProvider();
  // Limpa solicitações pendentes para evitar o erro de 'cancelled-popup-request'
  signInWithPopup(authInstance, provider).catch((error) => {
    if (error.code === 'auth/operation-not-allowed') {
      console.error("ERRO CRÍTICO: O provedor Google não está ativado no Console do Firebase.");
      alert("Ação necessária: Vá em seu Console Firebase > Authentication > Sign-in Method e ative o 'Google'.");
    } else if (error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-closed-by-user') {
      // Silencia erros de fechamento manual ou cancelamento pelo usuário
      console.log("Login cancelado ou janela fechada pelo usuário.");
    } else {
      console.error("Erro ao entrar com Google:", error);
    }
  });
}

/** Sign out (non-blocking). */
export function logout(authInstance: Auth): void {
  signOut(authInstance).catch((error) => {
    console.error("Erro ao sair:", error);
  });
}
