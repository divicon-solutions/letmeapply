const adzunaAppId = process.env.ADZUNA_APP_ID;
const adzunaAppKey = process.env.ADZUNA_APP_KEY;

export const getAdzunaJobs = async (
  searchText: string,
  jobType: string,
  location: string,
  datePosted: string,
  page: number,
  pageSize: number
) => {
  const params = new URLSearchParams({
    app_id: adzunaAppId || "",
    app_key: adzunaAppKey || "",
    results_per_page: pageSize.toString(),
    what: searchText,
  });

  //   if (jobType) params.append("contract_type", jobType);
  if (location) params.append("where", location);
  if (jobType === "full-time") {
    params.append("what_exclude", "w2 months c2c contract");
    params.append("full_time", "1");
  } else if (jobType === "contract") {
    params.append("contract", "1");
  }

  // Convert datePosted to number of days
  if (datePosted) {
    let days: number;
    switch (datePosted) {
      case "Past 24 hours":
        days = 1;
        break;
      case "Last 3 days":
        days = 3;
        break;
      case "Last week":
        days = 7;
        break;
      case "Last month":
        days = 30;
        break;
      default:
        days = 0;
    }
    if (days > 0) {
      params.append("max_days_old", days.toString());
    }
  }

  const url = `https://api.adzuna.com/v1/api/jobs/us/search/${page}?${params
    .toString()
    .replace(/\+/g, "%20")}`;

  console.log("Adzuna API URL:", url);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Adzuna API Error:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Unexpected response from Adzuna API:", text);
      throw new Error("Unexpected response from Adzuna API");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching jobs from Adzuna:", error);
    throw error;
  }
};
