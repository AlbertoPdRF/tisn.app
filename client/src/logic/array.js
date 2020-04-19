export const classifyEvents = (events, referenceDate) => {
  const current = [];
  const past = [];
  events.forEach((event) => {
    if (new Date(event.startDate) >= referenceDate) {
      current.push(event);
    } else {
      past.push(event);
    }
  });

  past.reverse();
  return { current, past };
};

export const groupComments = (comments) => {
  const commentsGroups = {};
  const groupedComments = [];

  comments.forEach((comment) => {
    if (!comment.parentComment && !commentsGroups[comment._id]) {
      commentsGroups[comment._id] = [];
      groupedComments.push({
        comment,
        nestedComments: commentsGroups[comment._id],
      });
    }

    if (comment.parentComment) {
      commentsGroups[comment.parentComment].push(comment);
    }
  });

  return groupedComments.reverse();
};

export const groupInterests = (interests) => {
  const interestsGroups = {};
  const groupedInterests = [];

  interests
    .sort((a, b) => -b.category.name.localeCompare(a.category.name))
    .forEach((interest) => {
      if (!interestsGroups[interest.category.name]) {
        interestsGroups[interest.category.name] = [];
        groupedInterests.push({
          category: interest.category,
          interests: interestsGroups[interest.category.name],
        });
      }
      interestsGroups[interest.category.name].push(interest);
    });

  return groupedInterests;
};
