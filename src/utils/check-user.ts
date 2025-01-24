import { useUser } from "@clerk/clerk-react";

export const CheckUser = () => {
  const { user } = useUser();
  return null;
};
