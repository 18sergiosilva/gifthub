const sonarqubeScanner = require('sonarqube-scanner');

sonarqubeScanner({
    serverUrl: 'http://localhost:9000',
    options: {
        'sonar.sources': '.',
        'sonar.tests': 'tests',
        'sonar.inclusions': '**', // Entry point of your code
        'sonar.test.inclusions': 'tests/*.test.js',
        'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
        'sonar.testExecutionReportPaths': 'coverage/test-sonar.xml'
    }
}, () => {});