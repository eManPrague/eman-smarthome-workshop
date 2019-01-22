
export const isStringNumber = (value: string) => {
    value = value.replace(/,/g, '.')
    const num = Number(value)

    if (isNaN(num)) { 
      return false;
    }
    return true;
  }