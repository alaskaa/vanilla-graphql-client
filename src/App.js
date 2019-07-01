import * as React from "react";
import axios from "axios";
import Organization from "./Organization";
// import logo from './logo.svg';
// import './App.css';

// set up baseUrl
const axiosGitHubGraphQL = axios.create({
  baseURL: "https://api.github.com/graphql",
  headers: {
    Authorization: `bearer ${
      process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN
    }`
  }
});

// can call this function in our function for fetching data from GitHub -- returns payload
const getIssuesOfRepository = (path, cursor) => {
  const [organization, repository] = path.split("/");

  // run our GraphQL query and pass the following variables we extracted from path
  return axiosGitHubGraphQL.post("", {
    query: GET_ISSUES_OF_REPOSITORY,
    variables: { organization, repository, cursor }
  });
};

// higher order function -- cleans up the set state
const resolveIssuesQuery = (queryResult, cursor) => state => {
  const { data, errors } = queryResult.data;

  if (!cursor) {
    return {
      organization: data.organization,
      errors
    };
  }

  const { edges: oldIssues } = state.organization.repository.issues;
  const { edges: newIssues } = data.organization.repository.issues;
  const updatedIssues = [...oldIssues, ...newIssues];

  return {
    organization: {
      ...data.organization,
      repository: {
        ...data.organization.repository,
        issues: {
          ...data.organization.repository.issues,
          edges: updatedIssues
        }
      }
    },
    errors
  };
};

const GET_ISSUES_OF_REPOSITORY = `
query ($organization: String!, $repository: String!, $cursor: String)
{
  organization(login: $organization) {
    name
    url
    repository(name: $repository) {
      name
      url
      issues(first: 5, after: $cursor, states: [OPEN]) {
        edges {
          node {
            id
            title
            url
            reactions(last: 3) {
              edges {
                node {
                  id
                  content
                }
              }
            }
          }
        }
        totalCount
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
}`;

const TITLE = "React GraphQL GitHub Client";

class App extends React.Component {
  state = {
    path: "the-road-to-learn-react/the-road-to-learn-react",
    organization: null,
    errors: null
  };

  componentDidMount() {
    this.onFetchFromGitHub(this.state.path);
  }

  onChange = event => {
    this.setState({
      path: event.target.value
    });
  };

  onSubmit = event => {
    this.onFetchFromGitHub(this.state.path);

    event.preventDefault();
  };

  // can then take in the data result here and put it into state using our higher order function
  onFetchFromGitHub = (path, cursor) => {
    // this will run the extraction of vars and the query itself
    getIssuesOfRepository(path, cursor).then(
      queryResult => this.setState(resolveIssuesQuery(queryResult, cursor))
      // put the resulting vars into state
    );
  };

  onFetchMoreIssues = () => {
    const { endCursor } = this.state.organization.repository.issues.pageInfo;
    console.log(endCursor);
    this.onFetchFromGitHub(this.state.path, endCursor);
  };

  render() {
    const { path, organization, errors } = this.state;

    return (
      <div>
        <h1>{TITLE}</h1>

        <form onSubmit={this.onSubmit}>
          <label htmlFor="url">Show open issues for https://github.com/</label>
          <input
            id="url"
            type="text"
            onChange={this.onChange}
            style={{ width: "300px" }}
            // make input field controlled component: don't use HTML state behaviour, should be React
            value={path}
          />
          <button type="submit">Search</button>
        </form>

        <hr />
        {organization ? (
          <Organization
            organization={organization}
            errors={errors}
            onFetchMoreIssues={this.onFetchMoreIssues}
          />
        ) : (
          <p>No information yet ...</p>
        )}
      </div>
    );
  }
}

export default App;
