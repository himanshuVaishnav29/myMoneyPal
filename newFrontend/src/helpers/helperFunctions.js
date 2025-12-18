import { getUserTimezone } from "./timezoneHelper";

export const formatName = (name) => {
    if (!name) return '';
    const [firstName, ...lastNameParts] = name.split(' ');
    const formattedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
    const formattedLastName = lastNameParts.join(' ').toLowerCase();
    return `${formattedFirstName} ${formattedLastName}`;
  };

export const calculateStepSize=(maxValue)=>{
  if (maxValue < 1000) {
    return 100; 
  } else if (maxValue < 1500) {
    return 500; 
  }
  else if (maxValue < 10000) {
    return 1500; 
  }else if(maxValue < 15000){
    return 1500;
  }
  else if (maxValue < 100000) {
    return 5000;
  } else {
    return 10000; 
  }
}

export const calculateYMax = (data) => {
  const maxValue = Math.max(...data);
  const buffer = maxValue * 0.1; // Adding a buffer of 10%
  
  // Round to the nearest higher increment based on the max value range
  if (maxValue <= 1000) {
    return Math.ceil((maxValue + buffer) / 100) * 100;
  } else if (maxValue <= 10000) {
    return Math.ceil((maxValue + buffer) / 1000) * 1000;
  } else if (maxValue <= 100000) {
    return Math.ceil((maxValue + buffer) / 10000) * 10000;
  } else {
    return Math.ceil((maxValue + buffer) / 50000) * 50000;
  }
};


export const formatCurrency = (amount) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(2)} k`;
    return `₹${amount.toFixed(2)}`;
  };

export const checkWeatherSeason = () => {
  // 1. Check Environment Variable (Vite)
  // If the flag is NOT 'true', return false immediately (Feature disabled)
  const isFeatureEnabled = import.meta.env.VITE_ENABLE_SNOWFALL == 'Y';
  
  if (!isFeatureEnabled) {
    return false;
  }

  // 2. If Enabled, check the season logic
  try {
    const timezone = getUserTimezone();
    const month = new Date().getMonth(); // 0 = Jan, 11 = Dec

    // List of common Southern Hemisphere timezone indicators
    const southernHemisphereIndicators = [
      'australia', 'antarctica', 'argentina', 'santiago', 'sao_paulo',
      'johannesburg', 'auckland', 'wellington', 'cape_town', 'harare',
      'lima', 'buenos_aires', 'montevideo', 'hobart', 'melbourne',
      'sydney', 'brisbane', 'perth', 'adelaide'
    ];

    const lowerTz = timezone ? timezone.toLowerCase() : "";
    const isSouthern = southernHemisphereIndicators.some(indicator => lowerTz.includes(indicator));

    if (isSouthern) {
      // Southern Hemisphere Winter: June (5), July (6), August (7)
      return [5, 6, 7].includes(month);
    } else {
      // Northern Hemisphere Winter: December (11), January (0), February (1)
      return [11, 0, 1].includes(month);
    }
  } catch (error) {
    console.error("Error determining season:", error);
    return false;
  }
};