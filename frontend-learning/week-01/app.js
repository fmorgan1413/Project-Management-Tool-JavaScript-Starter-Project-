import readline from 'readline';
import { projects, getValidProjectSummaries , 
    getProjectsByPriority , getProjectByName , 
    isProjectValid , getProjectReport} from './projects.js';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

showMenu();


function showMenu() {
    console.log('=== Project Manager ===');
    console.log('1. View Projects');
    console.log('2. View High Priority Projects');
    console.log('3. Find Project');
    console.log('4. View Project Report');
    console.log('5. Exit');

    rl.question('Choose an option: ', (option) => {
        switch (option) {
            case '1':
                console.log('Viewing all projects...');
                displayProjects(projects);
                showMenu();
                break;
            case '2':
                console.log('Viewing high priority projects...');
                displayProjects(getProjectsByPriority(projects, 'High'));
                showMenu();
                break;
            case '3':
                rl.question('Enter the project name: ', (name) => {
                    const project = getProjectByName(projects, name);

                    if (!project) {
                        console.log('Project not found.');
                        showMenu();
                        return;
                    }

                    const isValid = isProjectValid(project);
                    
                    if (isValid) {
                        displayProjects([project]);
                    } else {
                        console.log('Invalid project.');
                    }
                    showMenu();
                });
                break;
            case '4':
                const report = getProjectReport(projects);

                console.log('=== Project Report ===');
                console.log(`Total Projects: ${report.totalProjects}`);
                console.log(`Valid Projects: ${report.validProjects}`);
                console.log(`High Priority Projects: ${report.highPriorityProjects}`);
                showMenu();
                break;
            case '5':
                console.log('Exiting...');
                rl.close();
                break;
            default:
                console.log('Invalid option. Please try again.');
                showMenu();
        }
    });

    
}

function displayProjects(projects) {
    console.log('=== Viewing Projects ===');

    const summaries = getValidProjectSummaries(projects);
    summaries.forEach((summary) => {
        console.log(`Project Name: ${summary.name}
        Priority: ${summary.priority}
        Completion: ${summary.completionPercentage.toFixed(2)}%
        Status: ${summary.status}
        Remaining Tasks: ${summary.remainingTasks}`);
        }
    );
} 