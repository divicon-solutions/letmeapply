"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { BASE_API_URL } from "./config";
import { useRouter } from "next/router";

export function CheckUser() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const checkUserExistsAndCreate = async () => {
      if (user) {
        const { emailAddresses, firstName, id } = user;
        const email = emailAddresses[0]?.emailAddress;
        const name = firstName || "Unknown";

        try {
          // Check if user exists
          const response = await fetch(
            `${BASE_API_URL}/api/v1/profiles/clerk/${id}`,
            {
              method: "GET",
              credentials: "include",
            }
          );

          if (response.status === 404) {
            console.log("User does not exist. Creating user...");
            // User does not exist, create user
            const createResponse = await fetch(
              `${BASE_API_URL}/api/v1/profiles`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                  email,
                  clerk_id: id,
                }),
              }
            );

            console.log("CREATE RESPONSE----", createResponse);

            if (createResponse.ok) {
              console.log("User created successfully.");
              router.push("/profile");
            } else {
              const createData = await createResponse.json();
              console.error("Error creating user:", createData.error);
            }
          } else if (response.ok) {
            const data = await response.json();
            router.push("/profile");
            console.log("User already exists:", data);
          } else {
            const data = await response.json();
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
