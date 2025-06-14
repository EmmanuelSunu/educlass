export function formatDuration(duration: string): string {
  // Extract hours and minutes from duration string
  const hours = duration.toLowerCase().includes('hour') ? 
    parseInt(duration.match(/(\d+)\s*hours?/)?.[1] || '0') : 0;
  const minutes = duration.toLowerCase().includes('minute') ? 
    parseInt(duration.match(/(\d+)\s*minutes?/)?.[1] || '0') : 0;

  if (hours > 0 && minutes > 0) {
    return `${hours}H ${minutes}M`;
  } else if (hours > 0) {
    return `${hours}H`;
  } else {
    return `${minutes}M`;
  }
} 