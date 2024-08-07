export const withTryCatch = (fn: (data: any) => Promise<void>) => {
  return async (data: any) => {
    try {
      await fn(data);
    } catch (error) {
      console.error('An error occurred:', error);
      throw new Error('An error occurred');
    }
  };
};
