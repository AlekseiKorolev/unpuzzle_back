exports.convertCredentials = credentials => {
  return {
    createdAt: credentials.createdat,
    email: credentials.email,
    handle: credentials.handle,
    id: credentials.id,
    imageUrl: credentials.imageurl,
    bio: credentials.bio,
    website: credentials.website,
    location: credentials.location
  };
};

exports.convertLike = like => {
  return {
    id: like.id,
    puzzlepieceId: like.puzzlepieceid,
    userHandle: like.userhandle,
    userId: like.userid
  };
};

exports.convertComment = comment => {
  return {
    id: comment.id,
    body: comment.body,
    createdAt: comment.createdat,
    puzzlepieceId: comment.puzzlepieceid,
    userHandle: comment.userhandle,
    userImage: comment.userimage,
    userId: comment.userId
  };
};

exports.convertPPMin = pp => {
  return {
    pbody: pp.body,
    createdAt: pp.createdat,
    userHandle: pp.userhandle,
    userImage: pp.userimage,
    likeCount: pp.likecount,
    commentCount: pp.commentcount,
    puzzlepieceId: pp.id
  };
};

exports.convertPP = pp => {
  return {
    puzzlepieceId: pp.id,
    body: pp.body,
    userHandle: pp.userhandle,
    createdAt: pp.createdat,
    commentCount: pp.commentcount,
    likeCount: pp.likecount,
    userImage: pp.userimage,
    ppType: pp.pptype ? pp.pptype : null,
    ppURL: pp.ppurl ? pp.ppurl : null
  };
};
