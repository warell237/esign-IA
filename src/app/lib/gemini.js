import fs from 'fs';
import path from 'path';

// ============================================
// Charger UNIQUEMENT les fichiers pertinents
// ============================================
function loadRelevantKnowledge(userData, message) {
  const dataDir = path.join(process.cwd(), 'data');
  const msg = (message || '').toLowerCase();
  let knowledge = '';

  // Toujours charger : école + app (très léger)
  const always = ['ecole/infos.txt', 'app/about.txt'];
  for (const file of always) {
    try {
      knowledge += fs.readFileSync(path.join(dataDir, file), 'utf-8') + '\n';
    } catch (e) {}
  }

  // Charger les matières UNIQUEMENT si question sur les cours
  const matiereKeywords = ['cours', 'matière', 'matiere', 'examen', 'exercice', 'qcm', 'programme', 'semestre', 'révision', 'revision', 'devoir', 'contrôle', 'controle', 'ue ', 'coefficient', 'crédit', 'credit'];
  if (matiereKeywords.some(k => msg.includes(k))) {
    const niveauMap = { 'L1': 'N1', 'L2': 'N2', 'L3': 'N3', 'Master 1': 'N4', 'Master 2': 'N5', 'M1': 'N4', 'M2': 'N5' };
    const n = niveauMap[userData?.niveau] || 'N1';
    for (const sem of ['S1', 'S2']) {
      try {
        knowledge += fs.readFileSync(path.join(dataDir, `matieres/${n}/${sem}.txt`), 'utf-8') + '\n';
      } catch (e) {}
    }
  }

  // Charger les profs UNIQUEMENT si question sur les professeurs
  const profKeywords = ['prof', 'professeur', 'enseignant', 'contact', 'téléphone', 'telephone', 'email', 'bureau', 'chef de département'];
  if (profKeywords.some(k => msg.includes(k))) {
    try {
      knowledge += fs.readFileSync(path.join(dataDir, 'professeurs/contacts.txt'), 'utf-8') + '\n';
    } catch (e) {}
  }

  // Charger business UNIQUEMENT si question business
  const businessKeywords = ['business', 'argent', 'revenu', 'vendre', 'alibaba', 'freelance', 'gagner', 'client', 'marché', 'marche', 'import', 'export', 'boutique', 'e-commerce', 'whatsapp'];
  if (businessKeywords.some(k => msg.includes(k))) {
    try {
      knowledge += fs.readFileSync(path.join(dataDir, 'business/strategies.txt'), 'utf-8') + '\n';
    } catch (e) {}
  }

  return knowledge;
}

