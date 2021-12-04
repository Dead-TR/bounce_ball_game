export const createGuard = function <Type>(checkedKey: string) {
  return function (value: Type | any): value is Type {
    if (!value) {
      return false;
    }

    //@ts-ignore
    const result = (value as Type)[checkedKey];

    return !!result || result === 0;
  };
};

export default createGuard;
