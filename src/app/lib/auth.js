// ============================================
// src/app/lib/auth.js 
// ============================================

import { supabase } from './supabase';

// ============================================
// Inscription email/mot de passe
// ============================================
export async function registerUser(email, password, userData) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: userData.firstName,
        last_name: userData.lastName,
        filiere: userData.filiere,
        niveau: userData.niveau,
        matricule: userData.matricule,
        phone: userData.phone,
      },
    },
  });

  if (error) return { success: false, error: error.message };

  // Email non confirmé → demander OTP
  if (data.user && !data.user.confirmed_at) {
    return { success: true, emailConfirmation: true, user: data.user };
  }

  // Email déjà confirmé → insérer dans users
  const { error: dbError } = await supabase.from('users').insert({
    id: data.user.id, email, first_name: userData.firstName,
    last_name: userData.lastName, filiere: userData.filiere || '',
    niveau: userData.niveau || '', matricule: userData.matricule || '',
    phone: userData.phone || '', subscription_plan: 'free',
    questions_remaining: 10, questions_used: 0, theme: 'dark',
    points: 0, level: 1, created_at: new Date().toISOString(),
  });

  if (dbError) return { success: false, error: dbError.message };
  return { success: true, user: data.user };
}

// ============================================
// Vérification OTP (8 chiffres)
// ============================================
export async function verifyOTP(email, token) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'signup',
  });

  if (error) return { success: false, error: error.message };

  const user = data.user;
  if (user) {
    // Récupérer les métadonnées sauvegardées lors du signUp
    const meta = user.user_metadata || {};

    // Insérer dans la table users
    const { error: dbError } = await supabase.from('users').insert({
      id: user.id, email: user.email,
      first_name: meta.first_name || '',
      last_name: meta.last_name || '',
      filiere: meta.filiere || '',
      niveau: meta.niveau || '',
      matricule: meta.matricule || '',
      phone: meta.phone || '',
      subscription_plan: 'free',
      questions_remaining: 10,
      questions_used: 0,
      theme: 'dark',
      points: 0,
      level: 1,
      created_at: new Date().toISOString(),
    });

    // Si l'utilisateur existe déjà, on ignore l'erreur
    if (dbError && !dbError.message.includes('duplicate')) {
      return { success: false, error: dbError.message };
    }
  }

  return { success: true, user: data.user };
}

// ============================================
// Connexion email/mot de passe
// ============================================
export async function loginUser(email, password) {
  const maxAttempts = 3;
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.time(`loginUser-attempt-${attempt}`);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      console.timeEnd(`loginUser-attempt-${attempt}`);

      if (error) {
        // Si erreur réseau/transitoire, réessayer
        const msg = (error && error.message) || '';
        if (attempt < maxAttempts && (msg.includes('timeout') || msg.includes('Network') || msg.includes('connect'))) {
          await sleep(300 * attempt);
          continue;
        }
        return { success: false, error: msg };
      }

      return { success: true, user: data.user };
    } catch (err) {
      console.error(`loginUser - attempt ${attempt} error:`, err?.message || err);
      const causeCode = err?.cause?.code || '';
      const msg = err?.message || '';
      if (attempt < maxAttempts) {
        // backoff
        await sleep(400 * attempt);
        continue;
      }
      if (causeCode === 'UND_ERR_CONNECT_TIMEOUT' || msg.includes('Connect Timeout')) {
        return { success: false, error: "Timeout réseau: impossible de joindre Supabase. Vérifiez votre connexion internet, VPN ou firewall." };
      }
      return { success: false, error: msg };
    }
  }
}

// ============================================
// Connexion avec Google
// ============================================
export async function loginWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/chat',
      queryParams: { prompt: 'select_account' },
    },
  });

  if (error) return { success: false, error: error.message };
  // Supabase peut retourner une URL d'authentification (data.url) — renvoyer pour que le client puisse rediriger.
  if (data?.url) return { success: true, url: data.url };
  return { success: true };
}

// ============================================
// Mettre à jour le profil après Google
// ============================================
export async function updateGoogleProfile(userId, profileData) {
  const { error } = await supabase.from('users').upsert({
    id: userId,
    first_name: profileData.firstName,
    last_name: profileData.lastName,
    filiere: profileData.filiere,
    niveau: profileData.niveau,
    matricule: profileData.matricule || '',
    subscription_plan: 'free',
    questions_remaining: 10,
    questions_used: 0,
    theme: 'dark',
    points: 0,
    level: 1,
    created_at: new Date().toISOString(),
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ============================================
// Déconnexion
// ============================================
export async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ============================================
// Réinitialisation du mot de passe
// ============================================
export async function resetPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ============================================
// Récupérer les données utilisateur
// ============================================
export async function getUserData(uid) {
  const { data, error } = await supabase.from('users').select('*').eq('id', uid).single();
  if (error) return { success: false, error: error.message };
  return { success: true, data };
}