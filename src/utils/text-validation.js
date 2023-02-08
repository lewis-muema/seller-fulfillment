//Checks if a string is a url value
export function isValidUrl(text) {
  var pattern =
    /^(http:\/\/|https:\/\/)?([a-zA-Z0-9]+)\.([a-zA-Z0-9]+)\.([a-zA-Z0-9]+)/gi;
  return pattern.test(text);
}
