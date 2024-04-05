export function convertObjectToFormData(o: Object) {
  return Object.entries(o).reduce(
    (d, e) => (d.append(...e), d),
    new FormData()
  );
}

export function getImageFullUrl(image_url_end: string | undefined): string {
  const fullUrl = `${process.env.API_HOST}/${image_url_end}`;
  return fullUrl;
};

export function getCammafiedNumber(num: number): string {
  const inputnum = num.toString()
  let commafied = inputnum.split('').map((char, index) => {
    if (char) return `${char}${ ","}`
  }).toString()
  return commafied;
}
