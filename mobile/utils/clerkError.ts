export const getClerkError = (err: any): string => {
  return (
    err?.errors?.[0]?.longMessage ||
    err?.errors?.[0]?.message ||
    "Something went wrong. Please try again."
  );
};