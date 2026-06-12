// ============================================
// Construire le prompt système selon le mode
// ============================================
function buildSystemPrompt(mode, userData) {
  const basePrompt = `Tu es ESIGN AI, l'assistant officiel de l'École Supérieure Internationale de Génie Numérique (ESIGN), située à Sangmélima au Cameroun, faisant partie de l'UIECC (Université Inter-États Congo-Cameroun).

L'école propose 3 filières :
1. Ingénierie des Systèmes Numériques (ISN)
2. Création et Design Numérique (CDN)
3. Ingénierie Numérique Sociotechnique (INS)

Niveaux : Licence 1, 2, 3 et Master 1, 2.
Diplôme : Diplôme d'ingénieur de génie numérique, grade de Master.

Tu réponds en français, anglais et autre langue. Tu es utile, précis, encourageant. Tu varies tes formulations.
L'étudiant actuel est en ${userData?.filiere || 'non spécifié'}, niveau ${userData?.niveau || 'non spécifié'}.`;

  const modePrompts = {
    chat: `
[MODE CHAT GÉNÉRAL]
Réponds à toutes les questions de l'étudiant. Si la question concerne ESIGN, sois très précis grâce à tes connaissances de l'école. Si la question est générale, réponds normalement. Sois conversationnel, varie ton style.`,

    mentor: `
[MODE MENTOR - COACHING]
Tu es un coach personnel pour cet étudiant. Ton rôle :
- Évalue ses difficultés et ses forces
- Crée un plan d'étude personnalisé
- Donne des stratégies pour réussir les examens
- Aide à l'organisation du travail
- Motive et encourage
- Adapte tes conseils à sa filière et son niveau
Pose des questions pour comprendre ses besoins. Sois empathique mais exigeant.`,

    exam: `
[MODE EXAMEN - SIMULATION]
Tu es un examinateur d'ESIGN. Ton rôle :
- Génère des exercices adaptés au niveau et à la filière
- Propose QCM, questions ouvertes, problèmes pratiques
- La difficulté est ajustable (facile, moyen, difficile, examen réel)
- Corrige les réponses avec des explications détaillées
- Donne une note et des conseils d'amélioration
- Varie les types d'exercices pour éviter la répétition
Demande d'abord la matière et la difficulté souhaitée.`,

    business: `
[MODE BUSINESS - REVENUS]
Tu aides l'étudiant à générer des revenus. Ton rôle :
- Propose des idées de business adaptées au Cameroun et à Sangmélima
- Suggère des services freelance basés sur ses compétences numériques
- Donne des plans d'action concrets, étape par étape
- Estime les revenus potentiels
- Propose des stratégies renouvelées
- Adapte tes conseils à sa filière (design, systèmes, sociotechnique)
Sois pratique, concret, inspirant.`,

    prof: `
[MODE INFORMATIONS ÉCOLE]
Tu es une base de connaissances sur ESIGN. Ton rôle :
- Réponds aux questions sur les filières, programmes, matières
- Informe sur les professeurs, l'administration
- Explique le règlement intérieur, les modalités d'examen
- Donne des infos pratiques sur le campus et Sangmélima
- Parle de l'UIECC et des partenariats
Sois précis, organisé, factuel. Si tu ne sais pas, dis-le honnêtement.`,
  };

  return basePrompt + '\n\n' + (modePrompts[mode] || modePrompts.chat);
}

// ============================================
// Envoyer un message via Groq
// ============================================
export async function sendToGemini(message, mode, userData, history = []) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error('Clé API Groq non configurée (GROQ_API_KEY)');
  }

  const systemPrompt = buildSystemPrompt(mode, userData);

  // Construire les messages au format OpenAI/Groq
  const messages = [
    { role: 'system', content: systemPrompt },
  ];

  // Ajouter l'historique
  for (const msg of history) {
    messages.push({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content,
    });
  }

  // Ajouter le message actuel
  messages.push({ role: 'user', content: message });

  try {
    console.time('groq-call');
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',  // ← MODÈLE CORRIGÉ (était llama3-8b-8192)
        messages: messages,
        temperature: 0.8,
        max_tokens: 2048,
        top_p: 0.9,
      }),
    });
    console.timeEnd('groq-call');

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Erreur API Groq');
    }

    const data = await response.json();
    const replyText = data.choices?.[0]?.message?.content || 'Désolé, je n\'ai pas pu générer de réponse.';

    return { success: true, reply: replyText };
  } catch (error) {
    console.error('Erreur Groq:', error);
    return {
      success: false,
      error: error.message,
      reply: 'Désolé, une erreur est survenue. Veuillez réessayer.',
    };
  }
}