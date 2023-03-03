//Checks if a string is a url value
export function isValidUrl(text) {
  var pattern =
    /^(?:https?:\/\/)?(?:[\w_-]+(?:\.[\w_-]+)\.){1,}(?:[a-zA-Z]{2,63})(?:\/[\w@?^=%&/~+#-]*)?$/i;
  return pattern.test(text);
}
