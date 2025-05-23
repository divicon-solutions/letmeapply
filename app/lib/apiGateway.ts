import { Job } from "@/types/job";
import { getAdzunaJobs } from "./adzuna";

export interface JobSearchParams {
  searchText: string;
  jobType: string;
  location: string;
  datePosted: string;
  page: number;
  pageSize: number;
}

export class APIGateway {
  static async fetchJobs(params: JobSearchParams): Promise<Job[]> {
    try {
      const defaultPageSize = 20;
      const adzunaJobs = await this.fetchJobsFromAdzuna({
        ...params,
        pageSize: defaultPageSize,
      });

      return adzunaJobs;
    } catch (error) {
      console.error("Error fetching jobs from Adzuna:", error);
      return [];
    }
  }

  private static async fetchJobsFromAdzuna(
    params: JobSearchParams
  ): Promise<Job[]> {
    try {
      const adzunaData = await getAdzunaJobs(
        params.searchText,
        params.jobType,
        params.location,
        params.datePosted,
        params.page,
        params.pageSize
      );

      return adzunaData.results
        .filter(
          (job: any) =>
            job.id &&
            job.title &&
            job.company?.display_name &&
            job.location?.display_name &&
            job.created &&
            job.description &&
            job.redirect_url
        )
        .map((job: any) => ({
          title: job.title,
          company: job.company.display_name,
          location: job.location.display_name,
          job_type: params.jobType,
          posted_at: job.created,
          desc: job.description,
          company_logo: job.company.logo || "",
          platform_name: "adzuna",
          external_job_id: job.id,
          link: job.redirect_url,
        }));
    } catch (error) {
      console.error("Error in fetchJobsFromAdzuna:", error);
      return [];
    }
  }

  // Future methods for other APIs can be added here
}
