//Checks if a string is a url value
export function isValidUrl(text) {
  var pattern = /^(?:(https|http):\/\/)(?:[\w_-]+(?:\.[\w_-]+)){1,}/i;
  return pattern.test(text);
}
