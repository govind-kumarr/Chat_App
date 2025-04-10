# Raw Queries

```js
/**
 * 1. Find all personal chats
 * 2. Remove yourself from participants
 * 3. Populate chat (Perform lookup)
 * 4. Populate Last Message
 */

db.chats.aggregate([
  {
    type: "personal",
    $match: {
      people: {
        $size: 2,
      },
    },
  },
  {
    $addFields: {
      recipient: {
        $filter: {
          input: "$people",
          as: "peopleId",
          cond: { $ne: ["$$peopleId", ObjectId("576865c0bab6cf2f2fb39d7a")] },
        },
      },
    },
  },
  {
    $project: {
      people: 0,
    },
  },
  {
    $lookup: {
      from: "people",
      localField: "recipient",
      foreignField: "_id",
      as: "recipientDetails",
    },
  },
  {
    $unwind: {
      path: "$recipientDetails",
    },
  },
  {
    $project: {
      recipient: 0,
    },
  },
]);
```

```js
/**
 * 1. Find all group chats
 * 2. Remove yourself from participants
 * 3. Populate chat (Perform lookup)
 */

db.chats.aggregate([
  {
    type: "group",
    $match: {
      people: {
        $size: 2,
        $in: [userId],
      },
    },
  },
  {
    $lookup: {
      from: "people",
      localField: "people",
      foreignField: "_id",
      as: "participantDetails",
    },
  },
]);
```

```js
// Remove duplicate users
const users = db.chats.find({_id: {$nin: userIdsArr}});
```
