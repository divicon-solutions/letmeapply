"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export function CheckUser() {
  const { user } = useUser();

  useEffect(() => {
    const checkUserExistsAndCreate = async () => {
      if (user) {
        const { emailAddresses, firstName, id } = user;
        const email = emailAddresses[0]?.emailAddress;
        const name = firstName || "Unknown";

        try {
          const response = await fetch(
            `/api/user?check=true&email=${email}&name=${name}&uid=${id}`,
            {
              method: "GET",
            }
          );

          const data = await response.json();

          if (response.ok) {
            if (data.exists) {
              console.log("User already exists.");
            } else {
              console.log("User created successfully.");
            }
          } else {
            console.error("Error:", data.error);
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };

    checkUserExistsAndCreate();
  }, [user]);

  return null;
}
