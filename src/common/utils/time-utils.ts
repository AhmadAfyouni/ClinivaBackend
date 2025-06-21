import { WorkingHoursBase, ShiftBase } from './base.helper';

interface TimeRange {
  startTime: string;
  endTime: string;
}

export function isTimeInRange(time: string, startTime: string, endTime: string): boolean {
  const [timeHours, timeMinutes] = time.split(':').map(Number);
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':');

  // Handle invalid time formats
  if (isNaN(timeHours) || isNaN(timeMinutes) || isNaN(startHours) || isNaN(startMinutes) || !endHours || !endMinutes) {
    return false;
  }

  const timeInMinutes = timeHours * 60 + timeMinutes;
  const startInMinutes = startHours * 60 + startMinutes;
  let endInMinutes = Number(endHours) * 60 + Number(endMinutes);

  // Handle overnight shifts (e.g., 22:00 to 06:00)
  if (endInMinutes <= startInMinutes) {
    endInMinutes += 24 * 60; // Add 24 hours to end time
    const adjustedTime = timeInMinutes < startInMinutes ? timeInMinutes + 24 * 60 : timeInMinutes;
    return adjustedTime >= startInMinutes && adjustedTime <= endInMinutes;
  }

  return timeInMinutes >= startInMinutes && timeInMinutes <= endInMinutes;
}

export function isShiftWithinComplexHours(
  clinicShift: TimeRange,
  complexShifts: TimeRange[]
): boolean {
  return complexShifts.some(complexShift => {
    if (!complexShift || !complexShift.startTime || !complexShift.endTime) return false;
    
    // Check if clinic shift starts and ends within any of the complex shifts
    return (
      isTimeInRange(clinicShift.startTime, complexShift.startTime, complexShift.endTime) &&
      isTimeInRange(clinicShift.endTime, complexShift.startTime, complexShift.endTime)
    );
  });
}

interface WorkingHoursWithOptionalShifts extends Omit<WorkingHoursBase, 'shift1' | 'shift2'> {
  shift1: Partial<ShiftBase>;
  shift2?: Partial<ShiftBase>;
}

export function validateEmployeeWorkingHours(
  employeeWorkingHours: WorkingHoursWithOptionalShifts[],
  parentWorkingHours: WorkingHoursWithOptionalShifts[],
  parentType: 'clinic' | 'complex' = 'clinic'
): void {
  if (!employeeWorkingHours || employeeWorkingHours.length === 0) {
    return; // No working hours to validate
  }

  const dayMap = new Map<string, WorkingHoursWithOptionalShifts>();
  
  // Create a map of parent working hours by day
  parentWorkingHours?.forEach(day => {
    if (day?.day) {
      dayMap.set(day.day, day);
    }
  });

  // Check each day in employee working hours
  for (const employeeDay of employeeWorkingHours) {
    if (!employeeDay?.day) continue;
    
    const parentDay = dayMap.get(employeeDay.day);
    
    if (!parentDay) {
      throw new Error(`Employee has working hours for ${employeeDay.day}, but the ${parentType} is closed that day`);
    }

    // Check shift1
    if (employeeDay.shift1?.startTime && employeeDay.shift1?.endTime) {
      const parentShifts: TimeRange[] = [];
      
      // Add parent shifts if they exist
      if (parentDay.shift1?.startTime && parentDay.shift1?.endTime) {
        parentShifts.push({
          startTime: parentDay.shift1.startTime,
          endTime: parentDay.shift1.endTime
        });
      }
      
      if (parentDay.shift2?.startTime && parentDay.shift2?.endTime) {
        parentShifts.push({
          startTime: parentDay.shift2.startTime,
          endTime: parentDay.shift2.endTime
        });
      }

      if (parentShifts.length > 0 && !isShiftWithinComplexHours(
        { 
          startTime: employeeDay.shift1.startTime, 
          endTime: employeeDay.shift1.endTime 
        },
        parentShifts
      )) {
        throw new Error(
          `Employee's working hours (${employeeDay.shift1.startTime}-${employeeDay.shift1.endTime}) on ${employeeDay.day} ` +
          `are outside the ${parentType}'s operating hours`
        );
      }
    }

    // Check shift2 if it exists
    if (employeeDay.shift2?.startTime && employeeDay.shift2?.endTime) {
      const parentShifts: TimeRange[] = [];
      
      // Add parent shifts if they exist
      if (parentDay.shift1?.startTime && parentDay.shift1?.endTime) {
        parentShifts.push({
          startTime: parentDay.shift1.startTime,
          endTime: parentDay.shift1.endTime
        });
      }
      
      if (parentDay.shift2?.startTime && parentDay.shift2?.endTime) {
        parentShifts.push({
          startTime: parentDay.shift2.startTime,
          endTime: parentDay.shift2.endTime
        });
      }

      if (parentShifts.length > 0 && !isShiftWithinComplexHours(
        { 
          startTime: employeeDay.shift2.startTime, 
          endTime: employeeDay.shift2.endTime 
        },
        parentShifts
      )) {
        throw new Error(
          `Employee's working hours (${employeeDay.shift2.startTime}-${employeeDay.shift2.endTime}) on ${employeeDay.day} ` +
          `are outside the ${parentType}'s operating hours`
        );
      }
    }
  }
}

