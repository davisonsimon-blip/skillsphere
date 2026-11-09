import confetti from 'canvas-confetti';

export const triggerConfetti = () => {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#5865F2', '#8B5CF6', '#22D3EE', '#F59E0B'],
    });
  } catch (err) {
    console.error('Confetti error', err);
  }
};

export const triggerLevelUpConfetti = () => {
  try {
    const end = Date.now() + 1500;
    const interval: any = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }
      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: ['#5865F2', '#8B5CF6', '#22D3EE', '#10B981', '#F59E0B'],
      });
    }, 250);
  } catch (err) {
    console.error('Level up confetti error', err);
  }
};
