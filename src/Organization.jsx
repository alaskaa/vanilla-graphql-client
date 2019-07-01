import * as React from "react";

const Organization = ({ organization, errors }) => {
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
      {organization.repository ? (
        <Repository repository={organization.repository} />
      ) : (
        <p>No repositories found</p>
      )}
    </div>
  );
};

const Repository = ({ repository }) => (
  <div>
    <p>
      <strong>In Repository:</strong>
      <a href={repository.url}>{repository.name}</a>
    </p>
    <ul>
      {repository.issues.edges.map(nodeIssue => (
        <li key={nodeIssue.node.id}>
          <a href={nodeIssue.node.url}>{nodeIssue.node.title}</a>
        </li>
      ))}
    </ul>
  </div>
);

export default Organization;
