

export function readFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    var reader = new FileReader();
    reader.onload = function () {
      resolve(reader.result as string);
    };
    reader.onerror = function () {
      reject();
    }
    reader.readAsText(file);
  })
}
