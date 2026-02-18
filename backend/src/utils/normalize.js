function normalizeScore(marksObtained, maxMarks) {
    return ((marksObtained / maxMarks) * 100).toFixed(2);
}

module.exports = normalizeScore;