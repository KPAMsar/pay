pipeline{
    agent any

    stages {
        stage("Build"){
            steps{
                slackSend channel: 'deployments', message: '[Sojipay Backend]: Starting build...'
                script{
                    def content = readFile '/etc/default/env/sojipay.txt'
                    writeFile file: '.env', text: content
                }
                sh "docker stop sojipay_backend_app && docker rm -f sojipay_backend_app"
                sh "docker build -t sojipay:backend_app ."
                slackSend message: "[Sojipay Backend]: Build $BUILD_NUMBER succeeded", color: 'good'
            }
        }

        stage("Deploy"){
            steps{
                slackSend channel: 'deployments', message: '[Sojipay Backend]: Starting deployment...'
                sh "docker run --name sojipay_backend_app -d -p 9000:9000 sojipay:backend_app"
            }
        }
    }
    post{
        success{
            slackSend message: "[Sojipay Backend]: Successfully deployed to production", color: 'good'
        }
        failure{
            slackSend message: "[Sojipay Backend]: Build $BUILD_NUMBER failed", color: 'danger'
        }
    }
}