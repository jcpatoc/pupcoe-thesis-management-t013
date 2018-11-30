CREATE TABLE "defense" (
  "id" SERIAL PRIMARY KEY,
  "panel_id" INT REFERENCES panel(id),
  "proponents_id" INT REFERENCES group(id),
  "title_id" INT REFERENCES titles(id),
  "defense_type" INT REFERENCES stages(id),
  "status" VARCHAR(255),
  "date" timestamp default current_timestamp
);

CREATE TABLE "thesis" (
  "id" SERIAL PRIMARY KEY,
  "stage_id" INT REFERENCES stages(id),
  "group_id" INT REFERENCES group(id),
  "current_defense_id" INT REFERENCES defense(id),
  "current_title_id" INT REFERENCES titles(id)
);

CREATE TABLE "panel" (
  "id" SERIAL PRIMARY KEY,
  "head_panel_id" INT REFERENCES users(id),
  "panel_members_id" INT REFERENCES users(id)
);

CREATE TABLE "titles" (
  "id" SERIAL PRIMARY KEY,
  "proposals" VARCHAR(255)
);

CREATE TABLE "groups" (
  "id" SERIAL PRIMARY KEY,
  "members_id" INT REFERENCES users(id),
  "class_id" INT REFERENCES classes(id),
  "titles_id" INT REFERENCES titles(id)
);

CREATE TABLE "stages" (
  "id" SERIAL PRIMARY KEY,
  "stages" VARCHAR(255)
);


CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "fname" VARCHAR(100),
  "lname" VARCHAR(100),
  "email" VARCHAR(100),
  "password" VARCHAR(100),
  "user_type" VARCHAR(20),
  "is_admin" BOOLEAN,
  "phone" VARCHAR(100),
  "employee_id" VARCHAR(100),
  "student_number" VARCHAR(100)
);

CREATE TABLE "batches" (
  "id" SERIAL PRIMARY KEY,
  "batches" INT
);

CREATE TABLE "year_levels" (
  "id" SERIAL PRIMARY KEY,
  "year_levels" VARCHAR(20)
);

CREATE TABLE "sections" (
  "id" SERIAL PRIMARY KEY,
  "sections" INT
);

CREATE TABLE "classes" (
  "id" SERIAL PRIMARY KEY,
  "batch_id" INT REFERENCES batches(id),
  "year_level_id" INT REFERENCES year_levels(id),
  "adviser_id" INT REFERENCES users(id),
  "section_id" INT REFERENCES sections(id)
);

CREATE TABLE "class_students" (
  "id" SERIAL PRIMARY KEY,
  "class_id" INT REFERENCES classes(id),
  "student_id" INT REFERENCES users(id)
);

insert into users (fname, lname, email, password, user_type, is_admin, phone, employee_id) values ('Joanne', 'Patoc', 'patocjoanne9@gmail.com', 'Admin123', 'Admin', 't', '09212752081','000');
