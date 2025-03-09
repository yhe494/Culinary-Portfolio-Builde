pipeline {
    agent any
    tools {
        nodejs 'NodeJS' 
    }
    environment {
        BRANCH_NAME = "${env.BRANCH_NAME}"
        MAIN_BRANCH = "main"
    }

    stages {
        stage('Block Direct Push to Main') {
            steps {
                script {
                    if (BRANCH_NAME == MAIN_BRANCH) {
                        error "❌ Direct push to 'main' is not allowed! Please create a Pull Request."
                    }
                }
            }
        }

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Frontend') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Start Backend & Verify') {
            steps {
                script {
                    sh 'npm run start & sleep 5 && curl --fail http://localhost:5001 || exit 1'
                }
            }
        }

        stage('Start Frontend & Verify') {
            steps {
                script {
                    sh 'npm run dev -- --host & sleep 5 && curl --fail http://localhost:5173 || exit 1'
                }
            }
        }

        stage('Verify PR Approval') {
            steps {
                script {
                    def approval = input(
                        message: "Has this PR been reviewed and approved?",
                        parameters: [booleanParam(name: 'Approved', defaultValue: false, description: 'Check if approved')]
                    )
                    if (!approval) {
                        error "❌ Merge rejected: PR must be approved before merging."
                    }
                }
            }
        }

        stage('Merge to Main') {
            when {
                branch 'feature/*'  // Ensures only feature branches are merged
            }
            steps {
                script {
                    sh '''
                    git checkout main
                    git merge --no-ff ${BRANCH_NAME}
                    git push origin main
                    '''
                }
            }
        }
    }
}
