# REST API for puzzlepieces

JavsScript, Node.js (express, bcrypt, body-parser, cors, dotenv, jsonwebtoken, pg, nodemon), Postgresql

## user routes

### `/api/user`, GET, `auth`

_expected_: jwt token\
_returned_:

```javascript
{
    createdAt: timestamptz,
    email: string,
    handle: string,
    id: number,
    imageUrl: string,
    bio: stirng,
    website: string,
    location: string
 }
```

### `/api/user/:handle`, GET

_expected:_ user handle\
_returned:_

```javascript
    user: {
        createdAt: timestamptz,
        email: string,
        handle: string,
        id: number,
        imageUrl: string,
        bio: stirng,
        website: string,
        location: string
    },
    puzzlepieces: [
        {
            pbody: string,
            createdAt: timestampz,
            userHandle: string,
            userImage: string,
            likeCount: number,
            commentCount: number,
            puzzlepieceId: number
        },
        {...}
    ]
```

### `/api/signup`, POST

_expected:_

```javascript
    {
        email: string,
        password: string,
        confirmPassword: string,
        handle: string
    }
```

_returned:_ jwt token

### `/api/login`, POST

expected:

```javascript
    {
        email: string,
        password: string
    }
```

returned: jwt token

### `/api/user`, POST, `auth`

_expected:_ jwt token (header),

```javascript
    {
        bio: string,
        website: string,
        location: string
    }
```

_returned_: message

## puzzlepiece routes

### `/puzzlepieces`, GET

_expected:_ nothing\
_returned:_

```js
    [
        {
            puzzlepieceId: number,
            body: string,
            userHandle: string,
            createdAt: timestamptz,
            commentCount: number,
            likeCount: number,
            userImage: string,
            ppType: string,
            ppURL: string
        },
        {...}
    ]
```

### `/puzzlepiece/:puzzlepieceId`, GET

_expected:_ puzzlepieceId\
_returned:_

```js
    {
        puzzlepieceId: number,
        body: string,
        userHandle: string,
        createdAt: timestamptz,
        commentCount: number,
        likeCount: number,
        userImage: string,
        ppType: string,
        ppURL: string
    }
```

### `/puzzlepiece/:puzzlepieceId/like`, GET, `auth`

### `/puzzlepiece/:puzzlepieceId/unlike`, GET, `auth`

_expected:_ jwt token, puzzlepieceId\
_returned:_

```js
    {
        puzzlepieceId: number,
        body: string,
        userHandle: string,
        createdAt: timestamptz,
        commentCount: number,
        likeCount: number,
        userImage: string,
        ppType: string,
        ppURL: string
    }
```

### `/puzzlepiece`, POST, `auth`

_expected:_ jwt token

```javascript
    {
        body: string,
        ppType: string,
        ppURL: string
    }
```

_returned:_

```js
    {
        body: string,
        userHandle: string,
        userImage: string,
        ppType: string,
        ppURL: string,
        createdAt: timestamptz,
        likeCount: number,
        commentCount: number,
        userId: number
    }
```

### `/puzzlepiece/:puzzlepieceId/comment`, POST, `auth`

_expected:_ jwt token, puzzlepieceId

```js
{
  body: string;
}
```

_returned:_

```js
    {
        id: number,
        body: string,
        createdAt: timestamptz,
        puzzlepieceId:number,
        userHandle: string,
        userImage: string,
        userId: number
    }
```

##### `/puzzlepiece/:puzzlepieceId`, DELETE, `auth`

_expected:_ jwt token, puzzlepieceId
_returned:_ message
