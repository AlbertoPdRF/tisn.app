const getOrdinalSuffix = (n) =>
  ['st', 'nd', 'rd'][((((n + 90) % 100) - 10) % 10) - 1] || 'th';

export const buildValidationErrorsObject = (errors) => {
  const errorsObject = {};
  errors.forEach((error) => {
    let key = error.param.split('.')[1];
    let number;
    if (key.includes('[')) {
      const splitted = key.split('[');
      key = splitted[0];
      number = splitted[1].slice(0, -1);
    }

    if (!errorsObject[key]) {
      if (!number) {
        errorsObject[key] = error.msg;
      } else {
        errorsObject[key] = `${parseInt(number) + 1}${getOrdinalSuffix(
          number
        )} ${key.slice(0, -1)} ${error.msg}`;
      }
    }
  });

  return errorsObject;
};

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
