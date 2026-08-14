export const LESSON_CHARACTERS = [
  { src: '/characters/1ec082de7137d333435e.svg', name: 'Zari' },
  { src: '/characters/3b2af5841d5325e4acd3.svg', name: 'Lily' },
  { src: '/characters/4a0a10a8a660d11fe5af.svg', name: 'Vikram' },
  { src: '/characters/4f72eb158dd9f677e4b7.svg', name: 'Oscar' },
  { src: '/characters/6ae0baeaa1d7dd4ccf6a.svg', name: 'Eddy' },
  { src: '/characters/8f4324c94d96cd9d9aaa.svg', name: 'Junior' },
  { src: '/characters/47cea17496b4500c170e.svg', name: 'Bea' },
  { src: '/characters/52ba0a30df9d8346a1d7.svg', name: 'Lin' },
  { src: '/characters/110d4df28101d8233f60.svg', name: 'Lucy' },
  { src: '/characters/3759efd081011423baf6.svg', name: 'Falstaff' },
  { src: '/characters/a03a97f71a7fd0903382.svg', name: 'Junior' },
  { src: '/characters/bb221188924ec942b2f1.svg', name: 'Eddy' },
  { src: '/characters/bbf046e54218c9eeb1e9.svg', name: 'Bea' },
  { src: '/characters/6bf7411898766ffa8cb8.svg', name: 'Lin' },
];

export function getRandomCharacter(seed?: string) {
  if (seed) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }
    const idx = Math.abs(hash) % LESSON_CHARACTERS.length;
    return LESSON_CHARACTERS[idx];
  }
  return LESSON_CHARACTERS[Math.floor(Math.random() * LESSON_CHARACTERS.length)];
}
