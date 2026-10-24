pipeline {
    agent any

    environment {
        IMAGE_NAME = 'jenkins-docker-cicd'
        IMAGE_TAG  = "${env.BUILD_NUMBER}"
    }

    options {
        timestamps()
        timeout(time: 15, unit: 'MINUTES')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Test') {
            steps {
                // Run tests inside a throwaway Node container so the Jenkins
                // machine does not need Node.js installed.
                sh '''
                    docker run --rm \
                      -v "$PWD":/usr/src/app -w /usr/src/app \
                      node:20-alpine npm test
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -t ${IMAGE_NAME}:latest .
                '''
            }
        }

        stage('Smoke Test Container') {
            steps {
                sh '''
                    docker run -d --name smoke-${BUILD_NUMBER} -p 3000:3000 ${IMAGE_NAME}:${IMAGE_TAG}
                    sleep 5
                    curl -f http://localhost:3000/health
                '''
            }
            post {
                always {
                    sh 'docker rm -f smoke-${BUILD_NUMBER} || true'
                }
            }
        }

        // Optional: push to Docker Hub. Add a "Username with password"
        // credential in Jenkins with the ID "dockerhub-creds", then uncomment.
        //
        // stage('Push Image') {
        //     steps {
        //         withCredentials([usernamePassword(credentialsId: 'dockerhub-creds',
        //                 usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
        //             sh '''
        //                 echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
        //                 docker tag ${IMAGE_NAME}:${IMAGE_TAG} $DOCKER_USER/${IMAGE_NAME}:${IMAGE_TAG}
        //                 docker push $DOCKER_USER/${IMAGE_NAME}:${IMAGE_TAG}
        //             '''
        //         }
        //     }
        // }
    }

    post {
        success { echo "Build ${env.BUILD_NUMBER} succeeded: ${IMAGE_NAME}:${IMAGE_TAG}" }
        failure { echo "Build ${env.BUILD_NUMBER} failed. Check the stage logs above." }
        cleanup { sh 'docker image prune -f || true' }
    }
}
