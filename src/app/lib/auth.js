import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { 
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth'

export async function loginWithGoogle() {
  try {
    const provider = new GoogleAuthProvider()
    
    // Optionnel : forcer le choix du compte Google
    provider.setCustomParameters({ prompt: 'select_account' })

    const result = await signInWithPopup(auth, provider)
    const user = result.user

    // Vérifier si c'est la première connexion
    const docRef = doc(db, 'users', user.uid)
    const docSnap = await getDoc(docRef)

    // Première fois → créer le profil Firestore
    if (!docSnap.exists()) {
      await setDoc(docRef, {
        firstName:  user.displayName?.split(' ')[0] || '',
        lastName:   user.displayName?.split(' ')[1] || '',
        email:      user.email,
        photo:      user.photoURL,
        filiere:    '',
        niveau:     '',
        matricule:  '',
        createdAt:  new Date().toISOString(),
        subscription: {
          plan:               'free',
          questionsRemaining: 10,
          questionsUsed:      0,
          lastResetDate:      new Date().toISOString().split('T')[0],
          startDate:          new Date().toISOString(),
          endDate:            null,
        },
        theme: 'dark',
      })
    }

    return { success: true, user, isNewUser: !docSnap.exists() }

  } catch (error) {
    return { success: false, error: error.message }
  }
}
// ============================================
// Inscription d'un nouvel utilisateur
// ============================================
export async function registerUser(email, password, userData) {
  try {
    // 1. Créer le compte Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. Mettre à jour le profil (nom, photo)
    await updateProfile(user, {
      displayName: `${userData.firstName} ${userData.lastName}`,
    });

    // 3. Sauvegarder les infos supplémentaires dans Firestore
    await setDoc(doc(db, 'users', user.uid), {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: email,
      filiere: userData.filiere || '',
      niveau: userData.niveau || '',
      matricule: userData.matricule || '',
      phone: userData.phone || '',
      createdAt: new Date().toISOString(),
      // Abonnement gratuit par défaut
      subscription: {
        plan: 'free',
        questionsRemaining: 10, // 10 questions gratuites par jour
        questionsUsed: 0,
        lastResetDate: new Date().toISOString().split('T')[0], // Pour reset quotidien
        startDate: new Date().toISOString(),
        endDate: null,
      },
      theme: 'dark',
        gamification: {
    points: 0,
    level: 1,
    ratings: {
      total: 0,
      sum: 0,
      average: null,
    },
    badges: [],
  },
    });

    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ============================================
// Connexion d'un utilisateur
// ============================================
export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ============================================
// Déconnexion
// ============================================
export async function logoutUser() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ============================================
// Réinitialisation du mot de passe
// ============================================
export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ============================================
// Récupérer les données utilisateur depuis Firestore
// ============================================
export async function getUserData(uid) {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() };
    } else {
      return { success: false, error: 'Utilisateur non trouvé' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ============================================
// Écouter les changements d'état d'authentification
// ============================================
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}