pipeline {
    agent any
    parameters {
        string(name: 'ENV_TAG', defaultValue: 'dev')
        string(name: 'DOCKER_ENV', defaultValue: 'testing')

    }
    environment {

           APP_NAME = "seller-fulfillment"
           IMAGE_BASE_NAME = "${CI_REGISTRY}/${APP_NAME}"
    }

    stages {
        stage('ES Lint') {
            agent { 
                docker { 
                    image 'node:14.20.0-alpine'
                    args '--user root'     
                } 
            }
            
            steps {
                          
                sh '''
                    npm i eslint
                    npm run lint
                '''

            }            
        }

        stage('Test') {
            agent { 
                docker { 
                    image 'cypress/base:14.16.0'
                    args '--user=root'
                } 
            } 
            steps {
                cache(maxCacheSize: 900, caches: [
                arbitraryFileCache(path: '/root/.cache/Cypress,.npm',compressionMethod: 'NONE')
                ]) {
                    sh '''
                         npm ci --prefer-offline
                         npx cypress cache path
                         npx cypress cache list
                         npm run test
                    '''
                }               
            }
        }

        stage('Docker Build & Push Image') {
            //  when {
            //     anyOf {
            //         branch "master"; branch "staging"; branch "beta"
            //     }
            // }
            steps {
              script {
                
                    if(env.BRANCH_NAME == "master") {

                        env.ENV_TAG = "prod"
                        env.DOCKER_ENV = "prod"
                        IMAGE_TAG="${ENV_TAG}_$(date +%Y-%m-%d-%H-%M)"
                        IMAGE_NAME="${IMAGE_BASE_NAME}:${IMAGE_TAG}"
                        docker build -t $IMAGE_NAME . \
                        --build-arg ENV="${DOCKER_ENV}"

                    }else if (env.BRANCH_NAME == "staging") {

                        env.ENV_TAG = "dev"
                        env.DOCKER_ENV = "testing"
                        IMAGE_TAG="${ENV_TAG}_$(date +%Y-%m-%d-%H-%M)"
                        IMAGE_NAME="${IMAGE_BASE_NAME}:${IMAGE_TAG}"
                        docker build -t ${IMAGE_NAME} . \
                        --build-arg ENV="${DOCKER_ENV}"

                    }else {
                        export IMAGE_NAME="${CI_REGISTRY}/${APP_NAME}:$(echo env.BRANCH_NAME | awk -F "/" '{ print $2 }')_$(date +%Y-%m-%d-%H-%M)"
                        docker build -t ${IMAGE_NAME} . 
                    }
            }

                sh 'docker push $IMAGE_NAME'
              }
        }
    }
}
