export const projects = [
    {
        name: 'Frontend Learning',
        priority: 'High',
        totalTasks: 10,
        completedTasks: 6
    },
    {
        name: 'Portfolio Website',
        priority: 'Medium',
        totalTasks: 30,
        completedTasks: 0
    },
    {
        name: 'Retro Game Collection',
        priority: 'Low',
        totalTasks: 40,
        completedTasks: 3
    },
    {
        name: 'Task Tracker',
        priority: 'High',
        totalTasks: 20,
        completedTasks: 10
    },
    {
        name: 'Hello World',
        priority: 'Low',
        totalTasks: 5,
        completedTasks: 5
    },
    {
        name: 'Broken Project',
        totalTasks: 10,
        completedTasks: 15,
        priority: 'High'
    }
];

export function getCompletionPercentage(project) {
    if (project.totalTasks === 0) {
        return 0;
    }
    return (project.completedTasks / project.totalTasks) * 100;
}

export function getProjectStatus(project) {
    const completionPercentage = getCompletionPercentage(project);

    if (completionPercentage === 100) {
        return "Complete";
    } else if (completionPercentage >= 76) {
        return "Nearly Complete";
    } else if (completionPercentage >= 26) {
        return "In Progress";
    } else {
        return "Not Started";
    }
}

function getRemainingTasks(project) {
    return project.totalTasks - project.completedTasks;
}

export function getProjectsByPriority(projects, priority) {
    return projects.filter((project) => project.priority === priority);
}


export function getProjectSummary(project) {
    
    if (!isProjectValid(project)) {
        return null;
    }

    return {
        name: project.name,
        priority: project.priority,
        completionPercentage: getCompletionPercentage(project),
        status: getProjectStatus(project),
        remainingTasks: getRemainingTasks(project)
    };
}

export function isProjectValid(project) {
    if (!project.name || typeof project.name !== 'string') {
        return false;
    }
    if (isNaN(project.totalTasks) || isNaN(project.completedTasks)) {
        return false;
    }
    if (project.totalTasks < 0 || project.completedTasks < 0 || project.completedTasks > project.totalTasks) {
        return false;
    }
    if (Number.isInteger(project.totalTasks) === false || Number.isInteger(project.completedTasks) === false) {
        return false;
    }
    if (!project.priority || typeof project.priority !== 'string') {
        return false;
    }
    if (project.priority.toLowerCase().trim() !== 'high' && project.priority.toLowerCase().trim() !== 'medium' && project.priority.toLowerCase().trim() !== 'low') {
        return false;
    }
    return true;
}

export function normalizeProject(project) {
    if (project.priority.toLowerCase().trim() === 'high') {
        project.priority = 'High';
    } else if (project.priority.toLowerCase().trim() === 'medium') {
        project.priority = 'Medium';
    } else if (project.priority.toLowerCase().trim() === 'low') {
        project.priority = 'Low';
    }
}

export function getValidProjectSummaries(projects) {
    return projects.filter((project) => isProjectValid(project)).map((project) => getProjectSummary(project));
}

export function getProjectByName(projects, name) {
    return projects.find((project) => project.name.toLowerCase().trim() === name.toLowerCase().trim());
}

export function getProjectReport(projects){
    return {
        totalProjects: projects.length,
        validProjects: projects.filter((project) => isProjectValid(project)).length,
        highPriorityProjects: projects.filter((project) => isProjectValid(project) && project.priority === "High").length,
    }
}