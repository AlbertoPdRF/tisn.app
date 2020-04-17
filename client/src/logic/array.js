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
