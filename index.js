
const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

/* ********************************************************************** */

/*
app.get();
app.post();
app.put();
app.delete();
*/

/* ********************************************************************** */

// Courses
const courses = [
    { id: 1, name: 'course1', code: 'CSE123' },
    { id: 2, name: 'course2', code: 'CSE223' },
    { id: 3, name: 'course3', code: 'CSE323' },
    { id: 4, name: 'course4', code: 'CSE423' }
];

const courseCodeRegex = /[a-zA-Z]{3}\d{3}/;

// First Page
app.get('/', (req, res) => {
    res.sendFile(__dirname +"/index.html");
    // res.send(200);
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});
/*
app.post('/', async (req,res)=>{
    let course = new Course({
        name: req.body.name,
        code: req.body.code,
        description: req.body.description
    })
    course = await course.save();

    if(!course)
        return res.status(400).send('the course cannot be created!')

    res.send(course);
})
*/
app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
        // return;
    }
    
    const course = {
        id: courses.length + 1,  // automatic id
        name: req.body.name,
        code: req.body.code,
        description: req.body.description
    };
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) {
        return res.status(404).send('The course with the given ID was not found');  //404
        // return;
    }

    const { error } = validateCourse(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
        // return;
    }

    course.name = req.body.name;
    course.code = req.body.code;
    course.description = req.body.description;
    res.send(course);
});

function validateCourse(course){
    const schema = {
        name: Joi.string().min(5).required(),
        code: Joi.string().regex(courseCodeRegex).required(),
        description: Joi.string().max(200).optional().allow('')
    };

    return Joi.validate(course, schema);
};

app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course)  return res.status(404).send('The course with the given ID was not found');  //404

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course)  return res.status(404).send('The course with the given ID was not found');  //404
    res.send(course);
});

/* ********************************************************************** */

// Students
const students = [
    { id: 1, name: 'student1', code: '123re54' },
    { id: 2, name: 'student2', code: 'yur75re' },
    { id: 3, name: 'student3', code: '22ww33d' },
    { id: 4, name: 'student4', code: '123sxd4' }
];

const studentCodeRegex = /[a-zA-Z0-9]{7}/;

// First Page
app.get('/', (req, res) => {
    res.sendFile(__dirname +"/index.html");
    // res.send(200);
});

app.get('/api/students', (req, res) => {
    res.send(students);
});
/*
app.post('/', async (req,res)=>{
    let student = new Student({
        name: req.body.name,
        code: req.body.code
    })
    student = await student.save();

    if(!student)
        return res.status(400).send('the student cannot be created!')

    res.send(student);
})
*/
app.post('/api/students', (req, res) => {
    const { error } = validateStudent(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
        // return;
    }
    
    const student = {
        id: students.length + 1,  // automatic id
        name: req.body.name,
        code: req.body.code
    };
    students.push(student);
    res.send(student);
});

app.put('/api/students/:id', (req, res) => {
    const student = students.find(c => c.id === parseInt(req.params.id));
    if(!student) {
        return res.status(404).send('The student with the given ID was not found');  //404
        // return;
    }

    const { error } = validateStudent(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
        // return;
    }

    student.name = req.body.name;
    student.code = req.body.code;
    res.send(student);
});

function validateStudent(student){
    const schema = {
        name: Joi.string().required(),
        code: Joi.string().regex(studentCodeRegex).required()
    };

    return Joi.validate(student, schema);
};

app.delete('/api/students/:id', (req, res) => {
    const student = students.find(c => c.id === parseInt(req.params.id));
    if(!student)  return res.status(404).send('The student with the given ID was not found');  //404

    const index = students.indexOf(student);
    students.splice(index, 1);

    res.send(student);
});

app.get('/api/students/:id', (req, res) => {
    const student = students.find(c => c.id === parseInt(req.params.id));
    if(!student)  return res.status(404).send('The student with the given ID was not found');  //404
    res.send(student);
});

/* ********************************************************************** */

// Connection
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));