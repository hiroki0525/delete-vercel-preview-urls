// https://vercel.com/docs/rest-api#interfaces/pagination
/** This object contains information related to the pagination of the current request, including the necessary parameters to get the next or previous page of data. */
interface Pagination {
  /** Amount of items in the current page. */
  count: number;
  /** Timestamp that must be used to request the next page. */
  next: number | null;
  /** Timestamp that must be used to request the previous page. */
  prev: number | null;
}

// https://vercel.com/docs/rest-api#endpoints/deployments/list-deployments
export interface DeploymentsResponse {
  pagination: Pagination;
  deployments: {
    /** The unique identifier of the deployment. */
    uid: string;
    /** The name of the deployment. */
    name: string;
    /** The URL of the deployment. */
    url: string;
    /** Timestamp of when the deployment got created. */
    created: number;
    /** The source of the deployment. */
    source?: "cli" | "git" | "import" | "import/repo" | "clone/repo";
    /** In which state is the deployment. */
    state?:
      | "BUILDING"
      | "ERROR"
      | "INITIALIZING"
      | "QUEUED"
      | "READY"
      | "CANCELED";
    /** The type of the deployment. */
    type: "LAMBDAS";
    /** Metadata information of the user who created the deployment. */
    creator: {
      /** The unique identifier of the user. */
      uid: string;
      /** The email address of the user. */
      email?: string;
      /** The username of the user. */
      username?: string;
      /** The GitHub login of the user. */
      githubLogin?: string;
      /** The GitLab login of the user. */
      gitlabLogin?: string;
    };
    /** An object containing the deployment's metadata */
    meta?: { [key: string]: string };
    /** On which environment has the deployment been deployed to. */
    target?: ("production" | "staging") | null;
    /** An error object in case aliasing of the deployment failed. */
    aliasError?: {
      code: string;
      message: string;
    } | null;
    aliasAssigned?: (number | boolean) | null;
    /** Timestamp of when the deployment got created. */
    createdAt?: number;
    /** Timestamp of when the deployment started building at. */
    buildingAt?: number;
    /** Timestamp of when the deployment got ready. */
    ready?: number;
    /** State of all registered checks */
    checksState?: "registered" | "running" | "completed";
    /** Conclusion for checks */
    checksConclusion?: "succeeded" | "failed" | "skipped" | "canceled";
    /** Vercel URL to inspect the deployment. */
    inspectorUrl: string | null;
    /** Deployment can be used for instant rollback */
    isRollbackCandidate?: boolean | null;
  }[];
}
