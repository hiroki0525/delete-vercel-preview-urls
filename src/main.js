import { setTimeout } from "timers/promises";

const targetBranch = process.env.TARGET_BRANCH;
const vercelToken = process.env.VERCEL_TOKEN;
const vercelProjectId = process.env.VERCEL_PROJECT_ID || "";

const vercelBaseUrl = "https://api.vercel.com";
const vercelGetDeploymentsEndpoint = `${vercelBaseUrl}/v6/deployments`;
const vercelDeleteDeploymentsEndpoint = `${vercelBaseUrl}/v13/deployments`;

console.info(`Target branch is ${targetBranch}.`);

// https://vercel.com/docs/rest-api#endpoints/deployments/list-deployments
// max limit is 100 according to https://vercel.com/docs/rest-api#introduction/api-basics/pagination
const deploymentsRes = await fetch(
  `${vercelGetDeploymentsEndpoint}?limit=100&projectId=${vercelProjectId}`,
  {
    headers: {
      Authorization: `Bearer ${vercelToken}`,
    },
    method: "get",
  }
);
if (!deploymentsRes.ok) {
  console.error(
    `Status code is ${deploymentsRes.status} when fetched to get deployments list. The response message is as follows.`
  );
  const resText = await deploymentsRes.text();
  throw new Error(resText);
}
const { deployments } = await deploymentsRes.json();
const shouldDeleteDeploymentIds = deployments
  .filter(
    ({ state, meta }) =>
      meta?.githubCommitRef === targetBranch &&
      ["BUILDING", "INITIALIZING", "QUEUED", "READY"].includes(state)
  )
  .map(({ uid }) => uid);

const shouldDeleteDeploymentCount = shouldDeleteDeploymentIds.length;
console.info(
  `Matched deployments are ${shouldDeleteDeploymentCount}\nTheir ids are ${shouldDeleteDeploymentIds.join(
    ","
  )}`
);
if (shouldDeleteDeploymentCount === 0) {
  throw new Error(
    "There are no deployments which should be deleted.\nPlease check Vercel Console."
  );
}

const notDeletedDeploymentIds = [];
// forEach can't use async/await
shouldDeleteDeploymentIds.map(async (deploymentId) => {
  let deleteDeploymentRes;
  try {
    await setTimeout(1000);
    // https://vercel.com/docs/rest-api#endpoints/deployments/delete-a-deployment
    deleteDeploymentRes = await fetch(
      `${vercelDeleteDeploymentsEndpoint}/${deploymentId}`,
      {
        headers: {
          Authorization: `Bearer ${vercelToken}`,
        },
        method: "delete",
      }
    );
    if (!deleteDeploymentRes.ok) {
      const resText = await deleteDeploymentRes.text();
      throw new Error(resText);
    }
  } catch (e) {
    console.error(
      `Status code is ${deleteDeploymentRes?.status} when fetched to delete a deployment.`
    );
    console.error(e);
    notDeletedDeploymentIds.push(deploymentId);
  }
});

if (notDeletedDeploymentIds.length > 0) {
  throw new Error(
    `There are some deployments which couldn't be deleted.\nThe deployments ids are ${notDeletedDeploymentIds.join(
      ","
    )}`
  );
}
console.info(
  `Success! There are all deleted deployments which ids are ${shouldDeleteDeploymentIds.join(
    ","
  )}`
);
