
function calculateMatchScore(loggedInUser, candidateUser) {
  let score = 0;
  const reasons = [];

  const commonSkills = loggedInUser.skills.filter(skill =>
    candidateUser.skills.includes(skill)
  );

  if (commonSkills.length > 0) {
    const skillPoints = Math.min(commonSkills.length * 20, 60);
    score += skillPoints;
    reasons.push(`${commonSkills.length} shared skills`);
  }

  if (loggedInUser.city && loggedInUser.city === candidateUser.city) {
    score += 20;
    reasons.push("Same city");
  }

  if (candidateUser.lastActiveAt) {
    const daysAgo =
      (Date.now() - new Date(candidateUser.lastActiveAt)) / (1000 * 60 * 60 * 24);

    if (daysAgo <= 7) {
      score += 20;
      reasons.push("Recently active");
    }
  }

  return {
    matchScore: score,
    reasons
  };
}

module.exports = calculateMatchScore;