export function validateClinicWorkingHours(
  clinicWorkingHours: WorkingHoursWithOptionalShifts[],
  complexWorkingHours: WorkingHoursWithOptionalShifts[]
): void {
  const dayMap = new Map<string, WorkingHoursWithOptionalShifts>();
  
  // Create a map of complex working hours by day
  complexWorkingHours.forEach(complexDay => {
    if (complexDay?.day) {
      dayMap.set(complexDay.day, complexDay);
    }
  });

  // Check each day in clinic working hours
  for (const clinicDay of clinicWorkingHours) {
    if (!clinicDay?.day) continue;
    
    const complexDay = dayMap.get(clinicDay.day);
    
    if (!complexDay) {
      throw new Error(`Clinic has working hours for ${clinicDay.day}, but the complex is closed that day`);
    }

    // Check if shift1 exists and has valid times
    if (clinicDay.shift1?.startTime && clinicDay.shift1?.endTime) {
      const complexShifts: TimeRange[] = [];
      
      // Add complex shifts if they exist
      if (complexDay.shift1?.startTime && complexDay.shift1?.endTime) {
        complexShifts.push({
          startTime: complexDay.shift1.startTime,
          endTime: complexDay.shift1.endTime
        });
      }
      
      if (complexDay.shift2?.startTime && complexDay.shift2?.endTime) {
        complexShifts.push({
          startTime: complexDay.shift2.startTime,
          endTime: complexDay.shift2.endTime
        });
      }

      if (complexShifts.length > 0 && !isShiftWithinComplexHours(
        { startTime: clinicDay.shift1.startTime, endTime: clinicDay.shift1.endTime },
        complexShifts
      )) {
        throw new Error(
          `Clinic's working hours (${clinicDay.shift1.startTime}-${clinicDay.shift1.endTime}) on ${clinicDay.day} ` +
          `are outside the complex's operating hours`
        );
      }
    }

    // Check shift 2 if it exists and has valid times
    if (clinicDay.shift2?.startTime && clinicDay.shift2?.endTime) {
      const complexShifts: TimeRange[] = [];
      
      // Add complex shifts if they exist
      if (complexDay.shift1?.startTime && complexDay.shift1?.endTime) {
        complexShifts.push({
          startTime: complexDay.shift1.startTime,
          endTime: complexDay.shift1.endTime
        });
      }
      
      if (complexDay.shift2?.startTime && complexDay.shift2?.endTime) {
        complexShifts.push({
          startTime: complexDay.shift2.startTime,
          endTime: complexDay.shift2.endTime
        });
      }

      if (complexShifts.length > 0 && !isShiftWithinComplexHours(
        { startTime: clinicDay.shift2.startTime, endTime: clinicDay.shift2.endTime },
        complexShifts
      )) {
        throw new Error(
          `Clinic's working hours (${clinicDay.shift2.startTime}-${clinicDay.shift2.endTime}) on ${clinicDay.day} ` +
          `are outside the complex's operating hours`
        );
      }
    }
  }
}
