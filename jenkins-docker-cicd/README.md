# Jenkins + Docker CI/CD

A small learning project showing how a Jenkins pipeline can automatically test an application, build it, and package it into a Docker container.

The app itself is intentionally tiny (a Node.js HTTP server). The point of the repo is the **pipeline**, not the application.

## What the pipeline does

```
Git push -> Jenkins -> Test -> Docker build -> Smoke test -> (optional) Push image
```

| Stage | What happens |
|-------|--------------|
| Checkout | Jenkins pulls the latest code from this repository |
| Test | Runs `npm test` inside a temporary `node:20-alpine` container |
| Build Docker Image | Builds the image from the `Dockerfile`, tagged with the build number and `latest` |
| Smoke Test Container | Starts the container and calls `/health` to confirm it actually runs |
| Push Image (optional) | Pushes the image to Docker Hub (commented out; enable it with your credentials) |

## Project structure

```
jenkins-docker-cicd/
├── app/
│   ├── server.js        # Minimal Node.js HTTP server
│   └── server.test.js   # Tests using Node's built-in test runner
├── Dockerfile           # Container image definition
├── Jenkinsfile          # Declarative pipeline
├── package.json
└── README.md
```

## Run it locally

Without Docker:

```bash
npm test
npm start
# open http://localhost:3000
```

With Docker:

```bash
docker build -t jenkins-docker-cicd .
docker run -p 3000:3000 jenkins-docker-cicd
curl http://localhost:3000/health
```

## Endpoints

| Route | Response |
|-------|----------|
| `GET /` | JSON greeting with the build number |
| `GET /health` | `{"status":"ok"}` (used by the Docker healthcheck and pipeline) |

## Set up the pipeline in Jenkins

1. Run Jenkins on a machine that has Docker installed, and make sure the `jenkins` user can use Docker (`sudo usermod -aG docker jenkins`, then restart Jenkins).
2. Create a new item: **New Item -> Pipeline**.
3. Under **Pipeline**, choose **Pipeline script from SCM**, select **Git**, and paste this repository's URL.
4. Set the script path to `Jenkinsfile` and save.
5. Click **Build Now**, or add a GitHub webhook so every push triggers a build automatically.

## Optional: push to Docker Hub

1. In Jenkins, add a **Username with password** credential with the ID `dockerhub-creds`.
2. Uncomment the `Push Image` stage in the `Jenkinsfile`.

## What I learned

- How a `Jenkinsfile` describes build, test and deploy steps as code
- Writing a Dockerfile with layer caching, a non-root user and a healthcheck
- Running tests in disposable containers so build machines stay clean
- Verifying a container actually works with a smoke test before trusting an image

## Possible improvements

- Add a linting stage
- Push images to a registry and deploy them to a server
- Trigger builds automatically with a GitHub webhook
- Add notifications (email or Slack) on build failure

## Tech stack

Jenkins, Docker, Git, Node.js

## License

MIT
