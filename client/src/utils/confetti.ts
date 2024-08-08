import JSConfetti from "js-confetti";

const jsConfetti = new JSConfetti();

export const confetti = {
  start,
};

type Confetti = {
  emojis: string[];
  emojiSize: number;
  confettiNumber: number;
};

const CONFETTI: Confetti = {
  emojis: [
    // "🍫",
    "🍬",
    "🍭",
    // "🍩",
    // "🍨",
    // "🍧",
    // "🍦",
    // "🍪",
    // "🎁",
    "🎉",
    // "✨",
    // "🎈",
    "🎊",
    // "🎀",
  ],
  emojiSize: 60,
  confettiNumber: 70,
};

function start() {
  jsConfetti.addConfetti(CONFETTI);
}
