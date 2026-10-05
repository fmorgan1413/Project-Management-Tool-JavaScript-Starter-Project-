import {describe , test} from 'node:test'
import assert from 'node:assert'

import {getCompletionPercentage , getProjectStatus , isProjectValid , 
    normalizeProject , getProjectsByPriority , getProjectByName ,
     getProjectSummary , getValidProjectSummaries , getProjectReport} from './projects.js'
function createTestProject(overrides = {}){
    return {
        name: "Test Project",
        priority: "High",
        totalTasks: 10,
        completedTasks: 5,
        ...overrides
    };
}

describe('getCompletionPercentage', () => {
    test('getCompletionPercentage returns 50 given a project with 10 total tasks and 5 completed tasks', () => {
        const project = { totalTasks: 10, completedTasks: 5 };
        const result = getCompletionPercentage(project);
        assert.strictEqual(result, 50);
    });

    test('getCompletionPercentage returns 0 given a project with 0 total tasks', () => {
        const project = { totalTasks: 0, completedTasks: 0 };
        const result = getCompletionPercentage(project);
        assert.strictEqual(result, 0);
    });
});

describe('getProjectStatus', () => {
    test('getProjectStatus returns "Complete" given a project with 100% completion', () => {
        const project = { totalTasks: 10, completedTasks: 10 };
        const result = getProjectStatus(project);
        assert.strictEqual(result, "Complete");
    });

    test('getProjectStatus returns "Nearly Complete" given a project with 80% completion', () => {
        const project = { totalTasks: 10, completedTasks: 8 };
        const result = getProjectStatus(project);
        assert.strictEqual(result, "Nearly Complete");
    });

    test('getProjectStatus returns "In Progress" given a project with 50% completion', () => {
        const project = { totalTasks: 10, completedTasks: 5 };
        const result = getProjectStatus(project);
        assert.strictEqual(result, "In Progress");
    });

    test('getProjectStatus returns "Not Started" given a project with 10% completion', () => {
        const project = { totalTasks: 10, completedTasks: 1 };
        const result = getProjectStatus(project);
        assert.strictEqual(result, "Not Started");
    });

    test('getProjectStatus returns "Nearly Complete" given a project with 76% completion', () => {
        const project = { totalTasks: 100, completedTasks: 76 };
        const result = getProjectStatus(project);
        assert.strictEqual(result, "Nearly Complete");
    });

    test('getProjectStatus returns "In Progress" given a project with 75% completion', () => {
        const project = { totalTasks: 4, completedTasks: 3 };
        const result = getProjectStatus(project);
        assert.strictEqual(result, "In Progress");
    });

    test('getProjectStatus returns "In Progress" given a project with 26% completion', () => {
        const project = { totalTasks: 100, completedTasks: 26 };
        const result = getProjectStatus(project);
        assert.strictEqual(result, "In Progress");
    });

    test('getProjectStatus returns "Not Started" given a project with 25% completion', () => {
        const project = { totalTasks: 4, completedTasks: 1 };
        const result = getProjectStatus(project);
        assert.strictEqual(result, "Not Started");
    });
});

