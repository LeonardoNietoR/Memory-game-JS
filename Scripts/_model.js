import { allIcons } from './variables.js';

const shuffleAllIcons = function (icons) {
  for (let i = icons.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = icons[i];
    icons[i] = icons[j];
    icons[j] = temp;
  }
  return icons;
};

export const selectIcons = function (amount) {
  const finalSel = shuffleAllIcons(allIcons).slice(0, amount / 2);
  const iconsDuplicated = finalSel
    .concat(finalSel)
    .sort(() => (Math.random() > 0.5 ? 1 : -1));
  return iconsDuplicated;
};
