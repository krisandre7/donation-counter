export function brazilianRealToFloat(realString: string): number {
    // Remove all non-numeric and non-decimal point characters
    const cleanedString = realString.replace('.', '');
  
    // Replace the decimal comma with a decimal point
    const formattedString = cleanedString.replace(',', '.');
  
    // Parse the formatted string as a float
    const floatValue = parseFloat(formattedString);
  
    return floatValue;
  }