describe('isProjectValid', () => {
    test('A valid project returns true', () => {
        const project = createTestProject();

        const result = isProjectValid(project);
        assert.strictEqual(result, true);
    });

    test('A project without a name returns false', () => {
        const project = createTestProject({ name: "" });

        const result = isProjectValid(project);
        assert.strictEqual(result, false);
    });

    test('A project with more completed tasks than total tasks returns false', () => {
        const project = createTestProject({ completedTasks: 15 });

        const result = isProjectValid(project);
        assert.strictEqual(result, false);
    });

    test('A project with a negative number of total tasks returns false', () => {
        const project = createTestProject({ totalTasks: -1 });

        const result = isProjectValid(project);
        assert.strictEqual(result, false);
    });
    test('A project with a negative number of completed tasks returns false', () => {
        const project = createTestProject({ completedTasks: -1 });

        const result = isProjectValid(project);
        assert.strictEqual(result, false);
    });

    test('A project with a non numeric total tasks returns false', () => {
        const project = createTestProject({ totalTasks: "ten" });

        const result = isProjectValid(project);
        assert.strictEqual(result, false);
    });
    test('A project with a non numeric completed tasks returns false', () => {
        const project = createTestProject({ completedTasks: "five" });

        const result = isProjectValid(project);
        assert.strictEqual(result, false);
    });

    test('A project with an invalid priority returns false', () => {
        const project = createTestProject({ priority: "Urgent" });

        const result = isProjectValid(project);
        assert.strictEqual(result, false);
    });

    test('A project with a Medium priority returns true', () => {
        const project = createTestProject({ priority: "Medium" });

        const result = isProjectValid(project);
        assert.strictEqual(result, true);
    });
    test('A project with a Low priority returns true', () => {
        const project = createTestProject({ priority: "Low" });

        const result = isProjectValid(project);
        assert.strictEqual(result, true);
    });

    test('isProjectValid returns false when the project name is not a string', () => {
        const project = createTestProject({ name: 123 });

        const result = isProjectValid(project);
        assert.strictEqual(result, false);
    });

    test('isProjectValid returns false when the totalTasks is NaN', () => {
        const project = createTestProject({ totalTasks: NaN });

        const result = isProjectValid(project);
        assert.strictEqual(result, false);
    });

    test('isProjectValid returns false when the completedTasks is NaN', () => {
        const project = createTestProject({ completedTasks: NaN });

        const result = isProjectValid(project);
        assert.strictEqual(result, false);
    });

    test('isProjectValid returns false when the priority is not a string', () => {
        const project = createTestProject({ priority: 123 });

        const result = isProjectValid(project);
        assert.strictEqual(result, false);
    });
});

describe('normalizeProject', () => {
    test('A project with a "high" priority normalizes to "High"', () => {
        const project = createTestProject({ priority: "high" });

        normalizeProject(project);
        assert.strictEqual(project.priority, "High");
    });

    test('A project with a " high " priority normalizes to "High"', () => {
        const project = createTestProject({ priority: " high " });

        normalizeProject(project);
        assert.strictEqual(project.priority, "High");
    });

    test('A project with a "HIGH" priority normalizes to "High"', () => {
        const project = createTestProject({ priority: "HIGH" });

        normalizeProject(project);
        assert.strictEqual(project.priority, "High");
    });

    test('A project with a "low" priority normalizes to "Low"', () => {
        const project = createTestProject({ priority: "low" });

        normalizeProject(project);
        assert.strictEqual(project.priority, "Low");
    });
    test('A project with a "medium" priority normalizes to "Medium"', () => {
        const project = createTestProject({ priority: "medium" });

        normalizeProject(project);
        assert.strictEqual(project.priority, "Medium");
    });
});

describe('getProjectsByPriority', () => {
    test('getProjectsByPriority returns projects with a "High" priority', () => {
        const projects = [
            createTestProject({ name: "Project A", priority: "High" }),
            createTestProject({ name: "Project B", priority: "Medium" }),
            createTestProject({ name: "Project C", priority: "High" })
        ];

        const result = getProjectsByPriority(projects, "High");
        assert.strictEqual(result.length, 2);
        assert.strictEqual(result[0].priority, "High");
        assert.strictEqual(result[1].priority, "High");
    });

    test('getProjectsByPriority returns an empty array when no projects have the specified priority', () => {
        const projects = [
            createTestProject({ name: "Project A", priority: "Medium" }),
            createTestProject({ name: "Project B", priority: "Low" })
        ];

        const result = getProjectsByPriority(projects, "High");
        assert.deepStrictEqual(result, []);
    });

    test('getProjectsByPriority returns an empty array when there are no projects', () => {
        const projects = [];
        const result = getProjectsByPriority(projects, "High");
        assert.deepStrictEqual(result, []);
    });
});

