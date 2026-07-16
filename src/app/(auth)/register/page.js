'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SpaceBackground from '../../components/SpaceBackground';
import { useTheme } from '../../providers';
import { registerUser, loginWithGoogle } from '../../lib/auth';

export default function RegisterPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    filiere: '',
    niveau: '',
    matricule: '',
  });

  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    match: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const filieres = [
    'Ingénierie des Systèmes Numériques',
    'Ingénierie Numérique Sociotechnique',
    'Création et Design Numérique',
  ];
  const niveaux = ['L1', 'L2', 'L3', 'Master 1', 'Master 2'];

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 640);
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!mounted) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError('');
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      setPasswordStrength({
        length: next.password.length >= 6,
        match: next.password === next.confirmPassword,
      });
      return next;
    });
  };

  const goToStep2 = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Tous les champs obligatoires sont requis');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Adresse email invalide');
      return;
    }
    if (!passwordStrength.length) {
      setError('Le mot de passe doit faire au moins 6 caracteres');
      return;
    }
    if (!passwordStrength.match) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await registerUser(formData.email, formData.password, {
      firstName: formData.firstName,
      lastName: formData.lastName,
      filiere: formData.filiere,
      niveau: formData.niveau,
      matricule: formData.matricule,
    });

    if (result.success) {
      router.replace('/chat');
    } else {
      setError(result.error || "Erreur lors de l'inscription");
    }
    setLoading(false);
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await loginWithGoogle();
      if (!result) {
        setError('Erreur OAuth inattendue');
        return;
      }
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.url) {
        window.location.href = result.url;
        return;
      }
    } catch (err) {
      setError(err?.message || "Erreur lors de l'authentification Google");
    } finally {
      setLoading(false);
    }
  };

  const isDark = theme === 'dark';

  const inputStyle = {
    width: '100%',
    padding: isMobile ? '12px 14px' : '14px 16px',
    borderRadius: '12px',
    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
    background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
    color: isDark ? 'white' : '#0a1035',
    fontSize: '16px',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    color: isDark ? 'rgba(200,210,255,0.7)' : 'rgba(10,16,53,0.6)',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    marginBottom: '6px',
    display: 'block',
  };

  return (
    <main style={{
      width: '100vw', minHeight: '100vh',
      background: isDark ? '#000010' : '#f2f5ff',
      position: 'relative', fontFamily: 'Arial, sans-serif',
      transition: 'background 0.4s ease',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
    }}>
      <SpaceBackground />

      <div style={{ position: 'fixed', top: isMobile ? '12px' : '20px', left: isMobile ? '12px' : '20px', right: isMobile ? '12px' : '20px', zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(10,16,53,0.6)', fontSize: 14, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Retour
        </Link>
        <button onClick={toggleTheme} style={{ width: 40, height: 40, borderRadius: 10, border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {isDark ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffb347" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3366cc" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
          )}
        </button>
      </div>

      <div style={{ position: 'relative', zIndex: 10, width: '90%', maxWidth: '460px', padding: isMobile ? '30px 24px' : '40px 36px', borderRadius: '24px', background: isDark ? 'rgba(10, 15, 40, 0.7)' : 'rgba(255, 255, 255, 0.7)', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)', backdropFilter: 'blur(30px)', boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.5)' : '0 20px 60px rgba(0,0,0,0.1)', animation: 'slideUp 0.5s ease-out', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <h1 style={{ color: isDark ? 'white' : '#0a1035', fontSize: isMobile ? 24 : 28, fontWeight: 800, margin: '0 0 8px' }}>Inscription</h1>
          <p style={{ color: isDark ? 'rgba(200,210,255,0.6)' : 'rgba(10,16,53,0.5)', fontSize: isMobile ? 13 : 14, margin: 0 }}>Rejoins ESIGN AI gratuitement</p>
        </div>

        <button type="button" onClick={handleGoogleSignUp} disabled={loading} style={{ width: '100%', padding: isMobile ? '12px' : '14px', borderRadius: 12, border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.1)', background: isDark ? 'rgba(255,255,255,0.03)' : 'white', color: isDark ? 'white' : '#0a1035', fontWeight: 500, fontSize: isMobile ? 14 : 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuer avec Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
          <span style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)', fontSize: 12 }}>ou par email</span>
          <div style={{ flex: 1, height: 1, background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
          {[1, 2].map((s) => (
            <div key={s} style={{ width: 32, height: 4, borderRadius: 2, background: step >= s ? '#4488ff' : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', transition: 'all 0.3s ease' }} />
          ))}
        </div>

        {error && (
          <div style={{ padding: '12px 16px', borderRadius: 12, background: 'rgba(255,68,85,0.1)', border: '1px solid rgba(255,68,85,0.3)', color: '#ff4455', fontSize: 13, marginBottom: 20, textAlign: 'center' }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <div style={{ flex: 1 }}><label style={labelStyle}>Prenom *</label><input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Claude" style={inputStyle} /></div>
                <div style={{ flex: 1 }}><label style={labelStyle}>Nom *</label><input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="KENFACK" style={inputStyle} /></div>
              </div>
              <div style={{ marginBottom: 16 }}><label style={labelStyle}>Email *</label><input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="claude@esign.cm" style={inputStyle} /></div>
              <div style={{ marginBottom: 8 }}>
                <label style={labelStyle}>Mot de passe *</label>
                <div style={{ position: 'relative' }}>
                  <input name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} placeholder="Minimum 6 caracteres" style={{ ...inputStyle, paddingRight: 44 }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Confirmer *</label>
                <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirmer le mot de passe" style={inputStyle} />
                {(formData.password || formData.confirmPassword) && (
                  <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={passwordStrength.length ? '#00cc88' : '#ff4455'} strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      <span style={{ color: passwordStrength.length ? '#00cc88' : '#ff4455' }}>Minimum 6 caracteres</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={passwordStrength.match ? '#00cc88' : '#ff4455'} strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      <span style={{ color: passwordStrength.match ? '#00cc88' : '#ff4455' }}>Mots de passe identiques</span>
                    </div>
                  </div>
                )}
              </div>
              <button type="button" onClick={goToStep2} style={{ width: '100%', padding: isMobile ? 14 : 16, borderRadius: 14, border: 'none', background: 'linear-gradient(135deg, #4488ff, #3366cc)', color: 'white', fontWeight: 600, fontSize: isMobile ? 15 : 16, cursor: 'pointer', boxShadow: '0 6px 25px rgba(68,136,255,0.4)' }}>Continuer</button>
            </div>
          )}

          {step === 2 && (
            <div>
              <div style={{ marginBottom: 16 }}><label style={labelStyle}>Filiere</label><select name="filiere" value={formData.filiere} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer', background: isDark ? 'rgba(255,255,255,0.05)' : '#f0f4f8', color: isDark ? 'white' : '#333' }}><option value="">Selectionne ta filiere</option>{filieres.map((f) => <option key={f} value={f}>{f}</option>)}</select></div>
              <div style={{ marginBottom: 16 }}><label style={labelStyle}>Niveau</label><select name="niveau" value={formData.niveau} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer', background: isDark ? 'rgba(255,255,255,0.05)' : '#f0f4f8', color: isDark ? 'white' : '#333' }}><option value="">Selectionne ton niveau</option>{niveaux.map((n) => <option key={n} value={n}>{n}</option>)}</select></div>
              <div style={{ marginBottom: 24 }}><label style={labelStyle}>Matricule (optionnel)</label><input name="matricule" value={formData.matricule} onChange={handleChange} placeholder="Ex: 22U12345" style={inputStyle} /></div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" onClick={() => setStep(1)} style={{ flex: 1, padding: isMobile ? 14 : 16, borderRadius: 14, border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.15)', background: 'transparent', color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(10,16,53,0.8)', fontWeight: 500, fontSize: isMobile ? 14 : 15, cursor: 'pointer' }}>Retour</button>
                <button type="submit" disabled={loading} style={{ flex: 2, padding: isMobile ? 14 : 16, borderRadius: 14, border: 'none', background: loading ? 'rgba(68,136,255,0.5)' : 'linear-gradient(135deg, #4488ff, #3366cc)', color: 'white', fontWeight: 600, fontSize: isMobile ? 15 : 16, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 6px 25px rgba(68,136,255,0.4)' }}>{loading ? 'Inscription...' : 'Creer mon compte'}</button>
              </div>
            </div>
          )}
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(10,16,53,0.4)', fontSize: isMobile ? 12 : 13 }}>
          Deja un compte ? <Link href="/login" style={{ color: '#4488ff', textDecoration: 'none', fontWeight: 600 }}>Se connecter</Link>
        </p>
      </div>

      <style>{`@keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </main>
  );
}