import axios from "axios";
import { ProfileData } from "../../types/profile";
import { BASE_API_URL } from "../../utils/config";
import toast from "react-hot-toast";

export const updateSection = async (
  clerk_id: string,
  email: string,
  sectionName: string,
  content: unknown,
  initialValues: ProfileData,
  token: string
) => {
  try {
    if (!token) {
      throw new Error("No authentication token available");
    }
    console.log("Token used for request:", token);

    const requestData = {
      email,
      clerk_id,
      resume: {
        ...initialValues,
        [sectionName]: content,
      },
    };

    console.log("Request payload:", JSON.stringify(requestData, null, 2));

    const response = await axios.post(
      `${BASE_API_URL}/api/v1/profiles`,
      requestData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorDetails = error.response?.data?.detail;
      console.error("Error details:", errorDetails);
      console.error("Full error response:", error.response?.data);
      console.error("Request headers:", error.config?.headers);

      let errorMessage = "Failed to update section";
      if (Array.isArray(errorDetails)) {
        errorMessage = errorDetails
          .map((detail) => detail.msg || detail)
          .join(", ");
      } else if (errorDetails) {
        errorMessage = errorDetails;
      }

      toast.error(`Failed to update section: ${errorMessage}`);
    } else {
      console.error("Error updating section:", error);
      toast.error("Failed to update section");
    }
    throw error;
  }
};

export const handleChange = async (
  section: string,
  newData: unknown,
  clerk_id: string | undefined,
  initialValues: ProfileData,
  token: string
) => {
  if (!clerk_id) {
    toast.error("User ID is required");
    return;
  }

  try {
    if (!token) {
      throw new Error("No authentication token available");
    }

    const requestData = {
      email: initialValues.personalInfo.email,
      clerk_id,
      resume: {
        ...initialValues,
        [section]: newData,
      },
    };

    console.log("Request payload:", JSON.stringify(requestData, null, 2));

    const response = await axios.put(
      `${BASE_API_URL}/api/v1/profiles/clerk/${clerk_id}`,
      requestData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("API Response:", response.data);

    if (section !== "skills") {
      toast.success(
        `${
          section.charAt(0).toUpperCase() + section.slice(1)
        } updated successfully`
      );
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorDetails = error.response?.data?.detail;
      console.error("Error details:", errorDetails);
      console.error("Full error response:", error.response?.data);
      console.error("Request headers:", error.config?.headers);

      let errorMessage = "Failed to update section";
      if (Array.isArray(errorDetails)) {
        errorMessage = errorDetails
          .map((detail) => detail.msg || detail)
          .join(", ");
      } else if (errorDetails) {
        errorMessage = errorDetails;
      }

      toast.error(`Failed to update section: ${errorMessage}`);
    } else {
      console.error("Error updating section:", error);
      toast.error("Failed to update section");
    }
    throw error;
  }
};
