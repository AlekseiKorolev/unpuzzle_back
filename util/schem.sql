CREATE TABLE comments (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    body TEXT NOT NULL,
    createdat TIMESTAMPTZ NOT NULL,
    puzzlepieceid BIGINT NOT NULL,
    userhandle VARCHAR(200) NOT NULL,
    userimage VARCHAR(200) NOT NULL,
    userid BIGINT NOT NULL
);

CREATE TABLE likes (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    puzzlepieceid BIGINT NOT NULL,
    userhandle VARCHAR(200) NOT NULL,
    userid BIGINT NOT NULL
);

CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    recipient BIGINT NOT NULL,
    sender BIGINT NOT NULL,
    createdat TIMESTAMPTZ NOT NULL,
    puzzlepieceid BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL,
    read BOOLEAN NOT NULL,
    userid BIGINT NOT NULL
);

CREATE TABLE puzzlepieces (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    body TEXT NOT NULL,
    userhandle VARCHAR(200) NOT NULL,
    userimage VARCHAR(200) NOT NULL,
    pptype VARCHAR(200),
    ppurl VARCHAR(200),
    createdat TIMESTAMPTZ NOT NULL,
    likecount SMALLINT DEFAULT 0 NOT NULL,
    commentcount SMALLINT DEFAULT 0 NOT NULL,
    userid BIGINT NOT NULL
);

CREATE TABLE users (
    id BIGSERIAL NOT NULL,
    handle VARCHAR(200) NOT NULL UNIQUE,
    email VARCHAR(200) NOT NULL UNIQUE,
    password VARCHAR(200) NOT NULL,
    createdat TIMESTAMPTZ NOT NULL,
    imageurl VARCHAR(200) DEFAULT 'https://firebasestorage.googleapis.com/v0/b/unpuzzle-ad500.appspot.com/o/no-img.png?alt=media'::character varying,
    bio VARCHAR(200),
    website VARCHAR(200),
    location VARCHAR(200)
);
