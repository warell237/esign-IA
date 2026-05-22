// ============================================
// Construire le prompt système selon le mode
// ============================================
function buildSystemPrompt(mode, userData) {
  // Base commune à tous les modes
  const basePrompt = `Tu es ESIGN AI, l'assistant officiel de l'École Supérieure Internationale de Génie Numérique (ESIGN), située à Sangmélima au Cameroun, faisant partie de l'UIECC (Université Inter-États Congo-Cameroun).

L'école propose 3 filières :
1. Ingénierie des Systèmes Numériques (ISN)
2. Création et Design Numérique (CDN)
3. Ingénierie Numérique Sociotechnique (INS)

Niveaux : Licence 1, 2, 3 et Master 1, 2.
Diplôme : Diplôme d'ingénieur de génie numérique, grade de Master.

Tu réponds en français. Tu es utile, précis, encourageant. Tu varies tes formulations.
L'étudiant actuel est en ${userData?.filiere || 'non spécifié'}, niveau ${userData?.niveau || 'non spécifié'}.`;

  // Prompts spécifiques selon le mode
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
// Envoyer un message à Gemini
// ============================================
export async function sendToGemini(message, mode, userData, history = []) {
  const apiKey = process.env.GEMINI_API_KEY;
  const apiUrl = process.env.GEMINI_API_URL;

  if (!apiKey) {
    throw new Error('Clé API Gemini non configurée');
  }

  // Construire le corps de la requête
  const systemPrompt = buildSystemPrompt(mode, userData);

  // Formater l'historique pour Gemini
  const contents = [];

  // Ajouter le prompt système comme premier message du modèle
  contents.push({
    role: 'user',
    parts: [{ text: systemPrompt }],
  });
  contents.push({
    role: 'model',
    parts: [{ text: 'Compris. Je suis prêt à aider.' }],
  });

  // Ajouter l'historique de la conversation
  for (const msg of history) {
    contents.push({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    });
  }

  // Ajouter le message actuel
  contents.push({
    role: 'user',
    parts: [{ text: message }],
  });

  try {
    const response = await fetch(`${apiUrl}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: contents,
        generationConfig: {
          temperature: 0.8, // Créativité (0 = précis, 1 = créatif)
          topP: 0.9,
          topK: 40,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Erreur API Gemini');
    }

    const data = await response.json();

    // Extraire le texte de la réponse
    const replyText =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Désolé, je n\'ai pas pu générer de réponse.';

    return {
      success: true,
      reply: replyText,
    };
  } catch (error) {
    console.error('Erreur Gemini:', error);
    return {
      success: false,
      error: error.message,
      reply: 'Désolé, une erreur est survenue. Veuillez réessayer.',
    };
  }
}