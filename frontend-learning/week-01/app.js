import readline from 'readline';
import { projects, getValidProjectSummaries , 
    getProjectsByPriority , getProjectByName , 
    isProjectValid , getProjectReport , normalizeProject } from './projects.js';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


showMenu();

async function showMenu() {
    try{
        while (true) {
        console.log('=== Project Manager ===');
        console.log('1. View Projects');
        console.log('2. View High Priority Projects');
        console.log('3. Find Project');
        console.log('4. View Project Report');
        console.log('5. Exit');
        console.log('6. Create Project');
        console.log('7. Delete Project');
        console.log('8. Update Project');

        const option = await askQuestion('Choose an option: ');

        switch (option) {
            case '1':
                console.log('Viewing all projects...');
                displayProjects(projects);
                break;
            case '2':
                console.log('Viewing high priority projects...');
                displayProjects(getProjectsByPriority(projects, 'High'));
                break;
            case '3':
                const name = await askQuestion('Enter the project name: ');
                const project = getProjectByName(projects, name);

                if (!project) {
                    console.log('Project not found.');
                    break;
                }

                const isValid = isProjectValid(project);
                        
                if (isValid) {
                    displayProjects([project]);
                } else {
                    console.log('Invalid project.');
                }
                break;
            case '4':
                const report = getProjectReport(projects);

                console.log('=== Project Report ===');
                console.log(`Total Projects: ${report.totalProjects}`);
                console.log(`Valid Projects: ${report.validProjects}`);
                console.log(`High Priority Projects: ${report.highPriorityProjects}`);
                break;
            case '5':
                console.log('Exiting...');
                rl.close();
                return;
            default:
                console.log('Invalid option. Please try again.');
                break;
            case '6': {
                const name = await askQuestion('Enter project name: ');
                const newProject = await askForProjectDetails(name);
                
                normalizeProject(newProject);
                if (!isProjectValid(newProject)) {
                    console.log('Invalid project details. Please try again.');
                    break;
                }

                projects.push(newProject);
                console.log('Project created successfully.');
                console.log('Project Details:');
                displayProjects([newProject]);
                break;
            }
            case '7':{
                const name = await askQuestion('Enter project name to delete: ');
                const projectIndex = projects.findIndex((project) => project.name.toLowerCase().trim() === name.toLowerCase().trim());
                if (projectIndex === -1) {
                    console.log('Project not found.');
                } else {
                    projects.splice(projectIndex, 1);
                    console.log('Project deleted successfully.');
                }
                break;
            }
            case '8':{
                const name = await askQuestion('Enter project name to update: ');
                const projectIndex = projects.findIndex((project) => project.name.toLowerCase().trim() === name.toLowerCase().trim());
                if (projectIndex === -1) {
                    console.log('Project not found.');
                    break;
                }

                const updatedProjectDetails = await askForProjectDetails(name);
                const updatedProject = { ...projects[projectIndex], ...updatedProjectDetails };
                normalizeProject(updatedProject);
                if (!isProjectValid(updatedProject)) {
                    console.log('Invalid project details. Please try again.');
                    break;
                }
                projects[projectIndex] = updatedProject;
                console.log('Project updated successfully.');
                console.log('Updated Project Details:');
                displayProjects([updatedProject]);
                break;
            }
        }
        }
    } catch (error) {
        console.log('Something went wrong.');
        console.log(error.message);
    }
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

function askQuestion(question) {
    return new Promise((resolve, reject) => {
        try {
            rl.question(question, (answer) => {
                resolve(answer);
            });
        } catch (error) {
            reject(error);
        }
    });
}

async function askForProjectDetails(name) {
    const priority = await askQuestion('Enter the project priority (High, Medium, Low): ');

    let totalTasks = Number(await askQuestion('Enter the total number of tasks: '));
    while (!Number.isFinite(totalTasks) || totalTasks < 0) {
        console.log('Invalid input. Please enter a valid number.');
        totalTasks = Number(await askQuestion('Enter the total number of tasks: '));
    }

    let completedTasks = Number(await askQuestion('Enter the number of completed tasks: '));
    while (!Number.isFinite(completedTasks) || completedTasks < 0 || completedTasks > totalTasks) {
        console.log('Invalid input. Please enter a valid number of completed tasks.');
        completedTasks = Number(await askQuestion('Enter the number of completed tasks: '));
    }

    const project = {
        name,
        priority,
        totalTasks,
        completedTasks
    };
    
    return project;
}

async function testInput(){
    const name = await askQuestion('Enter the project name: ');
    console.log(`You entered the project name: ${name}`);
    rl.close();
}

function testErrorHandling() {
    try {
        console.log('Before error');

        const project = null;
        console.log(project.name);
        console.log('After error');
    } catch (error) {
        console.error(error.message);
    } 

    console.log('Program continues');
}