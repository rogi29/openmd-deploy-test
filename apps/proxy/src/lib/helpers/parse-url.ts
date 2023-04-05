const HTTPS_PROTOCOL = 'https:';

export const parseURL = (rawURL: string) => {
  const url = new URL(rawURL);
  url.port = parseURLPort(url).toString();
  return url;
};

const parseURLPort = (url: URL) =>
  url.port
    ? Number.parseInt(url.port)
    : url.protocol === HTTPS_PROTOCOL
    ? 443
    : 80;
