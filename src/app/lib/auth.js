import { supabase } from './supabase';

// ============================================
// Inscription email/mot de passe
// ============================================
export async function registerUser(email, password, userData) {

  // 1. Créer le compte dans Auth
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

  if (error) {
    if (error.message.includes('rate limit') || error.message.includes('exceeded')) {
      return { success: false, error: 'Trop de tentatives. Attends 1 minute et reessaie.' };
    }
    if (error.message.includes('already registered')) {
      return { success: false, error: 'Cet email est deja utilise. Connectez-vous.' };
    }
    return { success: false, error: error.message };
  }

  if (!data.user) return { success: false, error: 'Erreur lors de la creation du compte' };

  // 2. ✅ Connecter avec signInWithPassword pour établir la session
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // Si login échoue (email non confirmé), on continue quand même
  const sessionUser = loginData?.user || data.user;

  // 3. ✅ Insérer dans la table users avec upsert (évite les doublons)
  const { error: dbError } = await supabase.from('users').upsert({
    id: data.user.id,
    email,
    first_name: userData.firstName,
    last_name: userData.lastName,
    filiere: userData.filiere || '',
    niveau: userData.niveau || '',
    matricule: userData.matricule || '',
    phone: userData.phone || '',
    subscription_plan: 'free',
    questions_remaining: 10,
    questions_used: 0,
    theme: 'dark',
    points: 0,
    level: 1,
    created_at: new Date().toISOString(),
  }, { onConflict: 'id' });

  if (dbError) {
    console.error('DB insert error:', dbError);
    // On continue même si l'insert échoue (user déjà existant)
  }

  // 4. ✅ Si session établie → redirection directe
  if (loginData?.session) {
    return { success: true, user: sessionUser };
  }

  // 5. Si pas de session (email non confirmé) → signaler
  return { success: true, user: data.user, needsConfirmation: false };
}

// ============================================
// Connexion email/mot de passe
// ============================================
export async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    if (error.message.includes('Invalid login') || error.message.includes('invalid_credentials')) {
      return { success: false, error: 'Email ou mot de passe incorrect.' };
    }
    if (error.message.includes('Email not confirmed')) {
      return { success: false, error: 'Email non confirmé. Vérifiez votre boîte mail.' };
    }
    return { success: false, error: error.message };
  }

  // ✅ Vérifier si l'utilisateur existe dans la table users, sinon créer
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('id', data.user.id)
    .maybeSingle();

  if (!existing) {
    await supabase.from('users').insert({
      id: data.user.id,
      email: data.user.email,
      first_name: data.user.user_metadata?.first_name || '',
      last_name: data.user.user_metadata?.last_name || '',
      filiere: data.user.user_metadata?.filiere || '',
      niveau: data.user.user_metadata?.niveau || '',
      subscription_plan: 'free',
      questions_remaining: 10,
      questions_used: 0,
      theme: 'dark',
      points: 0,
      level: 1,
      created_at: new Date().toISOString(),
    });
  }

  return { success: true, user: data.user };
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