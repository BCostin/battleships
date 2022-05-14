
// We mostly need this to set a direction, left of right for ship generation
export const getRandomNr = (max: number) => Math.floor(Math.random() * max);

export const addDelay = async (fn: () => void, ms: number) => {
    await new Promise((resolve) => setTimeout(() => {
        fn();
        resolve(true);
    }, ms));
};
