export function validateInput(inputValue, maxLength = 15) {
  return inputValue.length > 0 && inputValue.length <= maxLength;
}

  