// ============================================
// Construire le prompt système selon le mode
// ============================================
export function buildSystemPrompt(mode, userData, message = '') {
  const knowledge = loadRelevantKnowledge(userData, message);

  const basePrompt = `Tu es ESIGN AI, l'assistant officiel de l'École Supérieure Internationale de Génie Numérique (ESIGN), située à Sangmélima au Cameroun, faisant partie de l'UIECC (Université Inter-États Congo-Cameroun).

L'école propose 3 filières :
1. Ingénierie des Systèmes Numériques (ISN)
2. Création et Design Numérique (CDN)
3. Ingénierie Numérique Sociotechnique (INS)

Niveaux : Licence 1, 2, 3 et Master 1, 2.
Diplôme : Diplôme d'ingénieur de génie numérique, grade de Master.

🚫 RÈGLE D'OR PÉDAGOGIQUE :
- Ne donne JAMAIS la réponse directement à l'étudiant.
- Demande-lui d'abord ce qu'il a compris, ce qu'il a essayé.
- Donne des indices progressifs, étape par étape.
- Corrige son raisonnement, pas juste le résultat final.
- Propose des exercices similaires pour qu'il s'entraîne.
- Encourage-le, félicite ses efforts.
- Si l'étudiant est bloqué, guide-le avec des questions plutôt que des réponses.
- Explique POURQUOI c'est correct ou incorrect.

💼 EXEMPLES D'ÉTUDIANTS-ENTREPRENEURS À ESIGN :
- Un étudiant de l'école a lancé sa boutique en ligne sur WhatsApp en vendant des sneakers. Il a commencé avec 20 000 FCFA.
- Un autre fait du freelancing en création de logos et affiches pour les commerces de Sangmélima (5 000 - 10 000 FCFA par design).
- Un groupe d'étudiants a créé une agence de community management pour les petites entreprises locales.
- Certains étudiants importent des accessoires téléphones d'Alibaba et les revendent au marché de Sangmélima.
- Un étudiant en ISN répare et formate des ordinateurs pour les particuliers et cybercafés.
- Ghost (Tagne Wambo) et Dubuzz (Wamba Roolf) deux entrepreneurs de ESIGN ont lancé une formation sur l'importation des marchandises.

👨‍💻 À PROPOS DE L'APPLICATION :
ESIGN AI a été développée par Empire Digital, une startup technologique fondée par un étudiant de ESIGN.
Empire Digital est spécialisée dans le développement de logiciels, sites web, applications mobiles et solutions numériques.
Si quelqu'un demande qui a créé cette application, réponds que c'est Empire Digital.

📝 FORMAT DE RÉPONSE OBLIGATOIRE :
- Utilise TOUJOURS le format Markdown pour structurer tes réponses.
- Utilise **gras** pour les titres, les concepts clés et les mots importants.
- Utilise des listes à puces (- ) pour énumérer des points.
- Utilise des listes numérotées (1. ) pour les étapes.
- Utilise des blocs de code \`\`\` pour le code de programmation.
- Utilise des sauts de ligne entre les sections pour aérer le texte.
- Utilise ### pour les sous-titres.
- Sois structuré, aéré et facile à lire, comme le ferait ChatGPT ou Claude.
- Ne renvoie JAMAIS un seul bloc de texte sans mise en forme.

📚 CONNAISSANCES SPÉCIFIQUES (chargées selon la question) :
${knowledge || 'Aucune connaissance spécifique nécessaire pour cette question.'}

Tu réponds en français. Tu es utile, précis, encourageant. Tu varies tes formulations.
L'étudiant actuel est en ${userData?.filiere || 'non spécifié'}, niveau ${userData?.niveau || 'non spécifié'}.`;

  const modePrompts = {
    chat: `
[MODE CHAT GÉNÉRAL]
Réponds à toutes les questions de l'étudiant. Si la question concerne ESIGN, sois très précis grâce à tes connaissances de l'école. Si la question est générale, réponds normalement. Sois conversationnel, varie ton style. Applique la règle d'or pédagogique.`,

    mentor: `
[MODE MENTOR - COACHING]
Tu es un coach personnel pour cet étudiant. Ton rôle :
- Évalue ses difficultés et ses forces
- Crée un plan d'étude personnalisé en fonction des matières de son niveau
- Donne des stratégies pour réussir les examens
- Aide à l'organisation du travail entre les matières techniques et artistiques
- Motive et encourage
- Adapte tes conseils à sa filière (ISN, CDN, INS) et son niveau
Pose des questions pour comprendre ses besoins. Sois empathique mais exigeant.`,

    exam: `
[MODE EXAMEN - SIMULATION]
Tu es un examinateur d'ESIGN. Tu connais les matières du niveau de l'étudiant.
Ton rôle :
- Génère des exercices adaptés au niveau et à la filière
- Propose QCM, questions ouvertes, problèmes pratiques
- La difficulté est ajustable (facile, moyen, difficile, examen réel)
- NE donne PAS la correction directement : demande d'abord la réponse de l'étudiant
- Corrige avec des explications détaillées sur le raisonnement
- Donne une note et des conseils d'amélioration
- Varie les types d'exercices pour éviter la répétition
Demande d'abord la matière et la difficulté souhaitée.`,

    business: `
[MODE BUSINESS - REVENUS]
Tu aides l'étudiant à générer des revenus. Comme ces étudiants de ESIGN qui ont réussi :
- Un étudiant vend des sneakers sur WhatsApp (capital de départ : 20 000 FCFA)
- Un autre fait du freelancing en design (logos, affiches) pour les commerces de Sangmélima
- Un groupe gère les réseaux sociaux de petites entreprises
- Certains importent d'Alibaba et revendent au marché local
- Un étudiant en ISN répare des ordinateurs

Ton rôle :
- Propose des idées de business adaptées au Cameroun et à Sangmélima
- Suggère des services freelance basés sur ses compétences numériques
- Explique comment importer d'Alibaba, vendre sur WhatsApp, Facebook Marketplace
- Donne des plans d'action concrets, étape par étape
- Estime les revenus potentiels en FCFA
- Propose des stratégies renouvelées chaque semaine
- Adapte tes conseils à sa filière
Sois pratique, concret, inspirant.`,

    prof: `
[MODE INFORMATIONS ÉCOLE]
Tu es une base de connaissances sur ESIGN. Tu connais les matières, les filières, etc.
Ton rôle :
- Réponds aux questions sur les filières, programmes, matières
- Détaille le contenu des matières du niveau de l'étudiant si demandé
- Informe sur les professeurs, l'administration
- Explique le règlement intérieur, les modalités d'examen
- Donne des infos pratiques sur le campus et Sangmélima
- Parle de l'UIECC et des partenariats
Sois précis, organisé, factuel. Si tu ne sais pas, dis-le honnêtement.`,
  };

  return basePrompt + '\n\n' + (modePrompts[mode] || modePrompts.chat);
}

// ============================================
// Appeler Groq
// ============================================
async function callGroq(messages) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: messages,
      temperature: 0.8,
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Erreur Groq');
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content;
}

// ============================================
// Appeler Gemini
// ============================================
async function callGemini(messages) {
  const systemMsg = messages.find(m => m.role === 'system');
  const otherMsgs = messages.filter(m => m.role !== 'system');

  const contents = [];
  if (systemMsg) {
    contents.push({ role: 'user', parts: [{ text: systemMsg.content }] });
    contents.push({ role: 'model', parts: [{ text: 'Compris.' }] });
  }
  for (const msg of otherMsgs) {
    contents.push({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    });
  }

  const response = await fetch(
    `${process.env.GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: { temperature: 0.8, maxOutputTokens: 2048 },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Erreur Gemini');
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text;
}

// ============================================
// Envoyer un message (rotation Groq → Gemini)
// ============================================
export async function sendToGemini(message, mode, userData, history = []) {
  const systemPrompt = buildSystemPrompt(mode, userData, message);

  const messages = [
    { role: 'system', content: systemPrompt },
  ];

  for (const msg of history) {
    messages.push({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content,
    });
  }

  messages.push({ role: 'user', content: message });

  // Essayer Groq d'abord
  try {
    const replyText = await callGroq(messages);
    return { success: true, reply: replyText };
  } catch (groqError) {
    console.error('Groq échoué, tentative Gemini:', groqError.message);
    // Fallback sur Gemini
    try {
      const replyText = await callGemini(messages);
      return { success: true, reply: replyText };
    } catch (geminiError) {
      console.error('Gemini échoué:', geminiError.message);
      return {
        success: false,
        error: 'Tous les fournisseurs IA sont indisponibles.',
        reply: 'Désolé, aucun service IA disponible. Réessaie dans quelques secondes.',
      };
    }
  }
}