describe('getProjectByName', () => {
    test('getProjectByName returns the project with the specified name', () => {
        const projects = [
            createTestProject({ name: "Project A", priority: "High" }),
            createTestProject({ name: "Project B", priority: "Medium" })
        ];

        const result = getProjectByName(projects, "Project A");
        const expected = projects[0];
        assert.deepStrictEqual(result, expected);
    });

    test('getProjectByName returns "Project A" when given "project a"', () => {
        const projects = [
            createTestProject({ name: "Project A", priority: "High" }),
            createTestProject({ name: "Project B", priority: "Medium" })
        ];

        const result = getProjectByName(projects, "project a");
        const expected = projects[0];
        assert.deepStrictEqual(result, expected);
    });

    test('getProjectByName returns "Project A" when given " Project A "', () => {
        const projects = [
            createTestProject({ name: "Project A", priority: "High" }),
            createTestProject({ name: "Project B", priority: "Medium" })
        ];

        const result = getProjectByName(projects, " Project A ");
        const expected = projects[0];
        assert.deepStrictEqual(result, expected);
    });

    test('getProjectByName returns undefined when no project has the specified name', () => {
        const projects = [
            createTestProject({ name: "Project A", priority: "High" }),
            createTestProject({ name: "Project B", priority: "Medium" })
        ];

        const result = getProjectByName(projects, "Project C");
        assert.strictEqual(result, undefined);
    });

    test('getProjectByName returns undefined when projects array is empty', () => {
        const projects = [];
        const result = getProjectByName(projects, "Project A");
        assert.strictEqual(result, undefined);
    });
});

describe('getProjectSummary', () => {
    test('getProjectSummary returns the correct summary for a project', () => {
        const project = createTestProject({ name: "Project A", priority: "High" , totalTasks: 10, completedTasks: 5});
        const result = getProjectSummary(project);
        const expected = {
            name: "Project A",
            priority: "High",
            completionPercentage: 50,
            status: "In Progress",
            remainingTasks: 5
        };
        assert.deepStrictEqual(result, expected);
    });

    test('getProjectSummary returns null for an invalid project', () => {
        const project = createTestProject({completedTasks: 15});
        const result = getProjectSummary(project);
        assert.strictEqual(result, null);
    });
});

describe('getValidProjectSummaries', () => {
    test('getValidProjectSummaries returns summaries for all valid projects', () => {
        const projects = [
            createTestProject({ name: "Project A", priority: "High" , totalTasks: 10, completedTasks: 5}),
            createTestProject({ name: "Project C", priority: "Low" , totalTasks: 5, completedTasks: 10}),
            createTestProject({ name: "Project B", priority: "Medium" , totalTasks: 20, completedTasks: 10})
        ];
        const result = getValidProjectSummaries(projects);
        const expected = [
            {
                name: "Project A",
                priority: "High",
                completionPercentage: 50,
                status: "In Progress",
                remainingTasks: 5
            },
            {
                name: "Project B",
                priority: "Medium",
                completionPercentage: 50,
                status: "In Progress",
                remainingTasks: 10
            }
        ];
        assert.deepStrictEqual(result, expected);
    });

    test('getValidProjectSummaries returns an empty array when no projects are valid', () => {
        const projects = [
            createTestProject({completedTasks: 15}),
            createTestProject({name: "Project C", priority: "Urgent" , totalTasks: 5, completedTasks: 3})
        ];
        const result = getValidProjectSummaries(projects);
        assert.deepStrictEqual(result, []);
    });
});

describe('getProjectReport', () => {
    test('getProjectReport returns the correct report for a set of projects', () => {
        const projects = [
            createTestProject({ name: "Project A", priority: "High" , totalTasks: 10, completedTasks: 5}),
            createTestProject({ name: "Project B", priority: "High" , totalTasks: 20, completedTasks: 30}),
            createTestProject({ name: "Project C", priority: "High" , totalTasks: 15, completedTasks: 10}),
            createTestProject({ name: "Project D", priority: "Medium" , totalTasks: 25, completedTasks: 20})
        ];
        const result = getProjectReport(projects);
        const expected = {
            totalProjects: 4,
            validProjects: 3,
            highPriorityProjects: 2
        };
        assert.deepStrictEqual(result, expected);
    });

    test('getProjectReport returns a report with 0 for all counts when the project array is empty', () => {
        const projects = [];
        const result = getProjectReport(projects);
        const expected = {
            totalProjects: 0,
            validProjects: 0,
            highPriorityProjects: 0
        };
        assert.deepStrictEqual(result, expected);
    });
});
