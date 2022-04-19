
def deployConfig = [
  devTipWithoutTag: [
    AWS_REGION: 'eu-west-1',
    ENV: 'dev',
    PRODUCT_ID: 'seecommerce',
    BUCKET_NAME: 'seecommerce',
    BASE_URL_GATEWAY: 'https://api-dev.wardacloud.com',
    AUTH0_DOMAIN: 'login-dev.wardacloud.com',
    AUTH0_CLIENT_ID: '4FP973okOHRroCow76FrWyaBmo0mhMWR',
    CLOUDFRONT_ID: 'E279K1URJXDC5B',
    WEBSOCKET_URL: 'wss://notifier-socket-dev.wardacloud.com/socket',
    X_API_KEY: 'da2-x77dhydyvff4vkwfoay72taczu'
  ],
  dev : [
    AWS_REGION: 'eu-west-1',
    ENV: 'dev',
    PRODUCT_ID: 'seecommerce',
    BUCKET_NAME: 'seecommerce',
    BASE_URL_GATEWAY: 'https://api-dev.wardacloud.com',
    AUTH0_DOMAIN: 'login-dev.wardacloud.com',
    AUTH0_CLIENT_ID: '4FP973okOHRroCow76FrWyaBmo0mhMWR',
    CLOUDFRONT_ID: 'E279K1URJXDC5B',
    WEBSOCKET_URL: 'wss://notifier-socket-dev.wardacloud.com/socket',
    X_API_KEY: 'da2-x77dhydyvff4vkwfoay72taczu'
  ],
  test: [
    AWS_REGION: 'eu-west-1',
    ENV: 'test',
    PRODUCT_ID: 'seecommerce',
    BUCKET_NAME: 'seecommerce',
    BASE_URL_GATEWAY: 'https://api-test.wardacloud.com',
    AUTH0_DOMAIN: 'login-test.wardacloud.com',
    AUTH0_CLIENT_ID: 'R1VMe4TbcboOUpXodyNJ7CfQ3WG2Kaqk',
    CLOUDFRONT_ID: 'E279K1URJXDC5B',
    WEBSOCKET_URL: 'wss://notifier-socket-test.wardacloud.com/socket',
    X_API_KEY: 'da2-ighlw5m4pzfnthwsaiz4x4wifm'
  ],
  prod: [
    AWS_REGION: 'eu-west-1',
    ENV: 'prod',
    PRODUCT_ID: 'seecommerce',
    BUCKET_NAME: 'seecommerce',
    BASE_URL_GATEWAY: 'https://api.wardacloud.com',
    AUTH0_DOMAIN: 'login.wardacloud.com',
    AUTH0_CLIENT_ID: 'Zn8JuyX7ofFTh1YfgK1NhxDzMLJDACQf',
    CLOUDFRONT_ID: 'E279K1URJXDC5B',
    WEBSOCKET_URL: 'wss://notifier-socket.wardacloud.com/socket',
    X_API_KEY: 'da2-js54yynqj5divflros56v6tppu'
  ]
]

// Forse va 2
def getChangeString() {
  MAX_MSG_LEN = 100
  def changeString = ""
  echo "Gathering SCM changes"
  def changeLogSets = currentBuild.changeSets
  for (int i = 0; i < changeLogSets.size(); i++) {
    def entries = changeLogSets[i].items
    for (int j = 0; j < entries.length; j++) {
      def entry = entries[j]
      truncated_msg = entry.msg.take(MAX_MSG_LEN)
      changeString += " - ${truncated_msg} [${entry.author}]\n"
    }
  }

  if (!changeString) {
    changeString = " - No new changes"
  }
  return changeString
}

