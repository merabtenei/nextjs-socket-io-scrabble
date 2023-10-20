const letters = "AAAAABBCCDDEEEFFFGGHHIIIJKLLMMNNOOPPPQRRSSSSTTTUUVVVWXYZ";

const shuffle = (array: string[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export function getRandomLetters(nb: number): string[] {
  const shuffledLetters = shuffle(Array.from(letters));
  return Array.from(Array(nb).keys()).map(
    (i) => letters[Math.floor(Math.random() * shuffledLetters.length)]
  );
}
