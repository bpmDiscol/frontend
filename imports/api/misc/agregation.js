export function getSimpleLookup(from, localField, foreignField) {
  return [
    {
      $lookup: {
        from,
        localField,
        foreignField,
        as: localField,
      },
    },
    { $unwind: localField },
    {
      $project: {
        [`${localField}._id`]: 0,
      },
    },
  ];
}

export function getArrayLookup(from, localField, foreignField) {
  return [
    {
      $lookup: {
        from,
        localField,
        foreignField,
        as: "search",
      },
    },
    { $unwind: "search" },
    {
      $group: {
        id: "$_id",
        details: { $first: "$$ROOT" },
        subDetails: { $push: "$search" },
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: ["$details", { [localField]: "$subDetails" }],
        },
      },
    },
  ];
}

export function getPagination(page, pageSize) {
  return {
    $facet: {
      metadata: [{ $count: "totalCount" }],
      data: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
    },
  };
}
