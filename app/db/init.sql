DROP TABLE Subject-Job;
DROP TABLE Course;
DROP TABLE Job;
DROP TABLE Subject;

CREATE TABLE Job (
	id SERIAL PRIMARY KEY,
	name VARCHAR(256),
	provider VARCHAR(256),
	image VARCHAR(256),
	company VARCHAR(256),
	link VARCHAR(256),
	description TEXT
);

CREATE TABLE Subject (
	id SERIAL PRIMARY KEY,
	name VARCHAR(256),
	provider VARCHAR(256),
	image VARCHAR(256),
	price NUMERIC(7,2),
	instructor VARCHAR(256),
	link VARCHAR(256),
	description TEXT
);

CREATE TABLE Course (
	id SERIAL PRIMARY KEY,
	name VARCHAR(256),
	provider VARCHAR(256),
	image VARCHAR(256),
	price NUMERIC(7,2),
	instructor VARCHAR(256),
	link VARCHAR(256),
	description TEXT,
	subject_id INTEGER REFERENCES Subject(id)
);

CREATE TABLE Subject_Job (
	subject_id INTEGER REFERENCES Subject(id),
	job_id INTEGER REFERENCES Job(id),
	PRIMARY KEY(subject_id, job_id)
);