var coursesJSON = require('./courses.json');
for (var course in coursesJSON) {
  console.log(course);
  console.log(coursesJSON[course]);
};
