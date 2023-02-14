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
                arbitraryFileCache(path: '/var/lib/jenkins/caches/Cypress,.npm',compressionMethod: 'NONE')
                ]) {
                    sh '''
                         npm install istanbul
                         npm ci --prefer-offline
                         npx cypress cache path
                         npx cypress cache list
                         npm run test
                    '''
                }    
            }
            post {
                always {
                  publishHTML target: [
                    allowMissing         : false,
                    alwaysLinkToLastBuild: false,
                    keepAll             : true,
                    reportDir            : 'coverage/lcov-report',
                    reportFiles          : 'index.html',
                    reportName           : 'Coverage Report - HTML'
                 ]
              }
           }
        }

        stage("Publish Coverage") {
            steps {
                cobertura path: 'coverage/**.xml'
            }
        }

        stage('Docker Deploy Staging') {
             when {
                
                branch "staging"
            }
            steps {
              sh '''                  
                export IMAGE_TAG="dev_$(date +%Y-%m-%d-%H-%M)"
                export IMAGE_NAME="${IMAGE_BASE_NAME}:${IMAGE_TAG}"
                docker build -t $IMAGE_NAME . \
                --build-arg ENV="testing"
                docker push $IMAGE_NAME
                '''                             
            }            
        
        }
         stage('Docker Deploy Prod') {
             when {
                
                branch "master"
            }
            steps {
              sh '''                  
                export IMAGE_TAG="prod_$(date +%Y-%m-%d-%H-%M)"
                export IMAGE_NAME="${IMAGE_BASE_NAME}:${IMAGE_TAG}"
                docker build -t $IMAGE_NAME . \
                --build-arg ENV="prod"
                docker push $IMAGE_NAME
                '''                             
            }            
        
        }
    }
}
