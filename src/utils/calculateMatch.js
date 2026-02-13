/**
 * Berechnet die Übereinstimmung zwischen Nutzerantworten und Parteipositionen.
 * Nutzer: -1 (stimme nicht zu), 0 (neutral), 1 (stimme zu)
 * Partei: -2 bis +2
 * Übereinstimmung: 100% minus die durchschnittliche Differenz (skaliert)
 */
export function calculateMatch(userAnswers, partyPositions) {
  let totalMatch = 0;
  let answeredCount = 0;

  for (const [thesisId, userAnswer] of Object.entries(userAnswers)) {
    const thesisIdNum = parseInt(thesisId, 10);
    const partyPosition = partyPositions[thesisIdNum];

    if (partyPosition === undefined || userAnswer === null) continue;

    // Nutzer: -1, 0, 1 -> skaliere auf -2 bis +2 für fairen Vergleich
    const scaledUser = userAnswer * 2;

    // Maximale Differenz ist 4 (-2 vs +2), also Differenz 0-4
    const diff = Math.abs(scaledUser - partyPosition);
    const match = Math.max(0, 100 - (diff / 4) * 100);

    totalMatch += match;
    answeredCount++;
  }

  if (answeredCount === 0) return 0;
  return Math.round((totalMatch / answeredCount) * 10) / 10;
}

export function getSortedResults(userAnswers, parties, positions) {
  return parties
    .map((party) => ({
      ...party,
      match: calculateMatch(userAnswers, positions[party.id] || {}),
    }))
    .sort((a, b) => b.match - a.match);
}
