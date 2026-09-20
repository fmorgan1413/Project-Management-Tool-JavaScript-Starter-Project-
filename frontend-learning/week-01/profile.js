const name = "Faith";
const age = 24;
const currentJob = "Project Manager";
const yearsProgramming = 5;
const favoriteGame = "The Last of Us Part II";
const learningJavascript = true;

console.log(`Name: ${name} 
 Age: ${age} 
 Current Job: ${currentJob} 
 Years Programming: ${yearsProgramming} 
 Favorite Game: ${favoriteGame} 
 Learning Javascript: ${learningJavascript}`);

const projectName = "Frontend Learning";
const totalTasks = 10; 
let completedTasks = 6;

let isComplete = completedTasks === totalTasks;
let remainingTasks = totalTasks - completedTasks;

console.log(`Project Name: ${projectName} 
 Remaining Tasks: ${remainingTasks}
 Is Complete: ${isComplete}`);

if (completedTasks > totalTasks) {
  console.log("You have completed more tasks than the total number of tasks. Please check your task count.");
} else if (completedTasks < totalTasks) {
  console.log("You still have tasks to complete. Keep going!");
} else{
  console.log("All tasks are completed.");
}