pipeline {

  options {
    disableConcurrentBuilds()
  }

  parameters {
    string(name: 'AGENT_LABEL', defaultValue: 'jenkins-slave', description: 'Agent Label?')
    choice(choices: ['devTipWithoutTag', 'dev', 'test', 'prod'], description: 'What enviroment to update?', name: 'ENV')
    string(name: 'tag', defaultValue: '', description: 'Tag (version)?')
  }

  agent {
    label "${params.AGENT_LABEL}"
  }

  stages {
    stage('Check') {
      steps {
        sh """
        ls -la
        git --version
        aws --version
        """

        script {
          switch (params.ENV) {
            case "prod":
              sh """
              git checkout tags/${params.tag}
              """
              break
            case "test":
              sh """
              git checkout tags/${params.tag}
              """
              break
            case "dev":
              sh """
              git checkout tags/${params.tag}
              """
            break
            case "devTipWithoutTag":
              sh """
              git status
              git tag
              git branch
              """
              break
            default:
              error("Build failed: only dev, test and master envs are allowed")
              break
          }
        }
      }
    }

    stage('Write version') {
      steps {
        nodejs(nodeJSInstallationName: 'nodejs-14-17-1') {
          sh """
          npm run write:version -- ${deployConfig[params.ENV].ENV} "${params.tag}"
          """
        }
      }
    }

    stage('Install') {
      steps {
        nodejs(nodeJSInstallationName: 'nodejs-14-17-1') {
          sh """
          npm --version
          npm ci
          """
        }
      }
    }

    stage('Build SeeCommerce') {
      steps {
        nodejs(nodeJSInstallationName: 'nodejs-14-17-1') {
          withEnv(["BASE_URL_GATEWAY=${deployConfig[params.ENV].BASE_URL_GATEWAY}",
          "AUTH0_DOMAIN=${deployConfig[params.ENV].AUTH0_DOMAIN}",
          "AUTH0_CLIENT_ID=${deployConfig[params.ENV].AUTH0_CLIENT_ID}",
          "PRODUCT_ID=${deployConfig[params.ENV].PRODUCT_ID}",
          "PUBLISH_KEY=${deployConfig[params.ENV].PUBLISH_KEY}",
          "SUBSCRIBE_KEY=${deployConfig[params.ENV].SUBSCRIBE_KEY}",
          "WEBSOCKET_URL=${deployConfig[params.ENV].WEBSOCKET_URL}",
          "X_API_KEY=${deployConfig[params.ENV].X_API_KEY}",
          "ENV=${deployConfig[params.ENV].ENV}",
          ]) {
            sh """
            npm run build
            """
          }
        }
        withAWS(credentials: 'seecommerce-ui-aws-credentials') {
          sh """
          aws s3 sync ./bucket s3://${deployConfig[params.ENV].BUCKET_NAME}/ui2/${deployConfig[params.ENV].ENV} --exclude *.svg --delete
          aws s3 cp index.html s3://${deployConfig[params.ENV].BUCKET_NAME}/ui2/${deployConfig[params.ENV].ENV}/index.html
          aws s3 sync ./bucket s3://${deployConfig[params.ENV].BUCKET_NAME}/ui2/${deployConfig[params.ENV].ENV} --exclude '*' --include '*.svg' --no-guess-mime-type --content-type image/svg+xml
          aws cloudfront create-invalidation --distribution-id ${deployConfig[params.ENV].CLOUDFRONT_ID} --paths '/*'
          """
        }
      }
    }

    stage('Build Storybook') {
      steps {
        script {
          switch (params.ENV) {
            case "test":
              nodejs(nodeJSInstallationName: 'nodejs-14-17-1') {
                sh """
                npm run storybook:build-static
                """
              }
              withAWS(credentials: 'warda-static-resources-ci') {
                sh """
                aws s3 sync ./.out s3://warda-static-resources/seecommerceui --exclude *.svg
                """
              }
              break
            default:
              break
          }
        }
      }
    }

  }

  post {
    always {
      echo 'This will always run'
    }
    success {
      echo 'This will run only if successful'
      bitbucketStatusNotify(buildState: 'SUCCESSFUL')
      slackSend channel: '#build-warda-ui', color: 'good', message: "Job name:${JOB_NAME} - environment:${params.ENV} - tag:${params.tag} - <${BUILD_URL}|Build#${BUILD_NUMBER}>"+"\n"+"Changeset: ${GIT_COMMIT}"+"\n"+getChangeString(), teamDomain: 'warda-core', tokenCredentialId: 'warda-team-build-warda-ui-slack-token'
    }
    failure {
      echo 'This will run only if failed'
      bitbucketStatusNotify(buildState: 'FAILED')
      slackSend channel: '#build-warda-ui', color: 'danger', message: "Job name:${JOB_NAME} - environment:${params.ENV} - tag:${params.tag} - <${BUILD_URL}|Build#${BUILD_NUMBER}>"+"\n"+"Changeset: ${GIT_COMMIT}"+"\n"+getChangeString(), teamDomain: 'warda-core', tokenCredentialId: 'warda-team-build-warda-ui-slack-token'
    }
    unstable {
      echo 'This will run only if the run was marked as unstable'
      slackSend channel: '#build-warda-ui', color: 'warning', message: "Job name:${JOB_NAME} - environment:${params.ENV} - tag:${params.tag} - <${BUILD_URL}|Build#${BUILD_NUMBER}>"+"\n"+"Changeset: ${GIT_COMMIT}"+"\n"+getChangeString(), teamDomain: 'warda-core', tokenCredentialId: 'warda-team-build-warda-ui-slack-token'
    }
    changed {
      echo 'This will run only if the state of the Pipeline has changed'
    }
  }

}
