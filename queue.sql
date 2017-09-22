DROP DATABASE IF EXISTS puppies;
CREATE DATABASE puppies;

\c puppies;

CREATE TABLE pups (
  ID SERIAL PRIMARY KEY,
  name VARCHAR,
  breed VARCHAR,
  age INTEGER,
  sex VARCHAR
);

INSERT INTO pups (name, breed, age, sex)
  VALUES ('Tyler', 'Retrieved', 3, 'M');


CREATE TABLE "Registration" (
	userId SERIAL PRIMARY KEY,
	firstName VARCHAR NOT NULL,
	lastName VARCHAR NOT NULL,
	email VARCHAR NOT NULL,
	password VARCHAR NOT NULL,
	mobileNumber VARCHAR NOT NULL,
	verificationCode INTEGER NULL 
)
;
COMMENT ON COLUMN "Registration"."userId" IS E'';
COMMENT ON COLUMN "Registration"."firstName" IS E'';
COMMENT ON COLUMN "Registration"."lastName" IS E'';
COMMENT ON COLUMN "Registration"."email" IS E'';
COMMENT ON COLUMN "Registration"."password" IS E'';
COMMENT ON COLUMN "Registration"."mobileNumber" IS E'';
COMMENT ON COLUMN "Registration"."verificationCode" IS E'';