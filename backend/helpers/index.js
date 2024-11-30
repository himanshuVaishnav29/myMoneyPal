export const formatName = (name) => {
    if (!name) return '';
    const [firstName, ...lastNameParts] = name.split(' ');
    const formattedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
    const formattedLastName = lastNameParts.join(' ').toLowerCase();
    return `${formattedFirstName} ${formattedLastName}`;
  };