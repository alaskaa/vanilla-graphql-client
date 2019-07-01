import * as React from "react";
import Repository from "./Repository";

const Organization = ({
  organization,
  errors,
  onFetchMoreIssues,
  onStarRepository
}) => {
  if (errors) {
    return (
      <p>
        <strong>Something went wrong:</strong>
        {errors.map(error => (
          <p>{error.message}</p>
        ))}
      </p>
    );
  }
  return (
    <div>
      <p>
        <strong>Issues from Organization:</strong>
        <a href={organization.url}>{organization.name}</a>
      </p>
      {/* {organization.repository ? ( */}
      <Repository
        repository={organization.repository}
        onFetchMoreIssues={onFetchMoreIssues}
        onStarRepository={onStarRepository}
      />
      {/* ) : (
        <p>No repositories found</p>
      )} */}
    </div>
  );
};

export default Organization;
