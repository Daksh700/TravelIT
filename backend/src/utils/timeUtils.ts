export const timeStringToMin = (timeString: string): number => {
    const cleanStr = timeString.trim().toUpperCase();

    const isPm = cleanStr.includes("PM");
    const isAm = cleanStr.includes("AM");

    const timeOnly = cleanStr.replace("AM", "").replace("PM", "").trim();
    const timeParts = timeOnly.split(":");

    let hours = Number(timeParts[0]);
    const mins = Number(timeParts[1]);

    if(isPm && hours != 12) {
        hours += 12
    }
    else if(isAm && hours === 12) {
        hours = 0;
    }

    const timeInMins = (hours * 60) + mins;

    return timeInMins;
}

export const minutesToTimeStr = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    const formattedHrs = hours.toString().padStart(2, '0');
    const formattedMins = mins.toString().padStart(2, '0');

    return `${formattedHrs}:${formattedMins}`
}

export const getDurationFromTimeRange = (timeRange: string): number => {
    try {
        if (!timeRange.includes("-")) return 90; 

        const parts = timeRange.split("-");
        const startStr = parts[0].trim();
        const endStr = parts[1].trim();

        const startMins = timeStringToMin(startStr);
        const endMins = timeStringToMin(endStr);

        let duration = endMins - startMins;

        if (duration < 0) {
            duration += 24 * 60; 
        }

        return duration > 0 ? duration : 90; 
    } catch (error) {
        return 90; 
    }
}