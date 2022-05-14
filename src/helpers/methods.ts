
// We mostly need this to set a direction, left of right for ship generation
export const getRandomNr = (max: number) => Math.floor(Math.random() * max);

export const addDelay = async (fn: () => void, ms: number) => {
    await new Promise((resolve) => setTimeout(() => {
        fn();
        resolve(true);
    }, ms));
};

// Need this for ships' directions
export const getDirection = () => getRandomNr(2) == 0 ? 'horizontal' : 'vertical';

export const compareArr = (arr1: any, arr2: any) => JSON.stringify(arr1).includes(JSON.stringify(arr2));