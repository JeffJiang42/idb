DROP TABLE Subject_Job;
DROP TABLE Course_Job;
DROP TABLE Course;
DROP TABLE Job;
DROP TABLE Subject;

CREATE TABLE Job (
	id SERIAL PRIMARY KEY,
	name VARCHAR(256),
	company VARCHAR(256),
	description TEXT,
	image VARCHAR(256),
	link VARCHAR(256),
	provider VARCHAR(256),
    courses VARCHAR(2048),
    subjects_ids VARCHAR(2048)
);

CREATE TABLE Subject (
	id SERIAL PRIMARY KEY,
	subject VARCHAR(256),
	provider VARCHAR(256),
	image VARCHAR(256),
	courses VARCHAR(2048),
    jobs VARCHAR(2048)
);

CREATE TABLE Course (
	id SERIAL PRIMARY KEY,
	course VARCHAR(256),
    description TEXT,
    image VARCHAR(256),
    instructor VARCHAR(256),
    link VARCHAR(256),
    price VARCHAR(256),
    subject VARCHAR(2048),
    provider VARCHAR(256),
    jobs VARCHAR(2048),
    subject_id INTEGER REFERENCES Subject(id)
);

CREATE TABLE Subject_Job (
	subject_id INTEGER REFERENCES Subject(id),
	job_id INTEGER REFERENCES Job(id),
	PRIMARY KEY(subject_id, job_id)
);

CREATE TABLE Course_Job (
	course_id INTEGER REFERENCES Course(id),
	job_id INTEGER REFERENCES Job(id),
	PRIMARY KEY(course_id, job_id)
);