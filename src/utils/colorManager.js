const chroma = require("chroma-js");
const NodeCache = require("node-cache");

const userColorCache = new NodeCache({ stdTTL: 1800 }); // 30 minutes

function generateDistinctColors(count = 32, minDistance = 30) {
    const colors = [];

    while (colors.length < count) {
        // Generate random HCL color
        const h = Math.random() * 360;
        const c = 30 + Math.random() * 70;
        const l = 30 + Math.random() * 50;
        let color = chroma.hcl(h, c, l);

        // Check if the new color is distinct enough
        let isDistinct = colors.every(existing => {
            const dist = chroma.distance(existing, color, 'lab');
            return dist >= minDistance;
        });

        if (!isDistinct) {
            // If color too close, should make a drastic change (e.g. lighten a lot)
            const lighter = color.set('lab.l', Math.min(100, l + 40));
            isDistinct = colors.every(existing => chroma.distance(existing, lighter, 'lab') >= minDistance);
            if (isDistinct) {
                color = lighter;
            } else {
                continue;
            }
        }

        colors.push(color.hex());
    }

    // Shuffle the final list
    for (let i = colors.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [colors[i], colors[j]] = [colors[j], colors[i]];
    }

    return colors;
}

const colorPalette = generateDistinctColors(32);
let colorIndex = 0;

function getNextColor() {
  const color = colorPalette[colorIndex];
  colorIndex = (colorIndex + 1) % colorPalette.length;
  return color;
}

function getUserColor(userId) {
  let userColor = userColorCache.get(userId);

  if (!userColor) {
    userColor = getNextColor();
    userColorCache.set(userId, userColor);
  }

  return userColor;
}

module.exports = { getUserColor };
